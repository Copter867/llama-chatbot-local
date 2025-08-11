import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import ollama from 'ollama';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let messages = [];

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  messages.push({ role: 'user', content: userMessage });

  const response = await ollama.chat({
    model: 'llama3',
    messages
  });

  const reply = response.message.content;
  messages.push({ role: 'assistant', content: reply });

  res.json({ reply });
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
