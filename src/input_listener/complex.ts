/**
 * Just for testing, use math.js instead.
 */
import * as THREE from 'three';

class Complex {
    static ONE = new Complex(1, 0);
    static ZERO = new Complex(0, 0);
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromVector2(v: THREE.Vector2) {
        return new Complex(v.x, v.y);
    }

    add(c: Complex) {
        return new Complex(this.x+c.x, this.y+c.y);
    }

    sub(c: Complex) {
        return new Complex(this.x-c.x, this.y-c.y);
    }

    mul(c: Complex) {
        return new Complex(this.x*c.x - this.y*c.y, this.x*c.y + this.y*c.x);
    }

    div(c: Complex) {
        const r2 = c.abs() ** 2;
        return new Complex((this.x*c.x+this.y*c.y)/r2, (-this.x*c.y+this.y*c.x)/r2);
    }

    scale(s: number) {
        return new Complex(this.x*s, this.y*s);
    }

    conj() {
        return new Complex(this.x, -this.y);
    }

    abs() {
        return Math.hypot(this.x, this.y);
    }

    arg() {
        return Math.atan2(this.y, this.x);
    }

    exp() {
        const r = Math.exp(this.x);
        return new Complex(r*Math.cos(this.y), r*Math.sin(this.y));
    }
}

export { Complex };