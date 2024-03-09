import RecordPlayer from "./animation/RecordPlayer.js";
import CCDIKManager from "./animation/CCDIKManager.js";
import { Stand, Crouch, Prone, Death, Interaction, PosesBehindTheObject, Transitions } from './animation/states.js';

const states = {
    stand: Stand,
    crouch: Crouch,
    prone: Prone,
    death: Death,
    interaction: Interaction,
    forVehicle: PosesBehindTheObject,
    posechange: Transitions
};

export default class StateSeparator {
    #state;
    #player;
    #iksoler;

    #subState;

    constructor (model, animations, callback) {
        //нужен объект с анимациями и скелетом
        this.#player = new RecordPlayer( model.multithreading.skinnedMesh, animations, callback );
        this.#iksoler = new CCDIKManager( model.multithreading.skinnedMesh, model.ikSettings );
    }

    setState (value) {
        this.#state = new states[value];
    }

    setSubState (value) {
        this.#subState = this.#state.getSubstate(value);
        this.#play();
    }

    #play () {
        this.#player.fadeToAction( this.#subState.name, this.#subState.bodyPart, this.#subState.once, this.#subState.timeScale );
        this.#iksoler.iksSwitch( this.#subState.ikOff );
    }

    update(dt) {
        this.#player.update(dt);
        this.#iksoler.update();
    }

    clear () {
        this.#player.clear();
        this.#iksoler.clear();
        
        this.#state = undefined;
        this.#player = undefined;
        this.#iksoler = undefined;
        this.#subState = undefined;
    }
}