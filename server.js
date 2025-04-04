import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// 🎙️ Create Retell voice call
app.post('/initiate-call', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.retellai.com/create-web-call',
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
    console.error('Error creating call:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create call' });
  }
});

// 🔄 Forward webhook to n8n
app.post('/retell-webhook', async (req, res) => {
  try {
    await axios.post(process.env.N8N_WEBHOOK_URL, req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook forward failed:', err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
