// app/api/posts/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';


export async function GET() {
    try {
        const girlsCollection = await adminDb
            .firestore()
            .collection('videos')  // Add this line to sort by priority in descending order
            .get();

        const girls = [];
        girlsCollection.forEach(doc => {
            girls.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return new Response(JSON.stringify(girls), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}