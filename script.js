const wrapper = document.querySelector('.canvas-wrapper');
const canvasEl = document.getElementById('canvas');

const sliceWidth = 3476;
const sliceHeight = 1507;
const numSlices = 33;

// Fabric canvas = viewport size
const canvas = new fabric.Canvas('canvas', { selection: false });
canvas.setWidth(window.innerWidth);
canvas.setHeight(window.innerHeight);
fabric.Object.prototype.objectCaching = false;

let panoramaGroup = new fabric.Group([], { left: 0, top: 0, selectable: false });
canvas.add(panoramaGroup);

// --------------------
// Load slices
// --------------------
let currentX = 0;
for (let i = 0; i < numSlices; i++) {
  fabric.Image.fromURL(`images/canvas${i}.jpg`, img => {
    img.set({ left: currentX, top: 0, selectable: false });
    currentX += sliceWidth;
    panoramaGroup.addWithUpdate(img);
    canvas.requestRenderAll();
  });
}

// --------------------
// Drag & Pan
// --------------------
let isDragging = false;
let lastX = 0, lastY = 0;

canvas.on('mouse:down', e => {
  isDragging = true;
  lastX = e.e.clientX;
  lastY = e.e.clientY;
});

canvas.on('mouse:move', e => {
  if (!isDragging) return;
  const dx = e.e.clientX - lastX;
  const dy = e.e.clientY - lastY;
  panoramaGroup.left += dx;
  panoramaGroup.top += dy;
  panoramaGroup.setCoords();
  canvas.requestRenderAll();
  lastX = e.e.clientX;
  lastY = e.e.clientY;
});

canvas.on('mouse:up', () => isDragging = false);

// --------------------
// Zoom with mouse wheel
// --------------------
canvas.on('mouse:wheel', e => {
  e.e.preventDefault();
  e.e.stopPropagation();

  const pointer = canvas.getPointer(e.e);
  const zoomFactor = 1.1;
  let zoom = e.e.deltaY < 0 ? zoomFactor : 1/zoomFactor;

  // Zoom the group
  const prevScale = panoramaGroup.scaleX;
  panoramaGroup.scaleX *= zoom;
  panoramaGroup.scaleY *= zoom;

  // Adjust position so zoom centers on cursor
  panoramaGroup.left -= (pointer.x - panoramaGroup.left) * (panoramaGroup.scaleX/prevScale - 1);
  panoramaGroup.top -= (pointer.y - panoramaGroup.top) * (panoramaGroup.scaleY/prevScale - 1);

  panoramaGroup.setCoords();
  canvas.requestRenderAll();
});

// --------------------
// Touch pinch zoom
// --------------------
let initialDistance = 0;

canvas.upperCanvasEl.addEventListener('touchstart', e => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    initialDistance = Math.sqrt(dx*dx + dy*dy);
  } else if (e.touches.length === 1) {
    isDragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  }
});

canvas.upperCanvasEl.addEventListener('touchmove', e => {
  e.preventDefault();
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const distance = Math.sqrt(dx*dx + dy*dy);

    const cx = (e.touches[0].clientX + e.touches[1].clientX)/2;
    const cy = (e.touches[0].clientY + e.touches[1].clientY)/2;

    const zoom = distance / initialDistance;

    const prevScale = panoramaGroup.scaleX;
    panoramaGroup.scaleX *= zoom;
    panoramaGroup.scaleY *= zoom;

    panoramaGroup.left -= (cx - panoramaGroup.left) * (panoramaGroup.scaleX/prevScale - 1);
    panoramaGroup.top -= (cy - panoramaGroup.top) * (panoramaGroup.scaleY/prevScale - 1);

    panoramaGroup.setCoords();
    canvas.requestRenderAll();
    initialDistance = distance;
  } else if (e.touches.length === 1 && isDragging) {
    const dx = e.touches[0].clientX - lastX;
    const dy = e.touches[0].clientY - lastY;
    panoramaGroup.left += dx;
    panoramaGroup.top += dy;
    panoramaGroup.setCoords();
    canvas.requestRenderAll();
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  }
}, { passive: false });

canvas.upperCanvasEl.addEventListener('touchend', e => {
  if (e.touches.length < 2) initialDistance = 0;
  if (e.touches.length === 0) isDragging = false;
});

// --------------------
// Window resize
// --------------------
window.addEventListener('resize', () => {
  canvas.setWidth(window.innerWidth);
  canvas.setHeight(window.innerHeight);
  canvas.requestRenderAll();
});
