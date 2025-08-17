// chat.js
// เรียก Ollama ผ่าน REST API โดยตรง

const DEFAULT_MODEL = "deepseek-r1:8b"; // ✅ ตั้งค่าโมเดลหลักตรงนี้

export async function chat(message, modelName = DEFAULT_MODEL) {
  try {
    const res = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await res.json();
    console.log(`${modelName}:`, data.message?.content || data);
    return data.message?.content || "";
  } catch (err) {
    console.error("Error calling Ollama API:", err);
    return null;
  }
}
