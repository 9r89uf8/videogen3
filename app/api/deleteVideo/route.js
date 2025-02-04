// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {

        const { postId } = await req.json();

        // Reference to the specific post document
        const postRef = adminDb.firestore().collection('videos').doc(postId);

        // Get the post document
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }


        // Delete the post
        await postRef.delete();

        // Return the ID of the deleted post
        return NextResponse.json({ deletedPostId: postId }, { status: 200 });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}