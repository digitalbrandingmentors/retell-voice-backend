import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow all origins TEMPORARILY for testing CORS issues
app.use(cors()); // Later, you can tighten this to just your domain

app.use(express.json());

// Optional: handles accidental GET requests in browser
app.get('/initiate-call', (req, res) => {
  res.status(405).send('❌ Use POST method only');
});

// ✅ Main endpoint to get a Retell access token
app.post('/initiate-call', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.retellai.com/v2/create-web-call',
      {
        agent_id: 'agent_762f810f2271dd72c26d051baf'
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RETELL_API_KEY}`
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    if (error.response) {
      console.error('🔴 Retell API error:', error.response.data);
      console.error('🔴 Status Code:', error.response.status);
    } else if (error.request) {
      console.error('🟠 No response from Retell:', error.request);
    } else {
      console.error('🔵 General error:', error.message);
    }

    res.status(500).json({ error: 'Failed to create call' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
