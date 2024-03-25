const canvas = document.getElementById('canvas');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEL = document.getElementById('size');
const colorEl = document.getElementById('color');
const clearEl = document.getElementById('clear');
const downloadBtn = document.getElementById('downloadBtn');

const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.98;
canvas.height = window.innerHeight * 0.82;

let size = 10;
let isPressed = false;
let color = 'black';
let x, y;

function getPosition(e) {
    if (e.touches) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {
        return { x: e.clientX, y: e.clientY };
    }
}

canvas.addEventListener('mousedown', (e) => {
    isPressed = true;
    const pos = getPosition(e);
    x = pos.x - canvas.offsetLeft;
    y = pos.y - canvas.offsetTop;
});

document.addEventListener('mouseup', () => {
    isPressed = false;
    x = undefined;
    y = undefined;
});

canvas.addEventListener('mousemove', (e) => {
    e.preventDefault();
    if (isPressed) {
        document.getElementById('status').innerText = "...Processing";
        const pos = getPosition(e);
        const x2 = pos.x - canvas.offsetLeft;
        const y2 = pos.y - canvas.offsetTop;

        drawCircle(x2, y2);
        drawLine(x, y, x2, y2);

        x = x2;
        y = y2;
    }
});

canvas.addEventListener('touchstart', (e) => {
    const pos = getPosition(e);
    x = pos.x - canvas.offsetLeft;
    y = pos.y - canvas.offsetTop;
    isPressed = true;
});

canvas.addEventListener('touchend', () => {
    isPressed = false;
    x = undefined;
    y = undefined;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isPressed) {
        document.getElementById('status').innerText = "...Processing";
        const pos = getPosition(e);
        const x2 = pos.x - canvas.offsetLeft;
        const y2 = pos.y - canvas.offsetTop;

        drawCircle(x2, y2);
        drawLine(x, y, x2, y2);

        x = x2;
        y = y2;
    }
});

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 2;
    ctx.stroke();
}

function updateSizeOnScreen() {
    sizeEL.innerText = size;
}

increaseBtn.addEventListener('click', () => {
    size += 1;
    if (size > 50) {
        size = 50;
    }
    updateSizeOnScreen();
});

decreaseBtn.addEventListener('click', () => {
    size -= 1;
    if (size < 2) {
        size = 2;
    }
    updateSizeOnScreen();
});

colorEl.addEventListener('change', (e) => (color = e.target.value));

clearEl.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveCanvasToLocalStorage();
});

function downloadCanvas() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.drawImage(canvas, 0, 0);

    const copyrightText = '\u00A9 Designed by Soumojit Shome';
    tempCtx.fillStyle = 'black';
    tempCtx.font = '12px Arial';

    const textWidth = tempCtx.measureText(copyrightText).width;
    const x = tempCanvas.width - textWidth - 10; // 10px padding from right
    const y = tempCanvas.height - 10; // 10px padding from bottom

    tempCtx.fillText(copyrightText, x, y);

    const dataUrl = tempCanvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'canvas_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

downloadBtn.addEventListener('click', downloadCanvas);


// window.onbeforeunload = function (e) {
//     // Define the confirmation message
//     var confirmationMessage = "Changes you made may not be saved.";

//     // Display the confirmation message
//     (e || window.event).returnValue = confirmationMessage; // For IE and Firefox
//     return confirmationMessage; // For other browsers
// };


// const saveBtn = document.getElementById('saveBtn');

// Function to save the canvas image to localStorage
function saveCanvasToLocalStorage() {
    const dataUrl = canvas.toDataURL('image/png');
    localStorage.setItem('savedCanvas', dataUrl);
    // alert('Canvas saved successfully!');
    document.getElementById('status').innerText = "Saved";
}

// Attach event listener to the save button
// saveBtn.addEventListener('click', saveCanvasToLocalStorage);

setInterval(() => {
    saveCanvasToLocalStorage();
}, 3000);


// Function to retrieve saved canvas data from localStorage
function loadCanvasFromLocalStorage() {
    const savedDataUrl = localStorage.getItem('savedCanvas');
    if (savedDataUrl) {
        const img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        };
        img.src = savedDataUrl;
    }
}

// Call the function when the page loads
window.addEventListener('load', loadCanvasFromLocalStorage);



const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
let undoStack = [];
let redoStack = [];

// Function to save the current canvas state
function saveCanvasState() {
    undoStack.push(canvas.toDataURL());
    redoStack = []; // Clear the redo stack when a new action is performed
    updateUndoRedoButtons();
}

// Function to update the state of undo and redo buttons
function updateUndoRedoButtons() {
    undoBtn.disabled = undoStack.length === 0;
    redoBtn.disabled = redoStack.length === 0;
}

// Function to undo the last drawing action
function undo() {
    if (undoStack.length > 0) {
        document.getElementById('status').innerText = "...Processing";
        redoStack.push(canvas.toDataURL()); // Save the current state before undoing
        const dataUrl = undoStack.pop(); // Retrieve the previous state
        const img = new Image();
        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = dataUrl;
        updateUndoRedoButtons();
    }
}

// Function to redo the last undone action
function redo() {
    if (redoStack.length > 0) {
        document.getElementById('status').innerText = "...Processing";
        undoStack.push(canvas.toDataURL()); // Save the current state before redoing
        const dataUrl = redoStack.pop(); // Retrieve the next state
        const img = new Image();
        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = dataUrl;
        updateUndoRedoButtons();
    }
}

// Attach event listeners to the undo and redo buttons
undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);

// Attach event listener to save canvas state whenever a drawing action is performed
canvas.addEventListener('mousedown', saveCanvasState);
canvas.addEventListener('touchstart', saveCanvasState);

// Initialize the state of undo and redo buttons
updateUndoRedoButtons();

