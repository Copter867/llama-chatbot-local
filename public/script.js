function appendMessage(role, text, isTyping = false) {
  const chatBox = document.getElementById("chatBox");
  const bubble = document.createElement("div");
  bubble.className = `p-3 rounded-lg max-w-lg ${
    role === "user" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-200 text-black"
  }`;
  bubble.style.whiteSpace = "pre-wrap";
  bubble.textContent = isTyping ? "" : text;

  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (isTyping) {
    let i = 0;
    const typingInterval = setInterval(() => {
      bubble.textContent += text.charAt(i);
      i++;
      chatBox.scrollTop = chatBox.scrollHeight;
      if (i >= text.length) clearInterval(typingInterval);
    }, 30);
  }

  return bubble;
}

function appendLoader() {
  const chatBox = document.getElementById("chatBox");
  const loader = document.createElement("div");
  loader.className = "p-3 rounded-lg max-w-lg bg-gray-200 text-black";
  loader.innerHTML = `<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>`;
  loader.style.display = "inline-block";
  loader.style.letterSpacing = "3px";
  loader.dataset.loader = "true";
  chatBox.appendChild(loader);
  chatBox.scrollTop = chatBox.scrollHeight;
  return loader;
}

function removeLoader(loader) {
  if (loader && loader.parentNode) {
    loader.parentNode.removeChild(loader);
  }
}

async function sendMessage() {
  const msgInput = document.getElementById("message");
  const msg = msgInput.value.trim();
  if (!msg) return;

  appendMessage("user", msg);
  msgInput.value = "";

  const loaderBubble = appendLoader();

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  });

  const data = await res.json();

  removeLoader(loaderBubble);

  appendMessage("assistant", data.reply, true);
}

// ฟังก์ชันส่งไฟล์
async function sendFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) {
    alert("กรุณาเลือกไฟล์ก่อนส่ง");
    return;
  }

  appendMessage("user", `📎 อัปโหลดไฟล์: ${file.name}`);

  const loaderBubble = appendLoader();

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    removeLoader(loaderBubble);

    appendMessage("assistant", data.answer, true);

  } catch (err) {
    removeLoader(loaderBubble);
    appendMessage("assistant", "❌ เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
    console.error(err);
  } finally {
    fileInput.value = "";
  }
}

// ✅ ฟังก์ชันเริ่มแชทใหม่
document.getElementById("newChat").addEventListener("click", async () => {
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";

  await fetch("/reset", { method: "POST" });

  appendMessage("assistant", "🆕 เริ่มการสนทนาใหม่แล้ว");
});
