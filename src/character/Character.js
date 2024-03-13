import StateSeparator from "./state_separator.js";
import CameraControll from "./CameraControll.js";
import TargetBoneDriver from "./TargetBoneDriver.js";


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

    constructor (model, animations, callback) {
        this.#stateSeparator = new StateSeparator(model, animations, callback);
        this.#cameraControll = new CameraControll(model);
        this.#targetBoneDriver = new TargetBoneDriver(model);
    }

    setState (value) {
        this.#stateSeparator.setState(value);
    }

    setSubState (value) {
        this.#stateSeparator.setSubState(value);
    }

    userCamRotate (x, y) {
        this.#cameraControll.camRotate(x, y);
    }

    userCamSetting (speed, minAngle, maxAngle) {

    }

    update(dt){
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

    set weapon (value) {// object3D or undefined
        if (value !== undefined) this.#targetBoneDriver.object = value;
        else this.#targetBoneDriver.removeObject();
    }

    get camera () {
        return this.#cameraControll.camera;
    }

    get weaponShift () {
        return this.#targetBoneDriver.aimShoulderShift;
    }
}