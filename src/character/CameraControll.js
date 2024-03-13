import { Euler, Vector3, PerspectiveCamera, Object3D } from 'three';

const vec3 = new Vector3;
const _PI_2 = Math.PI / 2;
const _euler = new Euler( 0, 0, 0, 'YXZ' );
/**	CameraControll - управление поворотом камеры
 * @class
 * @property {number} minPolarAngle - минимальный угол поворота по оси X
 * @property {number} maxPolarAngle - максимальный угол поворота по оси X
 * @property {number} pointerSpeed - коэффициэнт скорости вращения
 * @property {Object3D} #point - точка в направление взгляда камеры
 * @property {Object3D} #attach - объект для позиционирования камеры
 * @property {Object3D} #box - 
*/
export default class CameraControll {
	// Установите ограничение наклона камеры. Диапазон от 0 до радиан Math.PI.
	minPolarAngle = (30/180)*Math.PI; // radians
	maxPolarAngle = (150/180)*Math.PI; // radians
	pointerSpeed = 1.0;

	/**@type {Object3D}*/
	#point;
	/**@type {Object3D}*/
	#attach;
	/**@type {Object3D}*/
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

		this.#point = new Object3D;
		this.camera.add(this.#point);
		this.#getCameraDirection(vec3);

		vec3.multiplyScalar(10);

		this.#point.position.copy(vec3);
	}

	#getCameraDirection( v ) {
		return v.set( 0, 0, - 1 ).applyQuaternion( this.camera.quaternion );
	}

	/**@param {number} x  @param {number} y */
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

	get aimPoint () {
		return vec3.setFromMatrixPosition(this.#point.matrixWorld);
	}
}