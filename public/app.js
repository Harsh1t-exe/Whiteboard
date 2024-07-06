const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const socket = io();

let drawing = false;

canvas.addEventListener('mousedown', (event) => {
    drawing = true;
    draw(event.clientX, event.clientY);
    socket.emit('draw', { x: event.clientX, y: event.clientY, type: 'start' });
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', (event) => {
    if (!drawing) return;
    draw(event.clientX, event.clientY);
    socket.emit('draw', { x: event.clientX, y: event.clientY, type: 'draw' });
});

function draw(x, y) {
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

socket.on('draw', (data) => {
    if (data.type === 'start') {
        ctx.beginPath();
        ctx.moveTo(data.x, data.y);
    } else if (data.type === 'draw') {
        draw(data.x, data.y);
    }
});
