/**
 * Runge-Kutta methods implementation.
 * See: https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods
 * 
 * TODO unfinished! No optimizations, wasteful memory management..
 */

class ButcherTableau {
    sn: number; // Number of stages
    mat: number[][]; // Coefficient matrix
    vc: number[]; // Nodes
    vb: number[]; // Weights
    vb2?: number[]; // Optional weights for lower-order method (adaptive methods)
    orders: number[]; // Orders for vb and vb2

    constructor(orders: number[], mat: number[][], vb: number[], vb2?: number[]) {
        this.sn = vb.length;
        this.orders = orders;
        this.mat = mat;
        this.vb = vb;
        this.vb2 = vb2;

        // Construct nodes by consistency
        this.vc = Array(this.sn).fill(0);
        for (let k = 0; k < this.sn; k++) {
            this.vc[k] = this.mat[k].reduce((sum, val) => sum + val, 0);
        }
    }

    isValid(): boolean {
        if (!this.mat || !this.vb || !this.vc)
            return false;
        if (this.mat.length !== this.sn || this.mat[0].length !== this.sn)
            return false;
        if (this.vb.length !== this.sn || this.vc.length !== this.sn)
            return false;
        if (this.vb2 && this.vb2.length !== this.sn)
            return false;

        // vb:s need to sum to 1:
        const sum = this.vb.reduce((acc, val) => acc + val, 0);
        if (Math.abs(sum - 1.0) > 100 * Number.EPSILON)
            return false;

        if (this.vb2) {
            const sum2 = this.vb2.reduce((acc, val) => acc + val, 0);
            if (Math.abs(sum2 - 1.0) > 100 * Number.EPSILON)
                return false;
        }

        for (let i = 0; i < this.sn; i++)
            for (let j = i; j < this.sn; j++)
                if (Math.abs(this.mat[i][j]) > 0)
                    return false;

        return true;
    }

    /**
     * Euler's method.
     */
    public static readonly EULER = new ButcherTableau(
        [1],
        [[0.0]],
        [1.0],
    );

    /**
     * Midpoint method.
     */
    public static readonly MIDPOINT = new ButcherTableau(
        [2],
        [[0.0, 0.0], [0.5, 0.0]],
        [0.0, 1.0],
    );

    /**
     * Heun's method.
     */
    public static readonly HEUN = new ButcherTableau(
        [2, 1],
        [[0.0, 0.0], [1.0, 0.0]],
        [0.5, 0.5],
        [1.0, 0.0]
    );

    /**
     * Basic RK4, safe.
     */
    public static readonly RK4 = new ButcherTableau(
        [4],
        [[0.0, 0.0, 0.0, 0.0], [0.5, 0.0, 0.0, 0.0], [0.0, 0.5, 0.0, 0.0], [0.0, 0.0, 1.0, 0.0]],
        [1.0 / 6.0, 1.0 / 3.0, 1.0 / 3.0, 1.0 / 6.0]
    );

