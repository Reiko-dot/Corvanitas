const canvas = new fabric.Canvas("panoramaCanvas", { selection: false });
fabric.Object.prototype.objectCaching = false;

// Panorama images
const imageOrder = Array.from({length: 33}, (_, i) => `canvas${i}.jpg`);

let panoramaGroup = new fabric.Group([], { selectable: false, originX: "left", originY: "top" });
canvas.add(panoramaGroup);

let normalizedHeight = 600;
let xPos = 0;

// Load images
imageOrder.forEach((file, index) => {
    fabric.Image.fromURL("images/" + file, img => {
        const scale = normalizedHeight / img.height;
        img.scaleX = scale;
        img.scaleY = scale;
        const newWidth = img.width * scale;

        img.set({ left: xPos, top: 0, selectable: false });
        panoramaGroup.addWithUpdate(img);
        xPos += newWidth;
        canvas.requestRenderAll();
    });
});

// Load hotspots
hotspotsData.forEach(hs => {
    const hotspot = new fabric.Circle({
        left: hs.hotspot_x,
        top: hs.hotspot_y,
        radius: 18,
        fill: "#ff3b3b",
        stroke: "white",
        strokeWidth: 3,
        originX: "center",
        originY: "center",
        selectable: false
    });

    hotspot.on("mousedown", () => openColofon(hs));
    panoramaGroup.addWithUpdate(hotspot);
});
canvas.requestRenderAll();

// Drag
let isDragging = false, lastX = 0;
canvas.on("mouse:down", e => { isDragging = true; lastX = e.e.clientX; });
canvas.on("mouse:move", e => {
    if (!isDragging) return;
    const dx = e.e.clientX - lastX;
    panoramaGroup.left += dx;
    panoramaGroup.setCoords();
    canvas.requestRenderAll();
    lastX = e.e.clientX;
});
canvas.on("mouse:up", () => isDragging = false);

// Zoom
canvas.on("mouse:wheel", e => {
    e.e.preventDefault();
    const zoomFactor = e.e.deltaY < 0 ? 1.05 : 0.95;
    panoramaGroup.scaleX *= zoomFactor;
    panoramaGroup.scaleY *= zoomFactor;
    panoramaGroup.setCoords();
    canvas.requestRenderAll();
});

// Touch drag & pinch
let lastTouchX = 0, pinchDist = 0, startScale = 1;
function getDist(t) { return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); }

canvas.upperCanvasEl.addEventListener("touchstart", e => {
    if (e.touches.length === 1) lastTouchX = e.touches[0].clientX;
    if (e.touches.length === 2) { pinchDist = getDist(e.touches); startScale = panoramaGroup.scaleX; }
}, { passive: false });

canvas.upperCanvasEl.addEventListener("touchmove", e => {
    e.preventDefault();
    if (e.touches.length === 1) {
        let dx = e.touches[0].clientX - lastTouchX;
        panoramaGroup.left += dx;
        panoramaGroup.setCoords();
        canvas.requestRenderAll();
        lastTouchX = e.touches[0].clientX;
    }
    if (e.touches.length === 2) {
        const newDist = getDist(e.touches);
        const zoomFactor = newDist / pinchDist;
        panoramaGroup.scaleX = startScale * zoomFactor;
        panoramaGroup.scaleY = startScale * zoomFactor;
        panoramaGroup.setCoords();
        canvas.requestRenderAll();
    }
}, { passive: false });

// Colofon
function openColofon(hs) {
    const panel = document.getElementById("colofon");
    const content = document.getElementById("colofon-content");

    content.innerHTML = `
        <h2>Catalogusnummer: ${hs.catalogusnummer}</h2>
        <p>${hs.beschrijving}</p>
        ${hs.extra_fotos ? `<img src="${hs.extra_fotos}" alt="Extra Foto">` : ''}
    `;
    panel.classList.add("open");
}

document.getElementById("close-colofon").addEventListener("click", () => {
    document.getElementById("colofon").classList.remove("open");
});

// Canvas resize
function resizeCanvas() {
    const wrapper = document.querySelector(".canvas-wrapper");
    canvas.setWidth(wrapper.clientWidth);
    canvas.setHeight(wrapper.clientHeight);
    canvas.requestRenderAll();
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
