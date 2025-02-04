// components/VideoLookupForm.js
'use client';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function VideoLookupForm({ taskId, setTaskId, handleSubmit, loading }) {
    return (
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
                                '& input': { textAlign: 'center' }
                            }
                        }}
                    />
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Lookup Video'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
