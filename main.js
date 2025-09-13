console.log("working");

const view = document.getElementById("canvas").getContext("2d");
const canvas = view.canvas;
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    view.font = "48px Arial";
}

window.addEventListener("resize", resize);
resize();

class Body {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5;
        this.dx = Math.cos(angle) * speed;
        this.dy = Math.sin(angle) * speed;
        this.color = "white";
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.color = "white";

        // wrap bodies around the screen
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
    }
    intersects(other) {
        const distance = Math.hypot(this.x - other.x, this.y - other.y);
        if (distance < this.radius + other.radius) {
            this.color = "red";
            other.color = "red";
        }
    }
    draw() {
        view.fillStyle = this.color;
        
        // view.beginPath();
        // view.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // view.fill();

        view.fillRect(this.x, this.y, 2, 2);
    }
}

function overlap(box1, box2) {
    return !(box1.right < box2.left || 
             box1.left > box2.right || 
             box1.bottom < box2.top || 
             box1.top > box2.bottom);
}

class Cell {
    constructor(top, bottom, left, right) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
        this.bodies = [];
    }
}

const bodies = [];
const numBodies = 10000;
for (let i = 0; i < numBodies; i++) {
    const radius = 1;
    const x = Math.random() * (canvas.width - 2 * radius) + radius;
    const y = Math.random() * (canvas.height - 2 * radius) + radius;
    bodies.push(new Body(x, y, radius));
}
let frames = 0;
let now = 0;
let fps = 0;
function animate(ts) {
    frames += 1;
    if (ts - now > 1000) {
        now = ts;
        fps = frames;
        frames = 0;
    }
    view.clearRect(0, 0, canvas.width, canvas.height);
    view.fillStyle = "blue";
    view.fillText(`FPS: ${fps}`, 4, 40);
    for (const b of bodies) b.update();

    // for (const b1 of bodies) {
    //     for (const b2 of bodies) {
    //         if (b1 !== b2) b1.intersects(b2);
    //     }
    // }

    // for (let i = 0; i < bodies.length; i++) {
    //     for (let j = i + 1; j < bodies.length; j++) {
    //         bodies[i].intersects(bodies[j]);
    //     }
    // }

    const xDivs = 50;
    const yDivs = 50;
    const arrays = [];
    for (const b of bodies) {
        const xIndex = Math.floor(b.x / canvas.width * xDivs);
        const yIndex = Math.floor(b.y / canvas.height * yDivs);
        if (!arrays[xIndex]) arrays[xIndex] = [];
        if (!arrays[xIndex][yIndex]) arrays[xIndex][yIndex] = [];
        arrays[xIndex][yIndex].push(b);
    }

    for (let x = 0; x < arrays.length; x++) {
        for (let y = 0; y < (arrays[x] || []).length; y++) {
            const cell = arrays[x][y];
            if (!cell) continue;
            for (let i = 0; i < cell.length; i++) {
                for (let j = i + 1; j < cell.length; j++) {
                    cell[i].intersects(cell[j]);
                }
            }
        }
    }

    for (const b of bodies) {
        const box = { top: b.y - b.radius * 2, bottom: b.y + b.radius * 2, left: b.x - b.radius * 2, right: b.x + b.radius * 2 };

    }

    for (const b of bodies) b.draw();
    requestAnimationFrame(animate);
}
animate(0);
