// JavaScript - index.js
const video = document.getElementById("video");
const videoFile = document.getElementById("videoFile");
const checklistArea = document.getElementById("checklistArea");
const exportBtn = document.getElementById("exportBtn");
const exportHtmlBtn = document.getElementById("exportHtmlBtn");

videoFile.addEventListener("change", () => {
  const file = videoFile.files[0];
  if (file) {
    video.src = URL.createObjectURL(file);
    video.load();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "c") {
    video.pause();
    captureScreenshot();
  }
});

function captureScreenshot() {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL("image/png");

  const item = document.createElement("div");
  item.className = "check-item";

  const img = document.createElement("img");
  img.src = imageData;

  const textarea = document.createElement("textarea");
  textarea.placeholder = "輸入備註內容...";

  const timestamp = document.createElement("div");
  timestamp.className = "timestamp";
  timestamp.textContent = `時間碼：${formatTime(video.currentTime)}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "🗑️";
  deleteBtn.onclick = () => item.remove();

  item.appendChild(img);
  item.appendChild(textarea);
  item.appendChild(timestamp);
  item.appendChild(deleteBtn);
  checklistArea.appendChild(item);
}

function formatTime(time) {
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(Math.floor(time % 60)).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

exportHtmlBtn.addEventListener("click", () => {
  const staticItems = Array.from(checklistArea.querySelectorAll(".check-item"))
    .map((item) => {
      const img = item.querySelector("img")?.outerHTML || "";
      const timestamp = item.querySelector(".timestamp")?.outerHTML || "";
      const noteText = item.querySelector("textarea")?.value || "";
      const note = `<div class=\"note\">${noteText.replace(
        /\n/g,
        "<br>"
      )}</div>`;
      return `<div class=\"check-item\">${img}${note}${timestamp}</div>`;
    })
    .join("\n");

  const fullHtml = `
    <html>
      <head>
        <meta charset=\"UTF-8\">
        <title>影片檢核結果</title>
        <style>
          body { font-family: sans-serif; padding: 20px; background: #f9f9f9; }
          .check-item { display: flex; gap: 12px; border: 1px solid #ccc; padding: 12px; margin-bottom: 16px; background: #fff; border-radius: 6px; }
          .check-item img { width: 160px; max-height: 120px; object-fit: cover; border: 1px solid #aaa; border-radius: 4px; }
          .note { flex: 1; font-size: 14px; white-space: pre-wrap; }
          .timestamp { font-size: 12px; color: #555; margin-top: 4px; }
        </style>
      </head>
      <body>
        <h1>影片檢核結果</h1>
        ${staticItems}
      </body>
    </html>
  `;

  const blob = new Blob([fullHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "影片檢核紀錄.doc"; // Word 可開啟的 HTML
  a.click();
});
