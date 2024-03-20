/** 
 * @typedef { {spine_: number, hands_: number, legs_: number} } bodyPart - анимации разбитые по частям, number это вес проигываемой части тела 0-1
 * @typedef { string[] } ikOff - список отключяемых ИК связей, указывается ParameterizedCharacter.#iks[0].name связи 
 * @typedef { {name: string, once: Boolean, timeScale: number, bodyPart: bodyPart, ikOff: ikOff} } substate - подсостояние
 * @typedef {State} State
*/


/** Абстрактный класс
 * @class
 * @method getSubstate - возвращает подсостояние
 * @property {substate} defaults
*/
class State {
	constructor() {
		if(this.constructor === State)
			throw new Error("Класс State имеет абстрактный тип и не может быть создан.");
		this.#checkMethod();
	}

	#checkMethod () {
		//if(this.Enter == undefined)
			//throw new Error("Метод Enter должен быть реализован")
	}

	/**@param {string} value  @return {substate | undefined}*/
	getSubstate (value) {
		let anim;
		if(value === '')
			anim = this.default; //idle
		else
			anim = this[value];

		if (anim)
			return anim;
		else {
			console.error(this.constructor.name, value, 'подсостояние не указанно либо отсутствует');
			return undefined;
		}
	}
}

// если не указываем bodyPart то анимация проигрывается по имени на всё тело

class Stand extends State {
	walk_forward = { name: "stand_forward_walk_rifle", bodyPart: { spine_: 1, legs_: 1}, ikOff: ['spine'] };
	walk_backward = { name: "stand_backward_walk_rifle", bodyPart: { spine_: 1, legs_: 1}, ikOff: ['spine'] };
	walk_left = { name: "stand_left_walk_rifle", bodyPart: { spine_: 1, legs_: 1}, ikOff: ['spine'] };
	walk_right = { name: "stand_right_walk_rifle", bodyPart: { spine_: 1, legs_: 1}, ikOff: ['spine'] };

	run_forward = {name: "stand_forward_quickWalk_rifle"};
	run_backward = {name: "stand_backward_quickWalk_rifle"};
	run_left = {name: "stand_left_quickWalk_rifle"};
	run_right = {name: "stand_right_quickWalk_rifle"};

	sprint_forward = {name: "stand_forward_sprint_rifle", ikOff: ['spine']};

	jump = { }

	default = { name:"idle_rifle", bodyPart: { spine_: 1, hands_: .2, legs_: 1}, ikOff: ['spine'] }

	constructor() {
		super();
	}
}

class Crouch extends State {
	walk_forward = {};
	walk_backward = {};
	walk_left = {};
	walk_right = {};

	run_forward = {};
	run_backward = {};
	run_left = {};
	run_right = {};

	default = {};

	constructor() {
		super();
	}
}

class Prone extends State {
	walk_forward = {}
	walk_backward = {}
	walk_left = {}
	walk_right = {}

	sprint_forward = {};

	default = {}

	constructor() {
		super();
	}
}

class Death extends State {
	stand = {}
	crouch = {}
	prone = {}
	drive = {}

	default = {}

	constructor() {
		super();
	}
}

class Interaction extends State {
	crouch_working = { }

	default = false

	constructor() {
		super();
	}
}

class PosesBehindTheObject extends State {
	driving = {}
	passenger = {}

	default = {}

	constructor() {
		super();
	}
}

class Transitions extends State {
	crouch_stand = {}
	crouch_prone = {}

	prone_crouch = {}
	prone_stand = {}

	stand_crouch = {}
	stand_prone = {}

	default = {}

	constructor() {
		super();
	}
}


/** @type {Object.<string, State>} */
const states = {
    stand: Stand,
    crouch: Crouch,
    prone: Prone,
    death: Death,
    interaction: Interaction,
    forVehicle: PosesBehindTheObject,
    posechange: Transitions
};

export default states