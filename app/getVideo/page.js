// pages/getVideo.js
'use client';

import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useStore } from '@/app/store/store';
import { getVideo, getVideos, regenerateVideo } from '@/app/services/postsService';

import VideoLookupForm from "@/app/components/VideoLookupForm";
import LookupResult from '@/app/components/LookupResult';
import GeneratedVideosList from '@/app/components/GeneratedVideosList';

export default function GetVideo() {
    const [taskId, setTaskId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Assume that the store property "posts" contains the list of video records.
    const videos = useStore((state) => state.posts);

    // Fetch all videos from Firebase on component mount.
    useEffect(() => {
        async function fetchAllVideos() {
            await getVideos();
        }
        fetchAllVideos();
    }, []);

    // Function to look up a video by its task ID.
    const handleLookup = async (id) => {
        setLoading(true);
        setResult(null);
        try {
            const data = await getVideo({ id });
            setResult(data);
        } catch (error) {
            setResult({ error: error.message });
        }
        setLoading(false);
    };

    // Handler for the lookup form submission.
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!taskId) return;
        await handleLookup(taskId);
    };

    // Function to handle video regeneration.
    const handleRegenerate = async (taskId, newPrompt, negativePrompt) => {
        try {
            const data = await regenerateVideo({ id: taskId, prompt: newPrompt, negativePrompt: negativePrompt });
            console.log('Video regeneration initiated:', data);
            // Optionally update your store or show a confirmation message here.
        } catch (error) {
            console.error('Error regenerating video:', error);
            throw error;
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            {/* Title and instructions */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Retrieve Your Video
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Enter your task ID below to check the status and view your video.
                </Typography>
            </Box>

            {/* Lookup form */}
            <VideoLookupForm
                taskId={taskId}
                setTaskId={setTaskId}
                handleSubmit={handleSubmit}
                loading={loading}
            />

            {/* Lookup result display */}
            <LookupResult result={result} />

            {/* List of generated videos */}
            <GeneratedVideosList
                videos={videos}
                onLookup={handleLookup}
                onRegenerate={handleRegenerate}
            />
        </Container>
    );
}





