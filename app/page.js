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
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

export default function Home() {
  // Existing state
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prompt, setPrompt] = useState('');

  // New state variables
  const [model, setModel] = useState('kling-v1-6');
  const [negativePrompt, setNegativePrompt] = useState('child, little child');
  const [creativity, setCreativity] = useState(0.5);
  const [duration, setDuration] = useState(5);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle image upload and preview generation.
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

    // Check that the required fields are provided.
    if (!imageFile || !prompt) return;

    setLoading(true);
    setResult(null);

    // Build the FormData payload with the new fields.
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('prompt', prompt);
    formData.append('model', model);
    formData.append('negativePrompt', negativePrompt);
    formData.append('creativity', creativity);
    formData.append('duration', duration);

    try {
      const res = await fetch('/api/generateVideo', {
        method: 'POST',
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
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Video Generation
        </Typography>
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              mb: 4,
            }}
        >
          {/* Image Upload */}
          <Button variant="contained" component="label">
            Upload Image
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </Button>

          {previewUrl && (
              <Card sx={{ maxWidth: '100%' }}>
                <CardMedia component="img" height="200" image={previewUrl} alt="Image Preview" />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Preview of the selected image.
                  </Typography>
                </CardContent>
              </Card>
          )}

          {/* Prompt Field */}
          <TextField
              label="Prompt"
              variant="outlined"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              fullWidth
          />

          {/* Negative Prompt Field */}
          <TextField
              label="Negative Prompt"
              variant="outlined"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              fullWidth
          />

          {/* Model Selector */}
          <TextField
              select
              label="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              fullWidth
          >
            <MenuItem value="kling-v1-5">v1-6</MenuItem>
            <MenuItem value="kling-v1-6">v1-6</MenuItem>
          </TextField>

          {/* Creativity Slider */}
          <Box sx={{ width: '100%', mt: 2 }}>
            <Typography gutterBottom>Creativity: {creativity}</Typography>
            <Slider
                value={creativity}
                min={0}
                max={1}
                step={0.01}
                onChange={(e, newValue) => setCreativity(newValue)}
                valueLabelDisplay="auto"
            />
          </Box>

          {/* Duration Selector */}
          <FormControl component="fieldset">
            <FormLabel component="legend">Duration</FormLabel>
            <RadioGroup
                row
                value={duration.toString()}
                onChange={(e) => setDuration(Number(e.target.value))}
            >
              <FormControlLabel value="5" control={<Radio />} label="5 seconds" />
              <FormControlLabel value="10" control={<Radio />} label="10 seconds" />
            </RadioGroup>
          </FormControl>

          {/* Submit Button */}
          <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ alignSelf: 'flex-end', mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Video'}
          </Button>
        </Box>

        {/* Display the response */}
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


