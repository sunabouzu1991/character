import { Vector3, Group, Object3D } from "three";

var vec3 = new Vector3;

/** TargetBoneDriver - управление таргетовыми костями в коробке.
 * @class
 * @property {Bone} #aimShoulder - точка крепления для Object3D
 * @property {Vector3} #aimShoulderShift - смещение от точки крепления
 * @property {Group} #boneBox - коробка для таргетовых костей
 * @property {Object3D} #space - Родительское пространство для коробки(boneBox)
 * @property {Object3D} #interactionObject - объект для крепления в коробку
 * @property {Object} #spaceSetting - настройки для TargetBoneDriver
 * @property {Object} #IOSetting - настройки для таргетовых костей
 * @property {{}Bone} #targetBones - список таргетовы костей
 */
export default class TargetBoneDriver {
    /**@type {Bone}*/
    #aimShoulder;
    /** @type {Vector3} */
    #aimShoulderShift;

    /** @type {Group} */
    #boneBox;

    /** @type {Object3D} */
    #space;
    /** @type {Object3D} */
    #interactionObject;

    /** @type {Object} */
    #spaceSetting;
    /** @type {Object} */
    #IOSetting;

    /** @type {Map<string, Object3D>} */
    #targetBones = new Map ([
		['forend', undefined],
		['hilt', undefined],
		['head', undefined]
	]);

    constructor ( model ) {
        this.#spaceSetting = model.wnDrSettings;
        this.#boneBox = new Group(); //контейнер под оружие
        this.#space = model.mesh;
        this.#space.add(this.#boneBox);
        this.#aimShoulder = model.mesh.getObjectByName(this.#spaceSetting.aimShoulder);
        this.#aimShoulderShift = this.#spaceSetting.aimShoulderShift.clone();

        for ( const [key, value] of this.#targetBones ) {
            const bone = this.#space.getObjectByName( this.#spaceSetting[key] );
			this.#targetBones.set( key, bone );
            this.#boneBox.add( bone );
        }
    }

    #activation () {
        for ( const [key, value] of this.#targetBones ) {
            value.position.copy(this.#IOSetting[key].position);
            value.rotation.setFromVector3(this.#IOSetting[key].rotation);
        }
    }

    update () {
        vec3.setScalar(0);
        this.#aimShoulder.localToWorld(vec3);
        this.#space.worldToLocal(vec3);

        this.#boneBox.position.copy(vec3);
        this.#boneBox.position.add(this.#aimShoulderShift);

        this.#boneBox.updateMatrixWorld(true);
    }

    //удаление предмета из коробки
    removeObject () {
        if (!this.#interactionObject) return;

        this.#boneBox.remove(this.#interactionObject.mesh);
        this.#interactionObject = undefined;
        this.#IOSetting = undefined;
    }

    clear () {
        this.#aimShoulder = undefined;
        this.#boneBox = undefined;
        this.#space = undefined;
        this.#interactionObject = undefined;
        this.#spaceSetting = undefined;
        this.#IOSetting = undefined;
        this.#targetBones = undefined;
        this.#aimShoulderShift = undefined;
    }

    /**добавление предмета в коробку @param {Object3D} value */
    set object (value) {
        this.removeObject();

        this.#interactionObject = value.mesh;
        this.#IOSetting = value.wnDrSettings;

        this.#boneBox.add(value.mesh);
        this.#activation();
    }

    /**указывает точку в пространтсве куда направлена коробка(boneBox) @param {Vector3} value */
    set lookAt (value) {
        this.#boneBox.lookAt(value);
    }
}