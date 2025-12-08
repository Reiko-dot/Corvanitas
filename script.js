//==============================
// Fabric canvas setup
//==============================
const canvas = new fabric.Canvas("panoramaCanvas", { selection: false, subTargetCheck: true });
fabric.Object.prototype.objectCaching = false;

const imageFiles = Array.from({ length: 33 }, (_, i) => `canvas${i}.jpg`);
const targetHeight = 600;

let panoramaGroup = new fabric.Group([], { selectable: false });
canvas.add(panoramaGroup);

let hotspots = [];
let addHotspotMode = false;
let tempHotspot = null;

//==============================
// Resize canvas
//==============================
function resizeCanvas() {
    const wrapper = document.querySelector('.canvas-wrapper');
    canvas.setWidth(wrapper.clientWidth);
    canvas.setHeight(wrapper.clientHeight);
    canvas.requestRenderAll();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

//==============================
// Load single image
//==============================
function loadImage(url) {
    return new Promise((resolve, reject) => {
        fabric.Image.fromURL(url, img => img ? resolve(img) : reject(url), { crossOrigin: 'anonymous' });
    });
}

//==============================
// Load hotspots from DB
//==============================
async function loadHotspotsFromDB() {
    try {
        const res = await fetch("loadhotspots.php");
        return await res.json();
    } catch (err) {
        console.error("Failed to load hotspots", err);
        return [];
    }
}

//==============================
// Load panorama & hotspots
//==============================
async function loadPanorama() {
    const hotspotsFromDB = await loadHotspotsFromDB();
    let xPos = 0;

    for (let i = 0; i < imageFiles.length; i++) {
        try {
            const img = await loadImage("images/" + imageFiles[i]);
            const scale = targetHeight / img.height;
            img.scale(scale);
            img.set({ left: xPos, top: 0, selectable: false });
            panoramaGroup.addWithUpdate(img);

            // Place hotspots for this frame
            const frameHotspots = hotspotsFromDB.filter(h => h.frame_index === i);
            frameHotspots.forEach(hdb => {
                const hotspot = new fabric.Circle({
                    left: xPos + hdb.x,
                    top: hdb.y,
                    radius: 18,
                    fill: "#ff3b3b",
                    stroke: "white",
                    strokeWidth: 3,
                    originX: "center",
                    originY: "center",
                    selectable: false, // not movable until editing
                    lockMovementX: true,
                    lockMovementY: true
                });

                hotspot.hotspotId = hdb.hotspot_id;
                hotspot.on("mousedown", () => openColofon(hotspot.hotspotId));
                canvas.add(hotspot);

                hotspots.push({
                    hotspot,
                    baseLeft: xPos + hdb.x,
                    baseTop: hdb.y
                });
            });

            xPos += img.getScaledWidth();
        } catch (err) {
            console.error("Failed loading", imageFiles[i], err);
        }
    }

    panoramaGroup.left = 0;
    panoramaGroup.top = (canvas.getHeight() - panoramaGroup.getScaledHeight()) / 2;
    panoramaGroup.setCoords();

    updateHotspots();
    canvas.requestRenderAll();
    updateProgress();
}

//==============================
// Update hotspot positions
//==============================
function updateHotspots() {
    const scale = panoramaGroup.scaleX || 1;
    hotspots.forEach(h => {
        h.hotspot.left = panoramaGroup.left + h.baseLeft * scale;
        h.hotspot.top = panoramaGroup.top + h.baseTop * scale;
        h.hotspot.setCoords();
    });
}

//==============================
// Add Hotspot Button
//==============================
const addHotspotBtn = document.createElement("button");
addHotspotBtn.textContent = "Create New Hotspot";
Object.assign(addHotspotBtn.style, {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    zIndex: 1000,
    padding: "10px 15px",
    backgroundColor: "#0ca3c5ff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
});
document.body.appendChild(addHotspotBtn);

addHotspotBtn.addEventListener("click", () => {
    addHotspotMode = true;
    addHotspotBtn.classList.add("active");
    alert("Click anywhere on the panorama to place the hotspot.");
});

//==============================
// Click to place temporary hotspot
//==============================
canvas.on("mouse:down", e => {
    if (!addHotspotMode) return;

    const pointer = canvas.getPointer(e.e);
    const x = pointer.x;
    const y = pointer.y;

    if (tempHotspot) canvas.remove(tempHotspot);

    tempHotspot = new fabric.Circle({
        left: x,
        top: y,
        radius: 18,
        fill: "rgba(255,59,59,0.6)",
        stroke: "white",
        strokeWidth: 3,
        originX: "center",
        originY: "center",
        selectable: false
    });
    canvas.add(tempHotspot);
    showAddForm(x, y);
});

//==============================
// Add Hotspot Form
//==============================
function showAddForm(x, y) {
    const oldForm = document.getElementById("add-hotspot-form");
    if (oldForm) oldForm.remove();

    const form = document.createElement("div");
    form.id = "add-hotspot-form";
    Object.assign(form.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        zIndex: 2000,
        width: "280px",
        fontFamily: "Arial, sans-serif"
    });

    form.innerHTML = `
        <h3 style="margin:0 0 15px 0;color:#333;font-weight:bold;font-size:18px;">Nieuwe Hotspot</h3>
        <label style="font-weight:600;display:block;margin-top:12px;color:#333;">Catalognummer</label>
        <input type="text" id="catalognummer" style="width:100%;padding:8px;margin-top:5px;border:1px solid #ccc;border-radius:6px;box-sizing:border-box;font-family:Arial;">
        <label style="font-weight:600;display:block;margin-top:12px;color:#333;">Beschrijving</label>
        <textarea id="beschrijving" style="width:100%;padding:8px;margin-top:5px;border:1px solid #ccc;border-radius:6px;box-sizing:border-box;min-height:80px;font-family:Arial;"></textarea>
        <label style="font-weight:600;display:block;margin-top:12px;color:#333;">Aanvulling (optioneel)</label>
        <textarea id="aanvulling" style="width:100%;padding:8px;margin-top:5px;border:1px solid #ccc;border-radius:6px;box-sizing:border-box;min-height:60px;font-family:Arial;"></textarea>
        <div style="display:flex;gap:8px;margin-top:15px;">
            <button id="save-hotspot-btn" style="flex:1;padding:10px;background:#ff3b3b;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-family:Arial;">Opslaan</button>
            <button id="cancel-hotspot-btn" style="flex:1;padding:10px;background:#999;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-family:Arial;">Annuleren</button>
        </div>
    `;
    document.body.appendChild(form);

    document.getElementById("save-hotspot-btn").onclick = async () => {
        const catalognummer = document.getElementById("catalognummer").value.trim();
        const beschrijving = document.getElementById("beschrijving").value.trim();
        const aanvulling = document.getElementById("aanvulling").value.trim();
        if (!catalognummer) return alert("Catalognummer verplicht!");

        // Determine frame index
        let frame_index = 0, total = 0;
        for (let i = 0; i < panoramaGroup._objects.length; i++) {
            const img = panoramaGroup._objects[i];
            total += img.getScaledWidth();
            if (x < total) { frame_index = i; break; }
        }

        const formData = new FormData();
        formData.append("frame_index", frame_index);
        formData.append("catalognummer", catalognummer);
        formData.append("beschrijving", beschrijving);
        formData.append("aanvulling", aanvulling);
        formData.append("x", x - panoramaGroup.left);
        formData.append("y", y - panoramaGroup.top);

        try {
            const res = await fetch("api/add_hotspot.php", { method: "POST", body: formData });
            const data = await res.json();
            if (data.error) return alert(data.error);

            canvas.remove(tempHotspot);

            const finalHotspot = new fabric.Circle({
                left: x,
                top: y,
                radius: 18,
                fill: "#ff3b3b",
                stroke: "white",
                strokeWidth: 3,
                originX: "center",
                originY: "center",
                selectable: false
            });
            finalHotspot.hotspotId = data.hotspot_id;
            finalHotspot.on("mousedown", () => openColofon(finalHotspot.hotspotId));
            canvas.add(finalHotspot);

            hotspots.push({
                hotspot: finalHotspot,
                baseLeft: x - panoramaGroup.left,
                baseTop: y - panoramaGroup.top
            });

            form.remove();
            addHotspotMode = false;
            addHotspotBtn.classList.remove("active");
            tempHotspot = null;

        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };

    document.getElementById("cancel-hotspot-btn").onclick = () => {
        if (tempHotspot) canvas.remove(tempHotspot);
        tempHotspot = null;
        addHotspotMode = false;
        addHotspotBtn.classList.remove("active");
        form.remove();
    };
}

//==============================
// Open colofon
//==============================
async function openColofon(hotspotId) {
    const panel = document.getElementById("colofon");
    const content = document.getElementById("colofon-content");
    panel.classList.add("open");
    content.innerHTML = "Laden...";

    try {
        const res = await fetch(`api/get_hotspot.php?id=${hotspotId}`);
        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.error("Invalid JSON from server:", text);
            content.innerHTML = "Server fout: invalid response.";
            return;
        }

        if (!data || data.error) {
            content.innerHTML = `<h2>Error</h2><p>${data?.error || "Hotspot not found"}</p>`;
            return;
        }

        content.innerHTML = `
            <h2 style="font-weight:bold;margin-bottom:12px;font-family:Arial,sans-serif;">${data.catalognummer}</h2>
            <p style="font-weight:600;line-height:1.6;margin:10px 0;font-family:Arial,sans-serif;">${data.beschrijving}</p>
            ${data.aanvulling ? `<p style="font-weight:500;font-style:italic;margin:10px 0;color:#555;font-family:Arial,sans-serif;">${data.aanvulling}</p>` : ""}
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:15px;">
                ${data.image_url ? `<img src="${data.image_url}" alt="Image 1" style="width:100%;max-height:250px;object-fit:contain;border-radius:6px;cursor:pointer;" onclick="openImageModal('${data.image_url}')">` : ""}
                ${data.image_url_2 ? `<img src="${data.image_url_2}" alt="Image 2" style="width:100%;max-height:250px;object-fit:contain;border-radius:6px;cursor:pointer;" onclick="openImageModal('${data.image_url_2}')">` : ""}
                ${data.image_url_3 ? `<img src="${data.image_url_3}" alt="Image 3" style="width:100%;max-height:250px;object-fit:contain;border-radius:6px;cursor:pointer;" onclick="openImageModal('${data.image_url_3}')">` : ""}
                ${data.image_url_4 ? `<img src="${data.image_url_4}" alt="Image 4" style="width:100%;max-height:250px;object-fit:contain;border-radius:6px;cursor:pointer;" onclick="openImageModal('${data.image_url_4}')">` : ""}
            </div>
            <div class="colofon-buttons" style="margin-top:15px; ">
                <button onclick="location.href='api/update_hotspot.php?id=${data.hotspot_id}'">Edit</button>
                <button onclick="deleteHotspot(${data.hotspot_id})">Delete</button>
            </div>
        `;
    } catch (err) {
        content.innerHTML = "Server fout.";
        console.error(err);
    }
}

