const canvas = new fabric.Canvas("panoramaCanvas", { selection: false, subTargetCheck: true });
fabric.Object.prototype.objectCaching = false;

const imageFiles = Array.from({ length: 33 }, (_, i) => `canvas${i}.jpg`);
const targetHeight = 600;

let xPos = 0;
let panoramaGroup = new fabric.Group([], { selectable: false });
canvas.add(panoramaGroup);

let hotspots = [];
let hotspotsFromDB = []; // Will be loaded from DB

//----------------------------------------------------
// Resize canvas
//----------------------------------------------------
function resizeCanvas() {
    const wrapper = document.querySelector('.canvas-wrapper');
    canvas.setWidth(wrapper.clientWidth);
    canvas.setHeight(wrapper.clientHeight);
    canvas.requestRenderAll();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

//----------------------------------------------------
// Load image helper
//----------------------------------------------------
function loadImage(url) {
    return new Promise((resolve, reject) => {
        fabric.Image.fromURL(url, img => {
            if (!img) reject(url);
            else resolve(img);
        }, { crossOrigin: 'anonymous' });
    });
}

//----------------------------------------------------
// Load hotspots from database
//----------------------------------------------------
async function loadHotspotsFromDB() {
    try {
        const res = await fetch("api/load_hotspots.php");
        hotspotsFromDB = await res.json();

        console.log("Hotspots from DB:", hotspotsFromDB); // 🔥 debug
    } catch (err) {
        console.error("Failed to load hotspots from DB", err);
        hotspotsFromDB = [];
    }
}

//----------------------------------------------------
// Load panorama + hotspots
//----------------------------------------------------
async function loadPanorama() {
    await loadHotspotsFromDB(); // load DB first
    xPos = 0;

    for (let i = 0; i < imageFiles.length; i++) {
        try {
            const img = await loadImage('images/' + imageFiles[i]);
            const scale = targetHeight / img.height;
            img.scale(scale);
            img.set({ left: xPos, top: 0, selectable: false });
            panoramaGroup.addWithUpdate(img);

            // Get hotspots for this frame
            const frameHotspots = hotspotsFromDB.filter(h => h.frame_index === i);

            frameHotspots.forEach(hdb => {
                // Safety check: hotspot_id must exist
                if (!hdb.hotspot_id) return;

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
                    hoverCursor: 'pointer'
                });

                // Assign the real DB ID
                hotspot.hotspotId = hdb.hotspot_id;

                // Click to open colofon
                hotspot.on('mousedown', () => openColofon(hotspot.hotspotId));

                canvas.add(hotspot);
                hotspots.push({
                    hotspot,
                    baseLeft: hotspot.left,
                    baseTop: hotspot.top
                });
            });

            xPos += img.width * scale;
        } catch (err) {
            console.error('Failed loading', imageFiles[i], err);
        }
    }

    // Center panorama vertically
    panoramaGroup.left = 0;
    panoramaGroup.top = (canvas.getHeight() - panoramaGroup.getScaledHeight()) / 2;
    panoramaGroup.setCoords();
    updateHotspots();
    canvas.requestRenderAll();
}

//----------------------------------------------------
// Update hotspot positions
//----------------------------------------------------
function updateHotspots() {
    const scale = panoramaGroup.scaleX || 1;
    hotspots.forEach(h => {
        h.hotspot.left = panoramaGroup.left + h.baseLeft * scale;
        h.hotspot.top = panoramaGroup.top + h.baseTop * scale;
        h.hotspot.setCoords();
    });
}

//----------------------------------------------------
// Open colofon with DB info
//----------------------------------------------------
async function openColofon(hotspotId) {
    const panel = document.getElementById("colofon");
    const content = document.getElementById("colofon-content");

    panel.classList.add("open");
    content.innerHTML = "<p>Laden...</p>";

    try {
        const res = await fetch(`api/get_hotspot.php?id=${hotspotId}`);
        const data = await res.json();

        if (data.error) {
            content.innerHTML = `<h2>Fout bij laden</h2><p>${data.error}</p>`;
            return;
        }

        content.innerHTML = `
            <h2>${data.catalognummer}</h2>
            <p>${data.beschrijving}</p>
            ${data.aanvulling ? `<p><em>${data.aanvulling}</em></p>` : ''}
            <div class="colofon-buttons">
                <button onclick="window.location='api/update_hotspot.php?id=${data.hotspot_id}'">Edit</button>
                <button onclick="window.location='api/delete_hotspot.php?id=${data.hotspot_id}'">Delete</button>
            </div>
        `;
    } catch (err) {
        content.innerHTML = `<h2>Fout bij laden</h2><p>Server fout.</p>`;
        console.error(err);
    }
}

//----------------------------------------------------
// Close colofon
//----------------------------------------------------
document.getElementById('close-colofon').addEventListener('click', () => {
    document.getElementById('colofon').classList.remove('open');
});

//----------------------------------------------------
// Drag & zoom logic remains the same
//----------------------------------------------------




//----------------------------------------------------
// Drag panorama
//----------------------------------------------------
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

//----------------------------------------------------
// Zoom panorama
//----------------------------------------------------
const minScale = 1, maxScale = 4;
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

//----------------------------------------------------
// Progress bar
//----------------------------------------------------
function updateProgress() {
    const totalWidth = panoramaGroup.getScaledWidth();
    const current = -panoramaGroup.left;
    let p = (current / totalWidth) * 100;
    p = Math.max(0, Math.min(100, p));
    document.getElementById('progress-fill').style.width = p + '%';
}