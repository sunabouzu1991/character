import { Vector3, Group } from "three";

/*TargetBoneDriver связан с RecordPlayer, CCDIKSolver;     Использует меши человека, оружия, скелета(кость головы);      Использует vec3 lookAt(vec3) головы и оружия
режимы:
    прицеливание: 
        1) таргет для головы будет добавлятся в {оружие->позиция для головы} 
        2) включатся ИК для спины
        3) оружие позиционируется по плечевой кости (ключица) модели
    расслабленный(желательно оружие перемещается по кисти от установленной анимации):

примечания: не должен вращать кости! Оставить вращение и доводку для костей в CCDIKSolver или же выполнять действие перед обновлением CCDIKSolver
*/

var vec3 = new Vector3;

export default class TargetBoneDriver {
    #aimShoulder;
    aimShoulderShift;

    #boneBox;

    #box;
    #weapon;

    #mSetting;
    #wSetting;

    #iks = new Map ([
		['forend', undefined],
		['hilt', undefined],
		['head', undefined]
	]);

    constructor ( model ) {
        this.#mSetting = model.wnDrSettings;
        this.#boneBox = new Group(); //контейнер под оружие
        this.#box = model.mesh;
        this.#box.add(this.#boneBox);
        this.#aimShoulder = model.mesh.getObjectByName(this.#mSetting.aimShoulder);
        this.aimShoulderShift = this.#mSetting.aimShoulderShift.clone();

        for ( const [key, value] of this.#iks ) {
            const bone = this.#box.getObjectByName( this.#mSetting[key] );
			this.#iks.set( key, bone );
            this.#boneBox.add( bone );
        }
    }

    #activation () {
        for ( const [key, value] of this.#iks ) {
            value.position.copy(this.#wSetting[key].position);
            value.rotation.setFromVector3(this.#wSetting[key].rotation);
        }
    }

    update () {
        vec3.setScalar(0);
        this.#aimShoulder.localToWorld(vec3);
        this.#box.worldToLocal(vec3);

        this.#boneBox.position.copy(vec3);
        this.#boneBox.position.add(this.aimShoulderShift);

        this.#boneBox.updateMatrixWorld(true);
    }

    //добавление оружия в руки
    setWeapon ( weapon ) {
        this.removeWeapon();

        this.#weapon = weapon.mesh;
        this.#wSetting = weapon.wnDrSettings;

        this.#boneBox.add(weapon.mesh);
        this.#activation();
    }

    //удаление оружия из рук
    removeWeapon (){
        if (!this.#weapon) return;

        this.#boneBox.remove(this.#weapon.mesh);
        this.#weapon = undefined;
        this.#wSetting = undefined;
    }

    clear () {
        this.#aimShoulder = undefined;
        this.#boneBox = undefined;
        this.#box = undefined;
        this.#weapon = undefined;
        this.#mSetting = undefined;
        this.#wSetting = undefined;
        this.#iks = undefined;
    }

    set lookAt (value) {
        this.#boneBox.lookAt( value );
    }
}