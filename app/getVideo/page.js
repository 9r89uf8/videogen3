// pages/getVideo.js
'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/app/store/store';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { getVideo, getVideos } from '@/app/services/postsService';

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
            let data = await getVideo({ id });
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

    // Destructure response details (if available).
    const taskData = result?.data?.data;
    const statusMessage = result?.data?.data.task_status;
    const taskStatusMessage = result?.data?.data.task_status_msg;

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

            {/* Form to lookup video by manually entering a Task ID */}
            <Card variant="outlined" sx={{ mb: 4 }}>
                <CardContent>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Task ID"
                            variant="outlined"
                            value={taskId}
                            onChange={(e) => setTaskId(e.target.value)}
                            required
                            fullWidth
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{ alignSelf: 'flex-end' }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Lookup Video'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Display lookup result from the external API */}
            {result && (
                <Box sx={{ mb: 4 }}>
                    {result.error ? (
                        <Alert severity="error">{result.error}</Alert>
                    ) : (
                        <>
                            {statusMessage && (
                                <>
                                    <Alert
                                        severity={statusMessage === 'SUCCEED' ? 'success' : 'info'}
                                        sx={{ mb: 2 }}
                                    >
                                        {statusMessage}
                                    </Alert>
                                    <h5>{taskStatusMessage}</h5>
                                </>

                            )}

                            {taskData &&
                                taskData.task_status === 'succeed' &&
                                taskData.task_result?.videos && (
                                    <Box sx={{ mb: 4 }}>
                                        {taskData.task_result.videos.map((video) => (
                                            <Box key={video.id} sx={{ mb: 3 }}>
                                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                                    Video Duration: {video.duration} seconds
                                                </Typography>
                                                <video width="100%" controls style={{ borderRadius: 4 }}>
                                                    <source src={video.url} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                        </>
                    )}
                </Box>
            )}

            {/* List of generated videos from Firebase */}
            <Box>
                <Typography variant="h5" gutterBottom>
                    My Generated Videos
                </Typography>
                {(!videos || videos.length === 0) ? (
                    <Typography>No videos found.</Typography>
                ) : (
                    videos.map((video) => (
                        <Card key={video.task_id} variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">
                                    Task ID: {video.task_id}
                                </Typography>
                                <Typography variant="body1">
                                    Prompt: {video.prompt}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Created At: {new Date(video.created_at).toLocaleString()}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleLookup(video.task_id)}
                                    >
                                        Lookup Video
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </Container>
    );
}



