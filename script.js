//================ Fabric Canvas Setup =================
const canvas = new fabric.Canvas("panoramaCanvas", { selection: false, subTargetCheck: true });
fabric.Object.prototype.objectCaching = false;

const imageFiles = Array.from({ length: 33 }, (_, i) => `canvas${i}.jpg`);
const targetHeight = 600;

let panoramaGroup = new fabric.Group([], { selectable: false });
canvas.add(panoramaGroup);

let hotspots = [];
let addHotspotMode = false;
let tempHotspot = null;

//================ Resize Canvas =================
function resizeCanvas() {
    const wrapper = document.querySelector('.canvas-wrapper');
    canvas.setWidth(wrapper.clientWidth);
    canvas.setHeight(wrapper.clientHeight);
    canvas.requestRenderAll();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

//================ Load Single Image =================
function loadImage(url) {
    return new Promise((resolve, reject) => {
        fabric.Image.fromURL(url, img => img ? resolve(img) : reject(url), { crossOrigin: 'anonymous' });
    });
}

//================ Load Hotspots from DB =================
async function loadHotspotsFromDB() {
    try {
        const res = await fetch("api/loadhotspots.php");
        return await res.json();
    } catch (err) {
        console.error("Failed to load hotspots:", err);
        return [];
    }
}

//================ Load Panorama + Hotspots =================
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

            // Add hotspots for this frame
            hotspotsFromDB.filter(h => h.frame_index === i).forEach(hdb => {
                const hotspot = new fabric.Circle({
                    left: xPos + hdb.x,
                    top: hdb.y,
                    radius: 18,
                    fill: "#ff3b3b",
                    stroke: "white",
                    strokeWidth: 3,
                    originX: "center",
                    originY: "center",
                    selectable: false, // not movable
                });
                hotspot.hotspotId = hdb.hotspot_id;
                hotspot.on("mousedown", () => openColofon(hotspot.hotspotId));
                canvas.add(hotspot);

                hotspots.push({
                    hotspot,
                    baseLeft: hdb.x,
                    baseTop: hdb.y
                });
            });

            xPos += img.width * scale;
        } catch (err) {
            console.error("Failed loading image", imageFiles[i], err);
        }
    }

    panoramaGroup.left = 0;
    panoramaGroup.top = (canvas.getHeight() - panoramaGroup.getScaledHeight()) / 2;
    panoramaGroup.setCoords();

    updateHotspots();
    canvas.requestRenderAll();
}

//================ Update Hotspots =================
function updateHotspots() {
    const scale = panoramaGroup.scaleX || 1;
    hotspots.forEach(h => {
        h.hotspot.left = panoramaGroup.left + h.baseLeft * scale;
        h.hotspot.top = panoramaGroup.top + h.baseTop * scale;
        h.hotspot.setCoords();
    });
    updateProgress();
}

//================ Add Hotspot Button =================
const addHotspotBtn = document.createElement("button");
addHotspotBtn.textContent = "Create New Hotspot";
Object.assign(addHotspotBtn.style, {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    zIndex: 1000,
    padding: "10px 15px",
    backgroundColor: "#ff3b3b",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
});
document.body.appendChild(addHotspotBtn);

addHotspotBtn.addEventListener("click", () => {
    addHotspotMode = true;
    addHotspotBtn.classList.add("active");
    alert("Click on the panorama to place the hotspot.");
});

//================ Click Canvas to Place Hotspot =================
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

//================ Show Add Hotspot Form =================
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
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        zIndex: 2000,
        width: "250px"
    });

    form.innerHTML = `
        <h3>Nieuwe Hotspot</h3>
        <label>Catalognummer</label>
        <input type="text" id="catalognummer" style="width:100%;margin-bottom:8px;">
        <label>Beschrijving</label>
        <textarea id="beschrijving" style="width:100%;margin-bottom:8px;"></textarea>
        <label>Aanvulling (optioneel)</label>
        <textarea id="aanvulling" style="width:100%;margin-bottom:8px;"></textarea>
        <button id="save-hotspot-btn" style="margin-right:5px;">Opslaan</button>
        <button id="cancel-hotspot-btn">Annuleren</button>
    `;
    document.body.appendChild(form);

    document.getElementById("save-hotspot-btn").onclick = async () => {
        const catalognummer = document.getElementById("catalognummer").value.trim();
        const beschrijving = document.getElementById("beschrijving").value.trim();
        const aanvulling = document.getElementById("aanvulling").value.trim();

        if (!catalognummer) return alert("Catalognummer verplicht!");

        // Compute frame index
        let frame_index = 0;
        let total = 0;
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

            hotspots.push({ hotspot: finalHotspot, baseLeft: x - panoramaGroup.left, baseTop: y - panoramaGroup.top });

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

//================ Open Colofon =================
async function openColofon(hotspotId) {
    const panel = document.getElementById("colofon");
    const content = document.getElementById("colofon-content");
    panel.classList.add("open");
    content.innerHTML = "Laden...";

    try {
        const res = await fetch(`api/get_hotspot.php?id=${hotspotId}`);
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } 
        catch(e) { throw new Error("Invalid JSON: " + text); }

        if (data.error) { content.innerHTML = `<h2>Error</h2><p>${data.error}</p>`; return; }

        content.innerHTML = `
            <h2>${data.catalognummer}</h2>
            <p>${data.beschrijving}</p>
            ${data.aanvulling ? `<p><i>${data.aanvulling}</i></p>` : ""}
            <div class="colofon-buttons">
                <button onclick="location.href='api/update_hotspot.php?id=${data.hotspot_id}'">Edit</button>
                <button onclick="location.href='api/delete_hotspot.php?id=${data.hotspot_id}'">Delete</button>
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

//================ Drag Panorama =================
let dragging = false, lastX = 0;
canvas.on("mouse:down", e => { dragging = true; lastX = e.e.clientX; });
canvas.on("mouse:up", () => dragging = false);
canvas.on("mouse:move", e => {
    if (!dragging || addHotspotMode) return;
    const dx = e.e.clientX - lastX;
    panoramaGroup.left += dx;
    panoramaGroup.setCoords();
    lastX = e.e.clientX;
    updateHotspots();
});

//================ Zoom =================
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
});

//================ Progress Bar =================
function updateProgress() {
    const totalWidth = panoramaGroup.getScaledWidth();
    const current = -panoramaGroup.left;
    let p = (current / totalWidth) * 100;
    p = Math.max(0, Math.min(100, p));
    document.getElementById("progress-fill").style.width = p + "%";
}

//================ Start =================
loadPanorama();
