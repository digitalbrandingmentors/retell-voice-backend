import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://love4ranimalsai.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false
}));
app.use(express.json());

// Optional: Prevent GET errors in browser
app.get('/initiate-call', (req, res) => {
  res.status(405).send('❌ Please use POST instead of GET');
});

app.post('/initiate-call', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.retellai.com/v2/create-web-call', // ✅ This is the correct endpoint
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
      console.error('🔴 Retell API error response:', error.response.data);
      console.error('🔴 Status Code:', error.response.status);
    } else if (error.request) {
      console.error('🟠 No response from Retell:', error.request);
    } else {
      console.error('🔵 Unknown error:', error.message);
