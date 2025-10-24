export function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function lerp(start, end, t) {
    return start + (end - start) * t;
}

export function distance(pointA, pointB) {
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function normalize(vector) {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    return length > 0 ? { x: vector.x / length, y: vector.y / length } : { x: 0, y: 0 };
}