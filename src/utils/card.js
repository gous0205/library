// Draws the digital library ID card to a canvas and downloads it as PNG (no extra library needed)
export function downloadCard(u, qrSrc, libName) {
  const c = document.createElement("canvas"); c.width = 860; c.height = 540;
  const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, 860, 540); g.addColorStop(0, "#111827"); g.addColorStop(1, "#4f46e5");
  x.fillStyle = g; x.fillRect(0, 0, 860, 540);
  x.fillStyle = "#fff"; x.font = "700 30px Inter, Arial"; x.fillText(libName, 40, 70);
  x.font = "500 18px Inter, Arial"; x.fillStyle = "#c7d2fe"; x.fillText("DIGITAL LIBRARY ID CARD", 40, 100);
  x.fillStyle = "#fff"; x.font = "700 40px Inter, Arial"; x.fillText(u.name, 40, 220);
  x.font = "500 22px Inter, Arial";
  [["Roll No", u.roll], ["Department", u.dept], ["Year", u.year], ["Member ID", u.id]].forEach(([k, v], i) => {
    x.fillStyle = "#a5b4fc"; x.fillText(k, 40, 290 + i * 52); x.fillStyle = "#fff"; x.fillText(String(v), 200, 290 + i * 52);
  });
  const img = new Image();
  img.onload = () => {
    x.fillStyle = "#fff"; x.fillRect(570, 150, 250, 250); x.drawImage(img, 575, 155, 240, 240);
    const a = document.createElement("a"); a.href = c.toDataURL("image/png"); a.download = `library-id-${u.id}.png`; a.click();
  };
  img.src = qrSrc;
}
