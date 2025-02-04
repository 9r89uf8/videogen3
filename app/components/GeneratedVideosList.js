// components/GeneratedVideosList.js
'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import VideoCard from './VideoCard';

export default function GeneratedVideosList({ videos, onLookup, onRegenerate }) {
    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                My Generated Videos
            </Typography>
            {(!videos || videos.length === 0) ? (
                <Typography>No videos found.</Typography>
            ) : (
                videos.map((video) => (
                    <VideoCard key={video.id} video={video} onLookup={onLookup} onRegenerate={onRegenerate} />
                ))
            )}
        </Box>
    );
}
