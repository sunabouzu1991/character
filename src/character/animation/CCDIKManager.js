import { CCDIKSolver } from 'three/addons/animation/CCDIKSolver.js';
import { Quaternion } from 'three';

const qSourceWorld = new Quaternion();
const qDestParentWorld = new Quaternion();

class IKSolver extends CCDIKSolver {

    constructor ( mesh, iks ) {
        super( mesh, iks )
    }

    updateOne ( ik ) {
        if (ik.off === true) return;

        super.updateOne( ik );
        
        const bones = this.mesh.skeleton.bones; // for reference overhead reduction in loop
        const effector = bones[ ik.effector ];
        const target = bones[ ik.target ]; // don't use getWorldPosition() here for the performance

        //update effector rotation
        target.getWorldQuaternion(qSourceWorld);
        effector.parent.getWorldQuaternion(qDestParentWorld);
        effector.quaternion.multiplyQuaternions( qDestParentWorld.invert(), qSourceWorld);
    }

    clear () {
        for ( const key of Object.entries(this) )
            this[key] = undefined;
    }
}


export default class CCDIKManager {
    #engine;
    #iks;

    constructor (skinnedMesh, iks) {
        this.#iks = iks;
        this.#engine = new IKSolver( skinnedMesh, this.#iks );
    }

    iksSwitch (arr) {
        this.#iks.forEach(ik => ik.off = false);

        if ( Array.isArray(arr) === false ) return;

        if (arr[0] === 'all') this.#iks.forEach(ik => ik.off = true);
        else arr.forEach(name => {
            this.#iks.forEach(ik => {
                if(name === ik.name) ik.off = true;
            });
        });
    }

    update(target) {
        this.#engine.update();
    }

    clear() {
        this.#engine.clear();
        this.#engine = undefined;
        this.#iks = undefined;
    }
}