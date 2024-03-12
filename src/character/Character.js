import { Vector3 } from "three";

import StateSeparator from "./state_separator.js";
import CameraControll from "./CameraControll.js";
import TargetBoneDriver from "./TargetBoneDriver.js";


const vec3 = new Vector3;

export default class Character {//Mediator
    isCharacter = true;
    #target

    #stateSeparator;
    #cameraControll;
    #TargetBoneDriver

    constructor (model, animations, callback) {
        this.#stateSeparator = new StateSeparator(model, animations, callback);
        this.#cameraControll = new CameraControll(model);
        this.#TargetBoneDriver = new TargetBoneDriver( model );

        this.#target = this.#cameraControll.point;
    }

    setState (value) {
        this.#stateSeparator.setState(value);
    }

    setSubState (value) {
        this.#stateSeparator.setSubState(value);
    }

    userCamRotate (x, y, pointerSpeed, maxPolarAngle, minPolarAngle) {
        this.#cameraControll.camRotate(x, y, pointerSpeed, maxPolarAngle, minPolarAngle);
    }

    userCamSetting (speed, minAngle, maxAngle) {

    }

    update(dt){
        let targetVec;
        if (this.#target !== undefined)
            targetVec = vec3.setFromMatrixPosition( this.#target.matrixWorld );

        this.#stateSeparator.update(dt);

        this.#TargetBoneDriver.update();
        this.#TargetBoneDriver.lookAt = targetVec;

        this.#cameraControll.update();
    }

    clear () {
        this.#TargetBoneDriver.clear();
        this.#stateSeparator.clear();

        this.isCharacter = undefined;
        this.#stateSeparator = undefined;
        this.#cameraControll = undefined;
        this.#TargetBoneDriver = undefined;
        this.#target = undefined;
    }

    set weapon (value) {// object3D or undefined
        if (value !== undefined) this.#TargetBoneDriver.setWeapon( value );
        else this.#TargetBoneDriver.removeWeapon();
    }

    get camera () {
        return this.#cameraControll.camera;
    }

    get weaponShift () {
        return this.#TargetBoneDriver.aimShoulderShift;
    }
}