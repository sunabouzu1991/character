import StateSeparator from "./state_separator.js";
import CameraControll from "./CameraControll.js";
import TargetBoneDriver from "./TargetBoneDriver.js";
import { Object3D } from "three";


/**
 * @typedef { import('./state_separator.js').ParameterizedCharacter } ParameterizedCharacter
 * @typedef { import('../gaming-model/HandObject.js').HandObject } HandObject
*/

/** Character класс Посредник
 * @class
 * @property {Boolean} isCharacter
 * @property {StateSeparator} #stateSeparator
 * @property {CameraControll} #cameraControll
 * @property {TargetBoneDriver} #targetBoneDriver
 */
export default class Character {
    isCharacter = true;

    #stateSeparator;
    #cameraControll;
    #targetBoneDriver;

    /** @param {ParameterizedCharacter} model  @param {AnimationClip[]} animations  @param {Function} callback */
    constructor (model, animations, callback) {
        this.#stateSeparator = new StateSeparator(model, animations, callback);
        this.#cameraControll = new CameraControll(model);
        this.#targetBoneDriver = new TargetBoneDriver(model);
    }

    /** @param {string} value  */
    setState (value) {
        this.#stateSeparator.setState(value);
    }

    /** @param {string} value  */
    setSubState (value) {
        this.#stateSeparator.setSubState(value);
    }

    /**@param {number} x  @param {number} y */
    userCamRotate (x, y) {
        this.#cameraControll.camRotate(x, y);
    }

    /**@param {number} dt*/
    update (dt) {
        let targetVec = this.#cameraControll.aimPoint;
        this.#targetBoneDriver.lookAt = targetVec;

        this.#stateSeparator.update(dt);
        this.#targetBoneDriver.update();
        this.#cameraControll.update();
    }

    clear () {
        this.#targetBoneDriver.clear();
        this.#stateSeparator.clear();

        this.isCharacter = undefined;
        this.#stateSeparator = undefined;
        this.#cameraControll = undefined;
        this.#targetBoneDriver = undefined;
    }

    /**@param {HandObject | undefined} value*/
    set handObject (value) {
        this.#targetBoneDriver.object = value;
    }

    /**@param {Object3D} value*/
    set camera (value) {
        return this.#cameraControll.camera = value;
    }
}