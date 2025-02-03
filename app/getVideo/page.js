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
// Import your existing service functions, and add one for regeneration.
import { getVideo, getVideos, regenerateVideo } from '@/app/services/postsService';

/**
 * VideoCard Component
 * Displays the video’s thumbnail, details, and two buttons:
 * - Lookup Video: calls the lookup function (onLookup)
 * - Regenerate Video: toggles an edit form to update the prompt and submit it
 */
function VideoCard({ video, onLookup, onRegenerate }) {
    const [editing, setEditing] = useState(false);
    const [newPrompt, setNewPrompt] = useState(video.prompt);
    const [regenLoading, setRegenLoading] = useState(false);
    const [regenError, setRegenError] = useState(null);

    const handleRegenerateSubmit = async () => {
        setRegenLoading(true);
        setRegenError(null);
        try {
            await onRegenerate(video.id, newPrompt);
            setEditing(false);
        } catch (error) {
            setRegenError(error.message);
        }
        setRegenLoading(false);
    };

    return (
        <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        opacity: 0.7,
                        mb: 2
                    }}
                >
                    {video.task_id}
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                }}>
                    {video.image && (
                        <Box>
                            <img
                                src={video.image}
                                width={300}
                                style={{ borderRadius: 4 }}
                                alt="Video thumbnail"
                            />
                        </Box>
                    )}
                    <Typography variant="body1" sx={{ textAlign: 'center' }}>
                        {video.prompt}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Created At: {new Date(video.created_at).toLocaleString()}
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    mt: 2
                }}>
                    <Button variant="contained" onClick={() => onLookup(video.task_id)}>
                        Lookup
                    </Button>
                    <Button variant="outlined" onClick={() => setEditing(!editing)}>
                        Regenerate
                    </Button>
                </Box>

                {editing && (
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label="Edit Prompt"
                            variant="outlined"
                            fullWidth
                            value={newPrompt}
                            onChange={(e) => setNewPrompt(e.target.value)}
                        />
                        <Box sx={{
                            mt: 1,
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleRegenerateSubmit}
                                disabled={regenLoading}
                            >
                                {regenLoading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Submit Regeneration'
                                )}
                            </Button>
                        </Box>
                        {regenError && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {regenError}
                            </Typography>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

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
    // It sends the updated prompt (and the task ID) to the backend.
    const handleRegenerate = async (taskId, newPrompt) => {
        try {
            // Call your backend API (or service function) to regenerate the video.
            const data = await regenerateVideo({ id: taskId, prompt: newPrompt });
            console.log('Video regeneration initiated:', data);
            // Optionally update your store or show a confirmation message here.
        } catch (error) {
            console.error('Error regenerating video:', error);
            throw error;
        }
    };

    // Destructure response details (if available).
    const taskData = result?.data?.data;
    const statusMessage = result?.data?.data?.task_status;
    const taskStatusMessage = result?.data?.data?.task_status_msg;

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
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <TextField
                            placeholder="Enter Task ID"
                            variant="outlined"
                            value={taskId}
                            onChange={(e) => setTaskId(e.target.value)}
                            required
                            fullWidth
                            InputProps={{
                                sx: {
                                    '& input': {
                                        textAlign: 'center'
                                    }
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
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
                        <VideoCard
                            key={video.id}
                            video={video}
                            onLookup={handleLookup}
                            onRegenerate={handleRegenerate}
                        />
                    ))
                )}
            </Box>
        </Container>
    );
}




