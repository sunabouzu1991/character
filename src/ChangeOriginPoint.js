import { AxesHelper, BoxGeometry, MeshStandardMaterial, Mesh, Matrix4 } from "three";

const clearMatrix = new Matrix4;
const pivot_matrix = new Matrix4;
const pivot_inv = new Matrix4;
const desiredTransform = new Matrix4;

export default class ChangeOriginPoints {
    axesHelper;
    topBox;
    
    constructor () {
        this.axesHelper = new AxesHelper(1);
        //this.axesHelper.applyMatrix4(new Matrix4().makeTranslation(1.5, 0, -1.5));
        this.axesHelper.position.set(3.5, 0, -3.5);
        
        const geometry = new BoxGeometry(0.5, 0.5, 0.5);
        const material = new MeshStandardMaterial({
            color: 0xff0000
        });
        this.topBox = new Mesh(geometry, material);
        //this.topBox.applyMatrix4(new Matrix4().makeRotationX(Math.PI / 8));
        this.topBox.rotateX(Math.PI / 8);
        //this.topBox.applyMatrix4(new Matrix4().makeTranslation(0.5, 1, -0.5));
        this.topBox.position.set(0.5, 1, -0.5);
    }

    update () {
        pivot_matrix.copy(clearMatrix);

        // получить мировые преобразования из желаемой точки поворота
        pivot_matrix.copy(this.axesHelper.matrixWorld);
        // инвертируйте его, чтобы узнать, как переместить точку вращения на [0,0,0]
        pivot_inv.copy(pivot_matrix).invert();

        // поместите точку поворота в [0,0,0]
        // применить те же преобразования к объекту
        this.axesHelper.applyMatrix4(pivot_inv);
        this.topBox.applyMatrix4(pivot_inv);

        // скажем, мы хотим повернуть на 0.1 градуса вокруг оси Y поворота.
        desiredTransform.copy(clearMatrix).makeRotationY(Math.PI / 360);
        this.axesHelper.applyMatrix4(desiredTransform);
        this.topBox.applyMatrix4(desiredTransform);

        // и верните все обратно, т. е. примените начальное преобразование поворота
        this.axesHelper.applyMatrix4(pivot_matrix);
        this.topBox.applyMatrix4(pivot_matrix);
    }
}