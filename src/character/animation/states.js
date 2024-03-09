class AbstractState {
	constructor() {
		if(this.constructor === AbstractState)
			throw new Error("Класс AbstractState имеет абстрактный тип и не может быть создан.");
		this.#checkMethod();
	}

	#checkMethod () {
		//if(this.Enter == undefined)
			//throw new Error("Метод Enter должен быть реализован")
	}

	getSubstate (value) {// value: string
		let anim;
		if(value === '')
			anim = this.default; //idle
		else
			anim = this[value];

		if (anim)
			return anim;
		else
			console.error(this.constructor.name, value, 'подсостояние не указанно либо отсутствует')
	}
}

// bodyPart = {base_: weight, spine_: weight, hands_: weight, legs_: weight}
// если не указываем bodyPart то анимация проигрывается по имени на всё тело

class Stand extends AbstractState {
	walk_forward = { name: "stand_forward_walk_rifle", bodyPart: {base_: 1, spine_: 1, hands_: 1, legs_: 1}, ikOff: ['spine'] };
	walk_backward = { name: "stand_backward_walk_rifle", bodyPart: {base_: 1, spine_: 1, hands_: 1, legs_: 1}, ikOff: ['spine'] };
	walk_left = { name: "stand_left_walk_rifle", bodyPart: {base_: 1, spine_: 1, hands_: 1, legs_: 1}, ikOff: ['spine'] };
	walk_right = { name: "stand_right_walk_rifle", bodyPart: {base_: 1, spine_: 1, hands_: 1, legs_: 1}, ikOff: ['spine'] };

	walk_forwardleft = {name: "stand_forwardLeft_walk_rifle"};
	walk_forwardright = {name: "stand_forwardRight_walk_rifle"};
	walk_backwardleft = {name: "stand_backwardLeft_walk_rifle"};
	walk_backwardright = {name: "stand_backwardRight_walk_rifle"};

	run_forward = {name: "stand_forward_quickWalk_rifle"};
	run_backward = {name: "stand_backward_quickWalk_rifle"};
	run_left = {name: "stand_left_quickWalk_rifle"};
	run_right = {name: "stand_right_quickWalk_rifle"};

	run_forwardleft = {name: "stand_forwardLeft_quickWalk_rifle"};
	run_forwardright = {name: "stand_forwardRight_quickWalk_rifle"};
	run_backwardleft = {name: "stand_backwardLeft_quickWalk_rifle"};
	run_backwardright = {name: "stand_backwardRight_quickWalk_rifle"};

	sprint_forward = {name: "stand_forward_sprint_rifle", ikOff: ['spine']};
	sprint_forwardleft = { };
	sprint_forwardright = { };

	jump = { }

	default = { name:"idle_rifle", bodyPart: {base_: 1, spine_: 1, hands_: .2, legs_: 1}, ikOff: ['spine'] }

	constructor(context) {
		super(context);
	}
}

class Crouch extends AbstractState {
	walk_forward = {name: "crouch_forward_walk_rifle", };
	walk_backward = {name: "crouch_backward_walk_rifle", };
	walk_left = {name: "crouch_left_walk_rifle", };
	walk_right = {name: "crouch_right_walk_rifle", };

	walk_forwardleft = {name: "crouch_forwardLeft_walk_rifle", };
	walk_forwardright = {name: "crouch_forwardRight_walk_rifle", };
	walk_backwardleft = {name: "crouch_backwardLeft_walk_rifle", };
	walk_backwardright = {name: "crouch_backwardRight_walk_rifle", };

	run_forward = {name: "crouch_forward_quickWalk_rifle", };
	run_backward = {name: "crouch_backward_quickWalk_rifle", };
	run_left = {name: "crouch_left_quickWalk_rifle", };
	run_right = {name: "crouch_right_quickWalk_rifle", };

	run_forwardleft = {name: "crouch_forwardLeft_quickWalk_rifle", };
	run_forwardright = {name: "crouch_forwardRight_quickWalk_rifle", };
	run_backwardleft = {name: "crouch_backwardLeft_quickWalk_rifle", };
	run_backwardright = {name: "crouch_backwardRight_quickWalk_rifle", };

	sprint_forward = {name: "stand_forward_sprint_rifle", };

	default = {name:"crouch_idle_rifle", };

	constructor(context) {
		super(context);
	}
}

class Prone extends AbstractState {
	walk_forward = {name: "prone_forward_walk_rifle",  ikOff: ['spine', 'left_hand']}
	walk_backward = {name: "prone_forward_walk_rifle", timeScale: -1, ikOff: ['spine', 'left_hand']}
	walk_left = {name:"prone_left_walk_rifle",  ikOff: ['spine', 'left_hand']}
	walk_right = {name:"prone_right_walk _rifle",  ikOff: ['spine', 'left_hand']}

	sprint_forward = {name: "prone_forward_sprint_rifle",  ikOff: ['spine', 'left_hand']};

	default = {name:"prone_idle_rifle",  ikOff: ['spine']}

	constructor(context) {
		super(context);
	}
}

class Death extends AbstractState {
	stand = {once: true,  }
	crouch = {once: true,  }
	prone = {once: true,  }
	drive = {once: true,  }

	default = {once: true,  }

	constructor(context) {
		super(context);
	}
}

class Interaction extends AbstractState {
	crouch_working = { }

	default = false

	constructor(context) {
		super(context);
	}
}

class PosesBehindTheObject extends AbstractState {
	ptrk = { }
	ags = { }
	dshk = { }
	bussol = {}
	gaubica = { }
	minomet = { }
	driving = {}
	passenger = {}

	default = {}

	constructor(context) {
		super(context);
	}
}

class Transitions extends AbstractState {
	crouch_stand = {name:"idle_rifle", once: true}
	crouch_prone = {name:"crouch_to_prone_rifle", once: true, ikOff: ['spine']}

	prone_crouch = {name:"prone_to_crouch_rifle", once: true, ikOff: ['spine']}
	prone_stand = {name:"prone_to_crouch_rifle", once: true, ikOff: ['spine']}

	stand_crouch = {name:"crouch_idle_rifle", once: true, ikOff: ['spine']}
	stand_prone = {name:"crouch_to_prone_rifle", once: true, ikOff: ['spine']}

	constructor(context) {
		super(context);
	}
}


export { Stand, Crouch, Prone, Death, Interaction, PosesBehindTheObject, Transitions }