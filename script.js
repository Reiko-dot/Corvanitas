const canvas = new fabric.Canvas("panoramaCanvas", { selection: false, subTargetCheck: true });
fabric.Object.prototype.objectCaching = false;

const imageFiles = Array.from({ length: 33 }, (_, i) => `canvas${i}.jpg`);
const targetHeight = 600;

let xPos = 0;
let panoramaGroup = new fabric.Group([], { selectable: false });
canvas.add(panoramaGroup);
let hotspots = [];

// Resize canvas
function resizeCanvas() {
  const wrapper = document.querySelector('.canvas-wrapper');
  canvas.setWidth(wrapper.clientWidth);
  canvas.setHeight(wrapper.clientHeight);
  canvas.requestRenderAll();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Load image helper
function loadImage(url) {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(url, img => {
      if (!img) reject(url);
      else resolve(img);
    }, { crossOrigin: 'anonymous' });
  });
}

// Load panorama + hotspots
async function loadPanorama() {
  xPos = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    try {
      const img = await loadImage('images/' + imageFiles[i]);
      const scale = targetHeight / img.height;
      img.scale(scale);
      img.set({ left: xPos, top: 0, selectable: false });
      panoramaGroup.addWithUpdate(img);

      // Hotspot (add directly to canvas, not to group)
      const hotspot = new fabric.Circle({
        left: xPos + img.width * scale - 50,
        top: (canvas.getHeight() - targetHeight) / 2 + 50,
        radius: 18,
        fill: '#ff3b3b',
        stroke: 'white',
        strokeWidth: 3,
        originX: 'center',
        originY: 'center',
        selectable: true,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hoverCursor: 'pointer'
      });

      hotspot.on('mousedown', () => openColofon(i));
      canvas.add(hotspot);
      hotspots.push({ hotspot, baseLeft: hotspot.left, baseTop: hotspot.top });

      xPos += img.width * scale;
    } catch (err) {
      console.error('Failed loading', imageFiles[i]);
    }
  }

  // Center panorama vertically
  panoramaGroup.left = 0;
  panoramaGroup.top = (canvas.getHeight() - panoramaGroup.getScaledHeight()) / 2;
  panoramaGroup.setCoords();
  updateHotspots();
  canvas.requestRenderAll();
}

// Update hotspot positions based on group transform
function updateHotspots() {
  const scale = panoramaGroup.scaleX || 1;
  hotspots.forEach(h => {
    h.hotspot.left = panoramaGroup.left + h.baseLeft * scale;
    h.hotspot.top = panoramaGroup.top + h.baseTop * scale;
    h.hotspot.setCoords();
  });
}

loadPanorama();

// Drag panorama
let dragging = false, lastX = 0;
canvas.on('mouse:down', e => { dragging = true; lastX = e.e.clientX; });
canvas.on('mouse:up', () => dragging = false);
canvas.on('mouse:move', e => {
  if (!dragging) return;
  const dx = e.e.clientX - lastX;
  panoramaGroup.left += dx;
  panoramaGroup.setCoords();
  lastX = e.e.clientX;
  updateHotspots();
  updateProgress();
  canvas.requestRenderAll();
});

// Scroll zoom around mouse pointer
const minScale = 1;
const maxScale = 4;

canvas.on("mouse:wheel", e => {
  e.e.preventDefault();
  const zoomFactor = e.e.deltaY < 0 ? 1.05 : 0.95;
  const oldScale = panoramaGroup.scaleX || 1;
  let newScale = oldScale * zoomFactor;
  newScale = Math.max(minScale, Math.min(maxScale, newScale));

  const pointer = canvas.getPointer(e.e);
  const localX = (pointer.x - panoramaGroup.left) / oldScale;
  const localY = (pointer.y - panoramaGroup.top) / oldScale;

  panoramaGroup.scale(newScale);
  panoramaGroup.left = pointer.x - localX * newScale;
  panoramaGroup.top = pointer.y - localY * newScale;
  panoramaGroup.setCoords();

  updateHotspots();
  updateProgress();
  canvas.requestRenderAll();
});

// Progress bar
function updateProgress() {
  const totalWidth = panoramaGroup.getScaledWidth();
  const current = -panoramaGroup.left;
  let p = (current / totalWidth) * 100;
  p = Math.max(0, Math.min(100, p));
  document.getElementById('progress-fill').style.width = p + '%';
}

// Colofon
function openColofon(frameIndex) {
  const panel = document.getElementById('colofon');
  const content = document.getElementById('colofon-content');
  content.innerHTML = `<h2>Pagina ${frameIndex + 1}</h2><p>Colofon info will be loaded later.</p>`;
  panel.classList.add('open');
}

document.getElementById('close-colofon').addEventListener('click', () => {
  document.getElementById('colofon').classList.remove('open');
});
