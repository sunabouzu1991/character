import './style.css';
import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

import Engine from './src/engine/engine.js';
import Stats from 'three/addons/libs/stats.module.js';

import Soldier3D from './src/listOfGaming3DModels/soldier.js';
import Ground3D from './src/listOfGaming3DModels/ground.js';
import Animation3D from './src/listOfGaming3DModels/animations.js';
import Akms3D from './src/listOfGaming3DModels/akms.js';

import KeyboardAndMouseForCharacter from './src/gameObjectManagmentTools/KeyboardAndMouseForCharacter.js';

import ChangeOriginPoints from './src/ChangeOriginPoint.js';

import { minMaxRotByClips } from './src/utils/sundry.js';



var bonesIk = ['mixamorigSpine2.quaternion', 'mixamorigSpine1.quaternion'];

var data = document.getElementById('data');
var viewWindow = document.getElementById('app');
var onPointerLockClick = document.getElementById('onPointerLockClick');

[Soldier3D, Animation3D, Akms3D].forEach( item => item.load() );

function initialize () {
	var soldier = new Soldier3D();
	var animations = new Animation3D();
	var akms = new Akms3D();

	//console.log(minMaxRotByClips(animations.mesh, bonesIk));

	var engine = new Engine();
	var stats = new Stats();
	viewWindow.appendChild( stats.dom );
	engine.addModel(stats);
	engine.create(viewWindow);

	var transformControls = new TransformControls( engine.camManager.camera, engine.renderManager.domElement );
	transformControls.size = .5;
	transformControls.space = 'world';
	// настройка положения коробки для ИК
	// отключить орбитальные элементы управления при использовании TransformControls
	transformControls.addEventListener( 'mouseDown', () => orbitControls.enabled = false );
	transformControls.addEventListener( 'mouseUp', () => orbitControls.enabled = true );
	engine.scene.add(transformControls);

	var orbitControls = new OrbitControls( engine.camManager.camera, engine.renderManager.domElement );
	orbitControls.minDistance = .3;
	orbitControls.maxDistance = 5;
	orbitControls.enableDamping = true;
	engine.camManager.camera.position.y = 3;
	engine.addModel(orbitControls);

	const ground = new Ground3D;
	engine.scene.add(ground.mesh);

	const userControll = new KeyboardAndMouseForCharacter(soldier, animations.mesh, viewWindow);
	onPointerLockClick.addEventListener( 'click', function (e) {
		userControll.lock();
	} );
	const character = userControll.character;
	engine.addModel(character);
	engine.scene.add(soldier.mesh);
	character.weapon = akms;
	var helperCam = new THREE.CameraHelper( character.camera );
	engine.scene.add(helperCam);
	// var helperSkeleton = new THREE.SkeletonHelper( soldier.mesh );
	// engine.scene.add(helperSkeleton);

	var testOriginPoint = new ChangeOriginPoints;
	engine.addModel(testOriginPoint);
	engine.scene.add(testOriginPoint.axesHelper);
	engine.scene.add(testOriginPoint.topBox);

	const panel = new GUI( { width: 310 } );
	const weaponShift = {'position X': 0, 'position Y': 0, 'position Z': 0,};
	const weaponShiftVec3 = character.weaponShift;
	const weaponDriverFolder = panel.addFolder( 'WeaponDriver' );
	weaponDriverFolder.add( weaponShift, 'position X', -10, 10, 0.01 ).listen().onChange( size => weaponShiftVec3.x = size );
	weaponDriverFolder.add( weaponShift, 'position Y', -10, 10, 0.01 ).listen().onChange( size => weaponShiftVec3.y = size );
	weaponDriverFolder.add( weaponShift, 'position Z', -10, 10, 0.01 ).listen().onChange( size => weaponShiftVec3.z = size );
	weaponDriverFolder.open();

	//Объявление глобальных переменных для отладки
	window.soldier = soldier;
	window.engine = engine;
	window.character = character;
	window.THREE = THREE;
	window.scene = engine.scene;
	window.akms = akms;
	window.transformControls = transformControls;
	window.animations = animations;
	window.headCam = character.camera;


	var arrSP = [soldier.mesh.getObjectByName('mixamorigtarget_hand_l'), soldier.mesh.getObjectByName('mixamorigtarget_hand_r'), soldier.mesh.getObjectByName('mixamorigtarget_spine'), false];
	var st = 0;
	window.switchTr = (mode = 'translate') => {
		if (arrSP[st] !== false) {
			transformControls.attach( arrSP[st] );
			transformControls.setMode( mode );
		}
		else {
			transformControls.detach();
		}

		st++;
		if(st >= arrSP.length) st = 0;
	}

	function getTxt () {
		let str = '';
		let rot, pos;
		arrSP.forEach(bone => {
			if (bone === false) return;
			rot = bone.rotation;
			pos = bone.position;
			str += `${bone.name} rot: x: ${rot.x.toFixed(4)}, y: ${rot.y.toFixed(4)}, z: ${rot.z.toFixed(4)}<br>
			pos: x: ${pos.x.toFixed(4)}, y: ${pos.y.toFixed(4)}, z: ${pos.z.toFixed(4)}<br>`;
		});
		return str;
	}


	function animate () {
		data.innerHTML = getTxt();

		requestAnimationFrame(animate);
	}
	animate();
}

setTimeout(initialize, 1000);