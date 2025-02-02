'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';

export default function Home() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // When the user selects an image file, save it and create a preview URL.
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure both an image file and prompt are provided.
    if (!imageFile || !prompt) return;

    setLoading(true);
    setResult(null);

    // Build a FormData payload.
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('prompt', prompt);

    try {
      const res = await fetch('/api/generateVideo', {
        method: 'POST',
        // Do not set the Content-Type header manually when sending FormData.
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    }

    setLoading(false);
  };

  return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Video Generation
        </Typography>
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mb: 4,
            }}
        >
          <Button variant="contained" component="label">
            Upload Image
            <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
            />
          </Button>

          {/* Show a preview of the selected image */}
          {previewUrl && (
              <Card sx={{ maxWidth: '100%' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={previewUrl}
                    alt="Image Preview"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Preview of the selected image.
                  </Typography>
                </CardContent>
              </Card>
          )}

          <TextField
              label="Prompt"
              variant="outlined"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Video'}
          </Button>
        </Box>

        {result && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Response:
              </Typography>
              <Box
                  component="pre"
                  sx={{
                    backgroundColor: '#f5f5f5',
                    p: 2,
                    borderRadius: 1,
                    overflowX: 'auto',
                  }}
              >
                {JSON.stringify(result, null, 2)}
              </Box>
            </Box>
        )}
      </Container>
  );
}

