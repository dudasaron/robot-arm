import Vertex3d from '../geometry/vertex3d.js';

/**
 * Describes the phisical configuration of a the robot arm
 * currently supports a 6 DoF verison.
 * All offset values are calculated in the robot arms
 * starting opsition, with all the servos homed to 0.
 */
export default class ArmConfiguration {

    /**
     * The position of the base rotaion servo's axel
     * relative to the origin of the workplace
     */
    //#_baseOffset;
    get baseOffset() { return this._baseOffset; }

    /**
     * The position of the shoulder servo's axel
     * relative to the base rotation servo
     */
    //#_shoulderOffset;
    get shoulderOffset() { return this._shoulderOffset; }

    /**
     * The position of the elbow servo's axel
     * relative to the shoulder servo
     */
    //#_elbowOffset;
    get elbowOffset() { return this._elbowOffset; }

    /**
     * The position of the wrist servo's axel
     * relative to the elbow servo
     */
    //#_wristOffset;
    get wristOffset() { return this._wristOffset; }

    /**
     * The position of the hand servo's axel
     * relative to the wrist servo
     */
    //#_wristOffset;
    get handOffset() { return this._handOffset; }

    /**
     * The angular offset of the base rotaion servo
     */
    //#_baseServoOffset;
    get baseServoOffset() { return this._baseServoOffset; }

    /**
     * The angular offset of the shoulder servo
     */
    //#_shoulderServoOffset;
    get shoulderServoOffset() { return this._shoulderServoOffset; }

    /**
     * The angular offset of the elbow servo
     */
    //#_elbowServoOffset;
    get elbowServoOffset() { return this._elbowServoOffset; }

    /**
     * The angular offset of the wrist servo
     */
    //#_wristServoOffset;
    get wristServoOffset() { return this._wristServoOffset; }

    get baseServoScale() { return this._baseServoScale; }

    get shoulderServoScale() { return this._shoulderServoScale; }

    get elbowServoScale() { return this._elbowServoScale; }

    get wristServoScale() { return this._wristServoScale; }

    constructor(
        baseOffset,
        shoulderOffset,
        elbowOffset,
        wristOffset,
        handOffset,
        baseServoOffset,    
        shoulderServoOffset,    
        elbowServoOffset,   
        wristServoOffset,
        baseServoInverted,
        shoulderServoInverted,
        elbowServoInverted,
        wristServoInverted,
    ) {
        this._baseOffset = new Vertex3d(baseOffset || { x: 0, y: 0, z: 0 });
        this._shoulderOffset = new Vertex3d(shoulderOffset || { x: 0, y: 0, z: 0 });
        this._elbowOffset = new Vertex3d(elbowOffset || { x: 0, y: 0, z: 0 });
        this._wristOffset = new Vertex3d(wristOffset || { x: 0, y: 0, z: 0 });
        this._handOffset = new Vertex3d(handOffset || { x: 0, y: 0, z: 0 });

        this._baseServoOffset = baseServoOffset || 0;
        this._shoulderServoOffset = shoulderServoOffset || 0;
        this._elbowServoOffset = elbowServoOffset || 0;
        this._wristServoOffset = wristServoOffset || 0;

        this._baseServoScale = baseServoInverted ? -1 : 1;
        this._shoulderServoScale = shoulderServoInverted ? -1 : 1;
        this._elbowServoScale = elbowServoInverted ? -1 : 1;
        this._wristServoScale = wristServoInverted ? -1 : 1;
    }
}
