import { Vertex3D } from './geometry/vertex-3d';

/**
 * Describes the phisical configuration of a the robot arm
 * currently supports a 6 DoF verison.
 * All offset values are calculated in the robot arms
 * starting opsition, with all the servos homed to 0.
 */
export class RobotArmConfiguration {

    /**
     * The position of the base rotaion servos axel
     * relative to the origin of the workplace
     */
    public readonly baseOffset: Vertex3D;

    /**
     * The position of the shoulder servos axel
     * relative to the base rotation servo
     */
    public readonly shoulderOffset: Vertex3D;

    /**
     * The position of the ankle servos axel
     * relative to the shoulder servo
     */
    public readonly ankleOffset: Vertex3D;

    /**
     * The position of the wrist servos axel
     * relative to the ankle servo
     */
    public readonly wristOffset: Vertex3D;

    /**
     * The position of the actator endpoint
     * relative to the wrist servo
     */
    public readonly handOffset: Vertex3D;

    public constructor(
        baseOffset?: any,
        shoulderOffset?: any,
        ankleOffset?: any,
        wristOffset?: any,
        handOffset?: any
    ) {
        this.baseOffset     = new Vertex3D(baseOffset || {x: 0, y: 0, z: 0});
        this.shoulderOffset = new Vertex3D(shoulderOffset || {x: 0, y: 0, z: 0});
        this.ankleOffset    = new Vertex3D(ankleOffset || {x: 0, y: 0, z: 0});
        this.wristOffset    = new Vertex3D(wristOffset || {x: 0, y: 0, z: 0});
        this.handOffset     = new Vertex3D(handOffset || {x: 0, y: 0, z: 0});
    }
}
