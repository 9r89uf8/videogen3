// components/LookupResult.js
'use client';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

export default function LookupResult({ result }) {
    if (!result) return null;

    const taskData = result?.data?.data;
    const statusMessage = result?.data?.data?.task_status;
    const taskStatusMessage = result?.data?.data?.task_status_msg;

    return (
        <Box sx={{ mb: 4 }}>
            {result.error ? (
                <Alert severity="error">{result.error}</Alert>
            ) : (
                <>
                    {statusMessage && (
                        <>
                            <Alert severity={statusMessage === 'SUCCEED' ? 'success' : 'info'} sx={{ mb: 2 }}>
                                {statusMessage}
                            </Alert>
                            <Typography variant="h6">{taskStatusMessage}</Typography>
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
    );
}
