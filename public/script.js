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

  return bubble; // 👈 เพิ่มเพื่อให้ลบ/แก้ได้ทีหลัง
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

  // เพิ่มข้อความผู้ใช้
  appendMessage("user", msg);
  msgInput.value = "";

  // แสดง Loader ระหว่างรอ
  const loaderBubble = appendLoader();

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  });

  const data = await res.json();

  // ลบ Loader
  removeLoader(loaderBubble);

  // แสดงข้อความบอทแบบ typing effect
  appendMessage("assistant", data.reply, true);
}

