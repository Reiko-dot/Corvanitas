const canvas = new fabric.Canvas("c", { selection: false });

canvas.setWidth(window.innerWidth);
canvas.setHeight(window.innerHeight);

const sliceWidth = 3476;
const sliceHeight = 1507;

let currentX = 0;
const slices = [];

// Helper to load one slice
function loadSlice(path, index) {
    fabric.Image.fromURL(path, function(img) {
        img.set({
            left: currentX,
            top: 0,
            selectable: true,
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            hoverCursor: "grab",
            moveCursor: "grabbing",
            sliceIndex: index
        });

        slices.push(img);
        canvas.add(img);
        canvas.requestRenderAll();

        // move next slice position
        currentX += sliceWidth;
    });
}

/* -------------------------
   ALL 32 IMAGES LISTED HERE
   ------------------------- */

loadSlice("images/canvas1.jpg", 1);
loadSlice("images/canvas2.jpg", 2);
loadSlice("images/canvas3.jpg", 3);
loadSlice("images/canvas4.jpg", 4);
loadSlice("images/canvas5.jpg", 5);
loadSlice("images/canvas6.jpg", 6);
loadSlice("images/canvas7.jpg", 7);
loadSlice("images/canvas8.jpg", 8);
loadSlice("images/canvas9.jpg", 9);
loadSlice("images/canvas10.jpg", 10);
loadSlice("images/canvas11.jpg", 11);
loadSlice("images/canvas12.jpg", 12);
loadSlice("images/canvas13.jpg", 13);
loadSlice("images/canvas14.jpg", 14);
loadSlice("images/canvas15.jpg", 15);
loadSlice("images/canvas16.jpg", 16);
loadSlice("images/canvas17.jpg", 17);
loadSlice("images/canvas18.jpg", 18);
loadSlice("images/canvas19.jpg", 19);
loadSlice("images/canvas20.jpg", 20);
loadSlice("images/canvas21.jpg", 21);
loadSlice("images/canvas22.jpg", 22);
loadSlice("images/canvas23.jpg", 23);
loadSlice("images/canvas24.jpg", 24);
loadSlice("images/canvas25.jpg", 25);
loadSlice("images/canvas26.jpg", 26);
loadSlice("images/canvas27.jpg", 27);
loadSlice("images/canvas28.jpg", 28);
loadSlice("images/canvas29.jpg", 29);
loadSlice("images/canvas30.jpg", 30);
loadSlice("images/canvas31.jpg", 31);
loadSlice("images/canvas32.jpg", 32);

/* -------------------------
   DRAG & INTERACTION LOGIC
   ------------------------- */

canvas.on("mouse:down", (e) => {
    if (e.target) e.target.opacity = 0.8;
});
canvas.on("mouse:up", (e) => {
    if (e.target) e.target.opacity = 1;
});
canvas.on("object:moving", () => {
    canvas.requestRenderAll();
});

/* -------------------------
   RESIZE SUPPORT
   ------------------------- */
window.addEventListener("resize", () => {
    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerHeight);
    canvas.requestRenderAll();
});

