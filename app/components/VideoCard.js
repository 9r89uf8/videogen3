// components/VideoCard.js
'use client';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { deleteVideo } from "@/app/services/postsService";

export default function VideoCard({ video, onLookup, onRegenerate }) {
    const [editing, setEditing] = useState(false);
    const [newPrompt, setNewPrompt] = useState(video.prompt);
    const [negativePrompt, setNegativePrompt] = useState(video.negativePrompt || "");
    const [regenLoading, setRegenLoading] = useState(false);
    const [regenError, setRegenError] = useState(null);

    const handleRegenerateSubmit = async () => {
        setRegenLoading(true);
        setRegenError(null);
        try {
            // Pass both the new prompt and the negative prompt to the callback
            await onRegenerate(video.id, newPrompt, negativePrompt);
            setEditing(false);
        } catch (error) {
            setRegenError(error.message);
        }
        setRegenLoading(false);
    };

    const handleDelete = async () => {
        try {
            await deleteVideo({postId: video.id});
        } catch (error) {
            console.error("Error deleting video:", error);
        }
    };

    return (
        <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7, mb: 2 }}>
                    {video.task_id}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
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

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <Button variant="contained" onClick={() => onLookup(video.task_id)}>
                        Lookup
                    </Button>
                    <Button variant="outlined" onClick={() => setEditing(!editing)}>
                        Regenerate
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Delete
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
                        <TextField
                            label="Negative Prompt"
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 2 }}
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                        />
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
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

