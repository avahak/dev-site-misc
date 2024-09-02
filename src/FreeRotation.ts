import * as THREE from 'three';
import { ButcherTableau, ODESolver } from './ODESolver';

// Compute the inertia matrix as if it came from this box:
const box = new THREE.Vector3(1.0, 2.5, 0.8);
const I0Array = [(box.y*box.y+box.z*box.z)/12, (box.x*box.x+box.z*box.z)/12, (box.x*box.x+box.y*box.y)/12];
const I0 = new THREE.Matrix4().set(I0Array[0], 0, 0, 0, 0, I0Array[1], 0, 0, 0, 0, I0Array[2], 0, 0, 0, 0, 1);
const w0 = new THREE.Vector4(1.0, 0.001, -0.0005, 0).multiplyScalar(10.0);
const L0 = w0.clone().applyMatrix4(I0);
const E0 = 0.5*w0.dot(L0);

/**
 * Returns q'(t), where q(t) is the free rotation of a 3d body.
 * This is obtained from angular velocity w via q'(t)=0.5*w*q(t).
 * Angular velocity w satisfies L=Iw, where I=I(t) is the inertia matrix and L 
 * is angular momentum. Angular momentum is constant: L=L0 and inertia matrix depends
 * on the rotation with I=R*I0*R^t, where R is rotation matrix corresponding to q.
 * Therefore q'=0.5*w*q, where w=I^{-1}L=I^{-1}L0 and I=R*I0*R^t.
 */
const derivative = (_t: number, qArray: number[]) => {
    const q = new THREE.Quaternion(...qArray);
    const rotationMatrix = new THREE.Matrix4().makeRotationFromQuaternion(q);
    const inertiaMatrix = rotationMatrix.clone().multiply(I0).multiply(rotationMatrix.clone().transpose());
    // Angular velocity:
    let w = L0.clone().applyMatrix4(inertiaMatrix.clone().invert());
    // Compute rotational energy:
    let E = 0.5*w.dot(w.clone().applyMatrix4(inertiaMatrix));
    // Scale w so that energy is preseved:
    w.multiplyScalar(Math.sqrt(E0/E));
    const dq = new THREE.Quaternion(...w.clone().multiplyScalar(0.5)).multiply(q);
    return dq.toArray();
};

const os = new ODESolver(derivative, ButcherTableau.RKF45);

const step = (q: THREE.Quaternion, dt: number) => {
    const qNew = new THREE.Quaternion(...os.adaptiveSolve(q.toArray(), 0.0, dt, 1.0e-9));
    return qNew.normalize();
};

export default step;