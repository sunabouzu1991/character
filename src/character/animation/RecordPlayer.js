import { AnimationMixer, LoopOnce } from "three";

class BodyAction {
	parent;
	action;
	timeScale;

	constructor (parent) {
		this.parent = parent;
	}

	setAction (name, once, timeScale, duration, weight = 1) {
		if (name === this.action && this.timeScale === timeScale) return;

		let previousAction = this.parent.getActionByName(this.action);
		let action = this.parent.getActionByName(name);

		this.timeScale = timeScale;
		this.action = name;

		//проигрывание с остановкой на последнем кадре
		if (once === true) {
			action.clampWhenFinished = true;
			action.loop = LoopOnce;
		}

		if ( previousAction !== undefined ) 
			previousAction.fadeOut( duration );

		if ( action !== undefined && weight !== 0)
			action
				.reset()
				.setEffectiveTimeScale( timeScale )
				.setEffectiveWeight( weight )
				.fadeIn( duration )
				.play();
	}

	clear () {
		this.parent = undefined;
		this.action = undefined;
	}
}



export default class RecordPlayer {
	#mixer;
	#actions = {};

	#callback;

	#interval;
	#duration;

	#bodyActions = new Map ([
		['base_' , undefined],
		['spine_' , undefined],
		['hands_' , undefined],
		['legs_' , undefined]
	]);

	constructor (object, animations, callback) {
		//объект с анимациями
		this.#mixer = new AnimationMixer(object);

		//заполняем массив клипами
	    for (var i = 0; i < animations.length; i ++) {
	        var clip = animations[i];
	        var action = this.#mixer.clipAction(clip);
	        this.#actions[clip.name] = action;
	    }

		this.#callback = callback;

		for ( const [key, value] of this.#bodyActions )
			this.#bodyActions.set( key, new BodyAction(this) );
	}

    fadeToAction (name, bodyPart, once, timeScale = 1, duration = 0.4) {//str, obj, num, bool, timeInSec
		if (this.#interval === undefined) {
			this.#interval = setInterval(this.#callback, duration*1000);
			this.#duration = duration;
		}
		else if (this.#duration !== duration) {
			clearInterval(this.#interval);
			this.#interval = setInterval(this.#callback, duration*1000);
			this.#duration = duration;
		}

		// bodyPart = {base_: weight, spine_: weight, hands_: weight, 'legs_: weight}
		if (bodyPart)
			for ( const [key, value] of this.#bodyActions ) {
				if (bodyPart[key] !== undefined) 
					value.setAction(key+name, once, timeScale, duration, bodyPart[key]);
			}
		else
			for ( const [key, value] of this.#bodyActions ) {
				value.setAction(key+name, once, timeScale, duration);
			}
    }

	getActionByName (value) {
		if(this.#actions[value] === undefined) {
			console.error(this.constructor.name ,`Анимация: ${value} отсутствует`);
			return undefined;
		}

		return this.#actions[value];
	}

	update (dt) {
		this.#mixer.update(dt);
	}

	clear () {
		for ( const [key, value] of this.#bodyActions ) value.clear();

		this.#mixer = undefined;
		this.#actions = undefined;
		this.#bodyActions = undefined;
		this.#callback = undefined;
		this.#interval = undefined;
		this.#duration = undefined;
	}
}