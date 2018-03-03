
import { RobotArmConfiguration } from './robot-arm-configuration';
import { RobotArmState } from './robot-arm-sate';

/**
 * Describes a robotic arms current state.
 * All the rotation values are repsresenting the servos current rotation
 * in radian and in the range [0,pi], 0 meaning the home position.
 */
export class RobotArm {

    public state: RobotArmState;

    constructor(private config: RobotArmConfiguration, state?: RobotArmState) {
        this.state = new RobotArmState(
            state && state.baseRotation || 0,
            state && state.shoulderRotaion || 0,
            state && state.ankleRotation || 0,
            state && state.wristRotation || 0,
            state && state.actuatorState || 0
        );
    }

    /**
     * Calculates the necessary rotation angles for the robot arm
     * to touch a point, with the hand perpendicular to the surface.
     * TODO: make a more generic inverse kinematic calculation, and use that
     * @param x "horizontal" distance from base point
     * @param y "vertical" distance from base point
     * @returns The state of a robot arm, taht is in the desired position
     */
    public touchPoint(x: number, y: number, z?: number): RobotArmState {
        // Adding offsets to the positions
        x += this.config.baseOffset.x + this.config.shoulderOffset.x;
        y += this.config.baseOffset.y + this.config.shoulderOffset.y;
        z = z || 0;
        // The distance of the point from the origin.
        const _d2 = x ** 2 + y ** 2;
        const _d = Math.sqrt(_d2);
        // TODO: Check if the position is not too far

        // The base rotation in radians
        const alpha = Math.asin(y / _d) + Math.PI / 2.;
        if (alpha < 0 || alpha > Math.PI) {
            throw RangeError('The point is out of the robot arm');
        }

        // The distance of the wrist from the shoulder
        const _dist = (this.config.baseOffset.z + this.config.shoulderOffset.z) - (this.config.handOffset.length() + z);
        const _dr = Math.sqrt(_d2 + _dist * _dist);

        // The first part of the shoulder and wrist rotation angles
        const _angle_1 = Math.asin(_d / _dr) + Math.PI / 2.;
        const _angle_2 = Math.PI - _angle_1;
        const _beta_1 = _dist > 0 ? _angle_1 : _angle_2;
        const _delta_1 = _dist > 0 ? _angle_2 : _angle_1;

        // The second parts of the shoulder and wrist angles, and the ankle rotation angle
        const _upperArmLength = this.config.ankleOffset.length();
        const _foreArmLength = this.config.wristOffset.length();
        const _x = (_upperArmLength * _upperArmLength - _foreArmLength * _foreArmLength) / (2 * _dr) + (_dr / 2);
        const _beta_2 = Math.acos(_x / _upperArmLength);
        const beta = _beta_1 + -_beta_2;
        const _delta_2 = Math.acos((_dr - _x) / _foreArmLength);
        const delta = _delta_1 + _delta_2;
        const gamma = Math.PI - _beta_2 - _delta_2;

        // TODO: sanity checks

        return new RobotArmState(
            alpha,
            beta,
            gamma,
            delta,
            this.state.actuatorState
        );
    }



}
