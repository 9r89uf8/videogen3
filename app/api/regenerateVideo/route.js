// pages/api/generateVideo.js
import jwt from 'jsonwebtoken';
import { uploadToFirebaseStorage } from "@/app/middleware/firebaseStorage";
import { adminDb } from '@/app/utils/firebaseAdmin';
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req) {
    // Get form data from the client
    const { id, prompt } = await req.json();

    console.log(id);

    const videoDoc = adminDb.firestore().collection('videos').doc(id);

    // Fetch the existing video data
    const videoSnapshot = await videoDoc.get();
    if (!videoSnapshot.exists) {
        return NextResponse.json({ error: 'video not found' }, { status: 404 });
    }
    const videoData = videoSnapshot.data();

    // Retrieve API credentials from environment variables
    const API_ACCESS_KEY = process.env.API_ACCESS_KEY;
    const API_SECRET_KEY = process.env.API_SECRET_KEY;
    if (!API_ACCESS_KEY || !API_SECRET_KEY) {
        return new Response(
            JSON.stringify({ error: 'Unauthorized' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({}, API_SECRET_KEY, {
        algorithm: 'HS256',
        issuer: API_ACCESS_KEY,
        expiresIn: 1800, // 30 minutes in seconds
        notBefore: '-5s'
    });

    // Build the payload for the external video generation API.
    // Note: The property names in your payload should match what the API expects.
    const payload = {
        model_name: videoData.model,
        mode: 'pro',
        duration: videoData.duration, // Duration in seconds
        image: videoData.image,      // The URL of the uploaded image
        prompt,        // The prompt provided by the user
        cfg_scale: parseInt(videoData.creativity),
        negative_prompt: videoData.negativePrompt,
        timestamp: adminDb.firestore.FieldValue.serverTimestamp()
        // Include additional fields if necessary
    };

    try {
        // Call the external video generation API
        const response = await fetch('https://api.klingai.com/v1/videos/image2video', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // Save the record in Firestore if the external API returns a successful response
        // The expected response structure:
        // {
        //   data: {
        //     code: 0,
        //     message: "SUCCEED",
        //     request_id: "...",
        //     data: {
        //       task_id: "...",
        //       task_status: "submitted",
        //       created_at: 1738458842268,
        //       updated_at: 1738458842268
        //     }
        //   }
        // }
        console.log(data)
        if (data && data.message === "SUCCEED") {
            const record = {
                task_id: data.data.task_id,  // The task ID from the external API
                prompt: prompt,                    // The prompt sent by the user
                image: videoData.image,
                created_at: data.data.created_at // The creation timestamp (Unix ms)
            };

            // Save the record in the "videos" collection in Firestore
            await adminDb.firestore().collection('videos').add(record);
        }

        return new Response(
            JSON.stringify({ data: data }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error creating video:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}