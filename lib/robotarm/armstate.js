/**
 * Describes the current state of the arm.
 */
export default class ArmState {

    /** 
     * The state of the servos in radian 
     */
    //#_baseRotation;
    //#_shoulderRotation;
    //#_elbowRotation;
    //#_wristRotation;

    /** 
     * The actuator state 
     * Currently electromagnet with 0: off, 1: on values
     */
    //#_actuatorState;
    constructor(baseRotation, shoulderRotation, elbowRotation, wristRotation, actuatorState) {
        this._baseRotation = baseRotation;
        this._shoulderRotation = shoulderRotation;
        this._elbowRotation = elbowRotation;
        this._wristRotation = wristRotation;
        this._actuatorState = actuatorState;
    }

    /** The state of the actuator (0: off, 1: on) */
    get actuatorState() { return this._actuatorState; }
    /** The state of the actuator (0: off, 1: on) */
    set actuatorState(value) { this._actuatorState = value; }
    
    
    /** The rotation of the base servo in radian */    
    get baseRotation() { return this._baseRotation; }
    /** The rotation of the shoulder servo in radian */
    get shoulderRotation() { return this._shoulderRotation; }
    /** The rotation of the elbow servo in radian */
    get elbowRotation() { return this._elbowRotation; }
    /** The rotation of the wrist servo in radian */
    get wristRotation() { return this._wristRotation; }
    
    
    /** The rotation of the base servo in radian */
    set baseRotation(value) { this._baseRotation = value; }
    /** The rotation of the shoulder servo in radian */
    set shoulderRotation(value) { this._shoulderRotation = value; }
    /** The rotation of the elbow servo in radian */
    set elbowRotation(value) { this._elbowRotation = value; }
    /** The rotation of the wrist servo in radian */
    set wristRotation(value) { this._wristRotation = value; }
    
    /** The rotation of the base servo in degrees */    
    get baseRotationDegree() { return this._baseRotation * 180.0 / Math.PI; }
    /** The rotation of the shoulder servo in degrees */
    get shoulderRotationDegree() { return this._shoulderRotation * 180.0 / Math.PI; }
    /** The rotation of the elbow servo in degrees */
    get elbowRotationDegree() { return this._elbowRotation * 180.0 / Math.PI; }
    /** The rotation of the wrist servo in degrees */
    get wristRotationDegree() { return this._wristRotation * 180.0 / Math.PI; }
    

    /** The rotation of the base servo in degrees */    
    set baseRotationDegree(value) { this._baseRotation = (value / 180.0 * Math.PI); }
    /** The rotation of the shoulder servo in degrees */
    set shoulderRotationDegree(value) { this._shoulderRotation = (value / 180.0 * Math.PI); }
    /** The rotation of the elbow servo in degrees */
    set elbowRotationDegree(value) { this._elbowRotation = (value / 180.0 * Math.PI); }
    /** The rotation of the wrist servo in degrees */
    set wristRotationDegree(value) { this._wristRotation = (value / 180.0 * Math.PI); }

}