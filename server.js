import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import ollama from 'ollama';
import multer from 'multer';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

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

// ✅ upload + อ่านไฟล์
app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  try {
    // อ่านเนื้อหาไฟล์ .txt
    const content = fs.readFileSync(filePath, 'utf-8');

    // เพิ่มเข้า context ของ chatbot
    messages.push({ role: 'user', content: `นี่คือไฟล์ที่อัปโหลดมา:\n${content}` });

    // ให้บอทตอบสรุปหรืออ้างอิงไฟล์
    const response = await ollama.chat({
      model: 'llama3',
      messages
    });

    const answer = response.message.content;
    messages.push({ role: 'assistant', content: answer });

    res.json({ answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "อ่านไฟล์ไม่สำเร็จ" });
  } finally {
    // ลบไฟล์ทิ้งหลังใช้งาน (กันเปลืองพื้นที่)
    fs.unlinkSync(filePath);
  }
});

// ✅ รีเซ็ตการสนทนาใหม่
app.post('/reset', (req, res) => {
  messages = [];
  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
