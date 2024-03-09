import { Vector3, Object3D } from "three";

/*WeaponDriver связан с RecordPlayer, CCDIKSolver;     Использует меши человека, оружия, скелета(кость головы);      Использует vec3 lookAt(vec3) головы и оружия
режимы:
    прицеливание: 
        1) таргет для головы будет добавлятся в {оружие->позиция для головы} 
        2) включатся ИК для спины
        3) оружие позиционируется по плечевой кости (ключица) модели
    расслабленный(желательно оружие перемещается по кисти от установленной анимации):

примечания: не должен вращать кости! Оставить вращение и доводку для костей в CCDIKSolver или же выполнять действие перед обновлением CCDIKSolver
*/

var vec3 = new Vector3;

export default class WeaponDriver {
    #aimShoulder;
    aimShoulderShift;

    #weaponBox;

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
        this.#weaponBox = new Object3D(); //контейнер под оружие
        this.#box = model.mesh;
        this.#box.add(this.#weaponBox);
        this.#aimShoulder = model.mesh.getObjectByName(this.#mSetting.aimShoulder);
        this.aimShoulderShift = this.#mSetting.aimShoulderShift.clone();

        for ( const [key, value] of this.#iks )
			this.#iks.set( key, this.#box.getObjectByName( this.#mSetting[key] ) );
    }

    #activation () {
        for ( const [key, value] of this.#iks ) {
            value.position.copy(this.#wSetting[key].position);
            value.rotation.setFromVector3(this.#wSetting[key].rotation);
            this.#weaponBox.add( value );
        }
    }

    update (target) {
        vec3.setScalar(0);
        this.#aimShoulder.localToWorld(vec3);
        this.#box.worldToLocal(vec3);

        this.#weaponBox.position.copy(vec3);
        this.#weaponBox.position.add(this.aimShoulderShift);

        if (target !== undefined)
            this.#weaponBox.lookAt( target );

        this.#weaponBox.updateMatrixWorld(true);
    }

    //добавление оружия в руки
    setWeapon ( weapon ) {
        this.removeWeapon();

        this.#weapon = weapon.mesh;
        this.#wSetting = weapon.wnDrSettings;

        this.#weaponBox.add(weapon.mesh);
        this.#activation();
    }

    //удаление оружия из рук
    removeWeapon (){
        if (!this.#weapon) return;

        this.#weaponBox.remove(this.#weapon.mesh);
        this.#weapon = undefined;
        this.#wSetting = undefined;
    }

    clear () {
        this.#aimShoulder = undefined;
        this.#weaponBox = undefined;
        this.#box = undefined;
        this.#weapon = undefined;
        this.#mSetting = undefined;
        this.#wSetting = undefined;
        this.#iks = undefined;
    }
}