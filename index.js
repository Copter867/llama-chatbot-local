import { chat } from "./chat.js";

async function main() {
  await chat("สวัสดี DeepSeek! แนะนำตัวหน่อย"); // จะใช้ deepseek-r1:8b อัตโนมัติ
  await chat("คุณคิดอย่างไรกับอนาคตของ AI?");
}

main();