document.getElementById("close-colofon").onclick = () => {
    document.getElementById("colofon").classList.remove("open");
};

// Image modal for fullscreen view
function openImageModal(src) {
    const modal = document.createElement('div');
    modal.id = 'image-modal';
    modal.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;
        z-index:3000;cursor:pointer;
    `;
    modal.innerHTML = `<img src="${src}" style="max-width:90%;max-height:90%;object-fit:contain;border-radius:8px;">`;
    document.body.appendChild(modal);

    modal.onclick = () => modal.remove();
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('image-modal')) {
            document.getElementById('image-modal').remove();
        }
    });
}

// Delete hotspot via AJAX and return to main page on success
async function deleteHotspot(id) {
    if (!confirm('Delete hotspot ' + id + '?')) return;
    try {
        const res = await fetch(`api/delete_hotspot.php?id=${id}`);
        const data = await res.json();
        if (data.error) {
            alert(data.error);
            return;
        }

        // remove from canvas & hotspots array if present
        const idx = hotspots.findIndex(h => (h.hotspot.hotspotId == id || h.hotspot.hotspotId == String(id)));
        if (idx !== -1) {
            canvas.remove(hotspots[idx].hotspot);
            hotspots.splice(idx, 1);
            updateHotspots();
            canvas.requestRenderAll();
        }

        // Close panel then redirect to main index
        document.getElementById("colofon").classList.remove("open");
        // navigate back to main page (adjust if your admin page differs)
        location.href = 'index.php';
    } catch (err) {
        console.error(err);
        alert('Server error during delete');
    }
}

//==============================
// Drag panorama (smooth)
//==============================
let dragging = false, lastX = 0;
canvas.on("mouse:down", e => { dragging = true; lastX = e.e.clientX; });
canvas.on("mouse:up", () => dragging = false);
canvas.on("mouse:move", e => {
    if (!dragging || addHotspotMode) return;
    const dx = e.e.clientX - lastX;
    lastX = e.e.clientX;
    panoramaGroup.left += dx;
    panoramaGroup.setCoords();
    updateHotspots();
    updateProgress();
    canvas.requestRenderAll();
});

//==============================
// Zoom
//==============================
canvas.on("mouse:wheel", e => {
    if (addHotspotMode) return;
    e.e.preventDefault();
    const zoomFactor = e.e.deltaY < 0 ? 1.05 : 0.95;
    const oldScale = panoramaGroup.scaleX || 1;
    let newScale = Math.max(1, Math.min(4, oldScale * zoomFactor));
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

//==============================
// Progress bar (interactive)
//==============================
let progressDragging = false;

function updateProgress() {
    const totalWidth = panoramaGroup.getScaledWidth();
    const current = -panoramaGroup.left;
    let p = Math.max(0, Math.min(100, (current / totalWidth) * 100));
    document.getElementById("progress-fill").style.width = p + "%";
}

// Progress bar click/tap to jump
function initProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    if (!progressBar) return;

    function getPercentFromEvent(e) {
        const rect = progressBar.getBoundingClientRect();
        let clientX = e.clientX;
        if (e.touches) {
            clientX = e.touches[0].clientX;
        }
        const clickX = clientX - rect.left;
        return Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    }

    function handleProgressClick(e) {
        if (progressDragging) return;
        const percent = getPercentFromEvent(e);
        setProgressPosition(percent);
    }

    function handleProgressDragStart(e) {
        progressDragging = true;
        const percent = getPercentFromEvent(e);
        setProgressPosition(percent);
    }

    function handleProgressDragMove(e) {
        if (!progressDragging) return;
        e.preventDefault();
        const percent = getPercentFromEvent(e);
        setProgressPosition(percent);
    }

    function handleProgressDragEnd() {
        progressDragging = false;
    }

    progressBar.addEventListener('click', handleProgressClick);
    progressBar.addEventListener('mousedown', handleProgressDragStart);
    progressBar.addEventListener('touchstart', handleProgressDragStart, { passive: false });
    document.addEventListener('mousemove', handleProgressDragMove);
    document.addEventListener('touchmove', handleProgressDragMove, { passive: false });
    document.addEventListener('mouseup', handleProgressDragEnd);
    document.addEventListener('touchend', handleProgressDragEnd);
}

function setProgressPosition(percent) {
    const totalWidth = panoramaGroup.getScaledWidth();
    const canvasWidth = canvas.getWidth();
    const newLeft = -(totalWidth * percent / 100) + canvasWidth / 2;
    panoramaGroup.left = Math.max(-(totalWidth - canvasWidth), Math.min(0, newLeft));
    panoramaGroup.setCoords();
    updateHotspots();
    updateProgress();
    canvas.requestRenderAll();
}



//==============================
// Start
//==============================
loadPanorama();
initProgressBar();
