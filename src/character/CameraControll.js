import { Euler, Vector3, SphereGeometry, MeshBasicMaterial, Mesh, PerspectiveCamera, Matrix4 } from 'three';

const vec3 = new Vector3;
const _PI_2 = Math.PI / 2;
const _euler = new Euler( 0, 0, 0, 'YXZ' );

export default class CameraControll {
	// Установите ограничение наклона камеры. Диапазон от 0 до радиан Math.PI.
	minPolarAngle = 0; // radians
	maxPolarAngle = Math.PI; // radians
	pointerSpeed = 1.0;
	
	point;
    
	#attach;
	#box;

    constructor (model) {
		this.camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.05, 100 );
		this.#box = model.mesh;
		this.#attach = model.mesh.getObjectByName(model.cameraSetting.bone);
		this.#box.add(this.camera);
		this.#targetPoint();
    }

	#targetPoint () {
		vec3.setScalar(0);

		var helperSphereGeometry = new SphereGeometry( .05, 32, 16 );
		var helperSphereMaterial = new MeshBasicMaterial( { color: 'orange' } );

		this.point = new Mesh( helperSphereGeometry, helperSphereMaterial );
		this.camera.add(this.point);
		this.#getCameraDirection(vec3);

		vec3.multiplyScalar(10);

		this.point.position.copy(vec3);
	}

	#getCameraDirection( v ) {
		return v.set( 0, 0, - 1 ).applyQuaternion( this.camera.quaternion );
	}

	camRotate (x, y) {
		const camera = this.camera;
		_euler.setFromQuaternion( camera.quaternion );

		_euler.y -= x * 0.002 * this.pointerSpeed;
		_euler.x -= y * 0.002 * this.pointerSpeed;

		_euler.x = Math.max( _PI_2 - this.maxPolarAngle, Math.min( _PI_2 - this.minPolarAngle, _euler.x ) );

		camera.quaternion.setFromEuler( _euler );
	}

    update () {
		vec3.setScalar(0);
		this.#attach.localToWorld(vec3);
		this.#box.worldToLocal(vec3);

		this.camera.position.copy(vec3);
    }
}