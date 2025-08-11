import ollama from 'ollama';

// ฟังก์ชันคุยกับโมเดล
async function chat(message) {
  const res = await ollama.chat({
    model: 'llama3',
    messages: [{ role: 'user', content: message }]
  });

  console.log("LLaMA:", res.message.content);
}

// ทดสอบ
chat("สวัสดี LLaMA! แนะนำตัวหน่อย");
