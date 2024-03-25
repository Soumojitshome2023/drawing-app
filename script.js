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
    if (size < 3) {
        size = 3;
    }
    updateSizeOnScreen();
});

colorEl.addEventListener('change', (e) => (color = e.target.value));

clearEl.addEventListener('click', () =>
    ctx.clearRect(0, 0, canvas.width, canvas.height)
);

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


window.onbeforeunload = function (e) {
    // Define the confirmation message
    var confirmationMessage = "Changes you made may not be saved.";

    // Display the confirmation message
    (e || window.event).returnValue = confirmationMessage; // For IE and Firefox
    return confirmationMessage; // For other browsers
};


