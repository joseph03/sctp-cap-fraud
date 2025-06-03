require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check (for Kubernetes)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// API endpoint - exactly what you need
app.post('/api/detect', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ 
      error: 'Text parameter is required',
      example: { text: "Your input here" }
    });
  }

  // Simple response with acknowledgement
  res.json({
    status: 'success',
    message: 'Text received by fraud detection service',
    originalText: text,  // Echoing back the received text
    receivedAt: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Service running on port ${PORT}`);
});