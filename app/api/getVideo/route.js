// pages/api/generateVideo.js
import jwt from 'jsonwebtoken';

export async function POST(req) {

    // Get image URL and prompt from the client
    const { id } = await req.json();


    // Retrieve API credentials from environment variables
    const API_ACCESS_KEY = process.env.API_ACCESS_KEY;
    const API_SECRET_KEY = process.env.API_SECRET_KEY;
    if (!API_ACCESS_KEY || !API_SECRET_KEY) {
        console.log('no API ACCESS_KEY')
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Generate a JWT token for authentication
    // This follows the Java sample: valid for 30 minutes and active immediately (using notBefore: '-5s')
    const token = jwt.sign({}, API_SECRET_KEY, {
        algorithm: 'HS256',
        issuer: API_ACCESS_KEY,
        expiresIn: 1800,      // 30 minutes in seconds
        notBefore: '-5s'
    });

    try {
        // Call the external API using the fetch API.
        const response = await fetch(`https://api.klingai.com/v1/videos/image2video/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log(data)

        return new Response(JSON.stringify({data: data}), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}