    /**
     * Runge–Kutta–Fehlberg method.
     */
    public static readonly RKF45 = new ButcherTableau(
        [5, 4],
        [[0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [1.0 / 4.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [3.0 / 32.0, 9.0 / 32.0, 0.0, 0.0, 0.0, 0.0],
        [1932.0 / 2197.0, -7200.0 / 2197.0, 7296.0 / 2197.0, 0.0, 0.0, 0.0],
        [439.0 / 216.0, -8.0, 3680.0 / 513.0, -845.0 / 4104.0, 0.0, 0.0],
        [-8.0 / 27.0, 2.0, -3544.0 / 2565.0, 1859.0 / 4104.0, -11.0 / 40.0, 0.0]],
        [16.0 / 135.0, 0.0, 6656.0 / 12825.0, 28561.0 / 56430.0, -9.0 / 50.0, 2.0 / 55.0],
        [25.0 / 216.0, 0.0, 1408.0 / 2565.0, 2197.0 / 4104.0, -1.0 / 5.0, 0.0]
    );

    /**
     * Dormand–Prince method.
     */
    public static readonly RKDP = new ButcherTableau(
        [5, 4],
        [[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [1.0 / 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [3.0 / 40.0, 9.0 / 40.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [44.0 / 45.0, -56.0 / 15.0, 32.0 / 9.0, 0.0, 0.0, 0.0, 0.0],
        [19372.0 / 6561.0, -25360.0 / 2187.0, 64448.0 / 6561.0, -212.0 / 729.0, 0.0, 0.0, 0.0],
        [9017.0 / 3168.0, -355.0 / 33.0, 46732.0 / 5247.0, 49.0 / 176.0, -5103.0 / 18656.0, 0.0, 0.0],
        [35.0 / 384.0, 0.0, 500.0 / 1113.0, 125.0 / 192.0, -2187.0 / 6784.0, 11.0 / 84.0, 0.0]],
        [35.0 / 384.0, 0.0, 500.0 / 1113.0, 125.0 / 192.0, -2187.0 / 6784.0, 11.0 / 84.0, 0.0],
        [5179.0 / 57600.0, 0.0, 7571.0 / 16695.0, 393.0 / 640.0, -92097.0 / 339200.0, 187.0 / 2100.0, 1.0 / 40.0]
    );
}

class ODESolver {
    f: (t: number, y: number[]) => number[];
    bt: ButcherTableau;
    static ADAPTIVE_SAFETY_FACTOR = 0.85;
    static ADAPTIVE_MIN_STEP_SIZE = 1e-6;
    static ADAPTIVE_FACTOR_BOUNDS = [0.2, 5.0];
    static ADAPTIVE_STEPS_BOUNDS = [4, 1e6];

    constructor(f: (t: number, y: number[]) => number[], bt: ButcherTableau) {
        this.f = f;
        this.bt = bt;
    }

    step(y0: number[], t0: number, t1: number, useVb2: boolean = false): number[] {
        const h = t1 - t0;
        // Stage derivatives:
        const sDer: number[][] = Array.from({ length: this.bt.sn }, () => []);

        for (let s = 0; s < this.bt.sn; s++) {
            let sVal = [...y0]; // Stage value
            for (let j = 0; j < s; j++) {
                sVal = this.vectorSum(1.0, sVal, this.bt.mat[s][j], sDer[j]);
            }
            sDer[s] = this.f(t0 + h * this.bt.vc[s], sVal).map(val => val * h);
        }

        return sDer.reduce((y1, sDerVal, j) => this.vectorSum(1.0, y1, useVb2 ? this.bt.vb2![j] : this.bt.vb[j], sDerVal), [...y0]);
    }

    solve(y0: number[], t0: number, t1: number, stepNum: number): number[][] {
        const sol = [y0];
        const h = (t1 - t0) / stepNum;

        for (let k = 0; k < stepNum; k++) {
            sol.push(this.step(sol[k], t0 + k * h, t0 + (k + 1) * h));
        }

        return sol;
    }

    adaptiveSolve(y0: number[], t0: number, t1: number, atol: number, rtol: number): { ts: number[], ys: number[][] } {
        if (!this.bt.vb2)
            throw new Error("Adaptive solve requires vb2.");

        // Compute initial step size h:
        // let h = (t1 - t0) / 5.0;
        // Source: Solving Ordinary Differential Equations I: Nonstiff Problems By Ernst Hairer, Syvert P. Nørsett, Gerhard, p. 169.
        const f0 = this.f(t0, y0);
        const d0 = this.weightedNorm(y0, y0, atol, rtol);
        const d1 = this.weightedNorm(y0, f0, atol, rtol);
        let h0 = (d0 < 1e-5 || d1 < 1e-5) ? 1e-6 : 0.01 * d0 / d1;
        h0 = Math.min(h0, t1 - t0);
        const y1 = this.vectorSum(1.0, y0, h0, f0);
        const f1 = this.f(t0 + h0, y1);
        const d2 = this.weightedNorm(y0, f0.map((v, k) => f1[k] - v), atol, rtol) / h0;
        let h1 = Math.pow(0.01 / Math.max(d1, d2), 1 / (this.bt.orders[0] + 1));
        if (Math.max(d1, d2) < 1e-15)
            h1 = Math.max(1e-6, 1e-3 * h0);
        let h = Math.min(100 * h0, h1);

        let y = [...y0];
        let t = t0;
        let steps = 0;

        const tList = [t0];
        const yList = [y0];

        while (t < t1) {
            steps++;
            if (steps > ODESolver.ADAPTIVE_STEPS_BOUNDS[1])
                throw new Error("Max steps exceeded");

            h = Math.min(h, t1 - t, (t1 - t0) / ODESolver.ADAPTIVE_STEPS_BOUNDS[0]);

            const yNext = this.step(y, t, t + h);
            const yNext2 = this.step(y, t, t + h, true);
            if (yNext.some(v => !isFinite(v)) || yNext2.some(v => !isFinite(v))) {
                h = Math.max(ODESolver.ADAPTIVE_MIN_STEP_SIZE, h * ODESolver.ADAPTIVE_FACTOR_BOUNDS[0]);
                continue;
            }

            const err = this.weightedError(y, yNext, yNext2, atol, rtol);
            let factor = ODESolver.ADAPTIVE_FACTOR_BOUNDS[1];
            if (err > 1e-12)
                factor = ODESolver.ADAPTIVE_SAFETY_FACTOR * Math.pow(err, -1 / this.bt.orders[0]);
            factor = Math.min(ODESolver.ADAPTIVE_FACTOR_BOUNDS[1], Math.max(ODESolver.ADAPTIVE_FACTOR_BOUNDS[0], factor));
            let hNew = h * factor;

            if (err <= 1 || h <= ODESolver.ADAPTIVE_MIN_STEP_SIZE) {
                // Accept step
                t += h;
                y = yNext;
                h = hNew;

                tList.push(t);
                yList.push(y);
            } else {
                // Reject step, do not advance t
                h = Math.max(hNew, ODESolver.ADAPTIVE_MIN_STEP_SIZE);
            }
        }
        console.log(`ODESolver.adaptiveSolve steps: ${steps}`);

        return { ts: tList, ys: yList };
    }

    private vectorSum(a: number, x: number[], b: number, y: number[]): number[] {
        return x.map((val, i) => a * val + b * y[i]);
    }

    // private vectorDist(x: number[], y: number[]): number {
    //     return Math.sqrt(x.reduce((sum, xi, i) => sum + (xi - y[i]) ** 2, 0));
    // }

    private weightedNorm(ref: number[], vec: number[], atol: number, rtol: number): number {
        let sumSq = 0;
        for (let i = 0; i < ref.length; i++) {
            const scale = atol + rtol * Math.abs(ref[i]);
            const ratio = vec[i] / scale;
            sumSq += ratio * ratio;
        }
        return Math.sqrt(sumSq / ref.length);
    }

    private weightedError(y: number[], y1: number[], y2: number[], atol: number, rtol: number): number {
        let sumSq = 0;
        for (let i = 0; i < y.length; i++) {
            const scale = atol + rtol * Math.max(Math.abs(y[i]), Math.abs(y1[i]));
            const diff = (y1[i] - y2[i]) / scale;
            sumSq += diff * diff;
        }
        return Math.sqrt(sumSq / y.length);
    }
}


export { ButcherTableau, ODESolver };