/**
 * Runge-Kutta methods implementation.
 * Not tested fully.
 * see: https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods
 */

class ButcherTableau {
    sn: number; // Number of stages
    mat: number[][]; // Coefficient matrix
    vc: number[]; // Nodes
    vb: number[]; // Weights
    vb2?: number[]; // Optional weights for lower-order method (adaptive methods)

    constructor(mat: number[][], vb: number[], vb2?: number[]) {
        this.sn = vb.length;
        this.mat = mat;
        this.vb = vb;
        this.vb2 = vb2;

        // Construct nodes by consistency
        this.vc = Array(this.sn).fill(0);
        for (let k = 0; k < this.sn; k++) {
            this.vc[k] = mat[k].reduce((sum, val) => sum + val, 0);
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
        if (Math.abs(sum - 1.0) > 100*Number.EPSILON) 
            return false;

        if (this.vb2) {
            const sum2 = this.vb2.reduce((acc, val) => acc + val, 0);
            if (Math.abs(sum2 - 1.0) > 100*Number.EPSILON) 
                return false;
        }

        return true;
    }

    /**
     * Euler's method.
     */
    public static readonly EULER = new ButcherTableau(
        [[0.0]],
        [1.0]
    );

    /**
     * Midpoint method.
     */
    public static readonly MIDPOINT = new ButcherTableau(
        [[0.0, 0.0], [0.5, 0.0]],
        [0.0, 1.0]
    );

    /**
     * Heun's method.
     */
    public static readonly HEUN = new ButcherTableau(
        [[0.0, 0.0], [1.0, 0.0]],
        [0.5, 0.5],
        [1.0, 0.0]
    );

    /**
     * Basic RK4, safe.
     */
    public static readonly RK4 = new ButcherTableau(
        [[0.0, 0.0, 0.0, 0.0], [0.5, 0.0, 0.0, 0.0], [0.0, 0.5, 0.0, 0.0], [0.0, 0.0, 1.0, 0.0]],
        [1.0/6.0, 1.0/3.0, 1.0/3.0, 1.0/6.0]
    );

    /**
     * Runge–Kutta–Fehlberg method.
     */
    public static readonly RKF45 = new ButcherTableau(
        [[0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [1.0/4.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [3.0/32.0, 9.0 / 32.0, 0.0, 0.0, 0.0, 0.0],
        [1932.0/2197.0, -7200.0/2197.0, 7296.0/2197.0, 0.0, 0.0, 0.0],
        [439.0/216.0, -8.0, 3680.0/513.0, -845.0/4104.0, 0.0, 0.0],
        [-8.0/27.0, 2.0, -3544.0/2565.0, 1859.0/4104.0, -11.0/40.0, 0.0]],
        [16.0/135.0, 0.0, 6656.0/12825.0, 28561.0/56430.0, -9.0/50.0, 2.0/55.0],
        [25.0/216.0, 0.0, 1408.0/2565.0, 2197.0/4104.0, -1.0/5.0, 0.0]
    );

    /**
     * Dormand–Prince method.
     */
    public static readonly RKDP = new ButcherTableau(
        [[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [1.0/5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [3.0/40.0, 9.0/40.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [44.0/45.0, -56.0/15.0, 32.0/9.0, 0.0, 0.0, 0.0, 0.0],
        [19372.0/6561.0, -25360.0/2187.0, 64448.0/6561.0, -212.0/729.0, 0.0, 0.0, 0.0],
        [9017.0/3168.0, -355.0/33.0, 46732.0/5247.0, 49.0/176.0, -5103.0/18656.0, 0.0, 0.0],
        [35.0/384.0, 0.0, 500.0/1113.0, 125.0/192.0, -2187.0/6784.0, 11.0/84.0, 0.0]],
        [35.0/384.0, 0.0, 500.0/1113.0, 125.0/192.0, -2187.0/6784.0, 11.0/84.0, 0.0],
        [5179.0/57600.0, 0.0, 7571.0/16695.0, 393.0/640.0, -92097.0/339200.0, 187.0/2100.0, 1.0/40.0]
    );
}

class ODESolver {
    f: (t: number, y: number[]) => number[];
    bt: ButcherTableau;

    constructor(f: (t: number, y: number[]) => number[], bt: ButcherTableau) {
        this.f = f;
        this.bt = bt;
    }

    step(y0: number[], t0: number, t1: number, useVb2: boolean=false): number[] {
        const h = t1-t0;
        const sDer: number[][] = Array(this.bt.sn).fill([]); // Stage derivatives

        for (let s = 0; s < this.bt.sn; s++) {
            let sVal = [...y0]; // Stage value
            for (let j = 0; j < s; j++) {
                sVal = this.vectorSum(1.0, sVal, this.bt.mat[s][j], sDer[j]);
            }
            sDer[s] = this.f(t0 + h*this.bt.vc[s], sVal).map(val => val*h);
        }

        return sDer.reduce((y1, sDerVal, j) => this.vectorSum(1.0, y1, useVb2 ? this.bt.vb2![j] : this.bt.vb[j], sDerVal), [...y0]);
    }

    solve(y0: number[], t0: number, t1: number, stepNum: number): number[][] {
        const sol = [y0];
        const h = (t1-t0)/stepNum;

        for (let k = 0; k < stepNum; k++) {
            sol.push(this.step(sol[k], t0+k*h, t0+(k+1)*h));
        }

        return sol;
    }

    adaptiveSolve(y0: number[], t0: number, t1: number, tol: number): number[] {
        if (!this.bt.vb2) 
            throw new Error("Adaptive solve requires vb2.");

        let h = (t1-t0)/5.0;
        let y = [...y0];
        let t = t0;
        let steps = 0;

        while (t < t1) {
            if (t+h > t1) 
                h = t1-t;

            const yNext = this.step(y, t, t+h);
            const yNext2 = this.step(y, t, t+h, true);

            const err = this.vectorDist(yNext, yNext2);
            if (err > tol && h > (t1-t0)/100000.0) {
                h *= 0.5;
            } else {
                t += h;
                y = yNext;
                if (err < tol*0.1) 
                    h *= 2.0;
            }
            steps++;
        }
        if (steps > 100)
            console.log(steps);

        return y;
    }

    private vectorSum(a: number, x: number[], b: number, y: number[]): number[] {
        return x.map((val, i) => a*val + b*y[i]);
    }

    private vectorDist(x: number[], y: number[]): number {
        return Math.sqrt(x.reduce((sum, xi, i) => sum + (xi-y[i])**2, 0));
    }
}


export { ButcherTableau, ODESolver };