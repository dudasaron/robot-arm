
import { RobotArmConfiguration } from './robot-arm-configuration';
import { RobotArmState } from './robot-arm-sate';
import { LinearAlgebra } from './geometry/linear-algebra';

/**
 * Describes a robotic arms current state.
 * All the rotation values are repsresenting the servos current rotation
 * in radian and in the range [0,pi], 0 meaning the home position.
 */
export class RobotArm {

    public state: RobotArmState;

    constructor(public readonly config: RobotArmConfiguration, state?: RobotArmState) {
        this.state = new RobotArmState(
            0,
            state && state.shoulderRotation || 0,
            state && state.elbowRotation || 0,
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
        // The base rotation in radian
        const angle_offset = Math.acos(
            LinearAlgebra.scalar(
                [0, -1],
                LinearAlgebra.normalize(
                    [this.config.baseOffset.x + this.config.shoulderOffset.x, this.config.baseOffset.y + this.config.shoulderOffset.y]
                )
            )
        );
        let alpha = Math.asin(x / Math.sqrt(x ** 2 + y ** 2));
        alpha = (y < 0 ? Math.PI - alpha : alpha) - angle_offset;
        if (alpha < 0 || alpha > Math.PI) {
            throw RangeError('The point is out of the robot arm');
        }

        // Adding offsets to the positions
        const dx = this.config.baseOffset.x + this.config.shoulderOffset.x;
        const dy = this.config.baseOffset.y + this.config.shoulderOffset.y;
        z = z || 0;
        // The distance of the point from the origin.
        let _d2 = x ** 2 + y ** 2;
        const _d = Math.sqrt(_d2) - Math.sqrt(dx ** 2 + dy ** 2);
        _d2 = _d ** 2;
        // TODO: Check if the position is not too far

        // The distance of the wrist from the shoulder
        const _dist = (this.config.baseOffset.z + this.config.shoulderOffset.z) - (this.config.handOffset.length() + z);
        const _dr = Math.sqrt(_d2 + _dist ** 2);

        // The first part of the shoulder and wrist rotation angles
        const _angle_1 = Math.asin(_d / _dr);
        const _angle_2 = Math.PI - _angle_1;
        const _beta_1 = _dist > 0 ? _angle_1 : _angle_2;
        const _delta_1 = _dist > 0 ? _angle_2 : _angle_1;

        // The second parts of the shoulder and wrist angles, and the elbow rotation angle
        const _upperArmLength = this.config.elbowOffset.length();
        const _foreArmLength = this.config.wristOffset.length();
        const _x = (_upperArmLength * _upperArmLength - _foreArmLength * _foreArmLength) / (2 * _dr) + (_dr / 2);
        const _beta_2 = Math.acos(_x / _upperArmLength);

        const beta = _beta_1 + _beta_2;
        const _delta_2 = Math.acos((_dr - _x) / _foreArmLength);
        const delta = _delta_1 + _delta_2;
        const gamma = Math.PI - _beta_2 - _delta_2;

        // TODO: sanity checks

        return new RobotArmState(
            Math.round(alpha * 180.0 / Math.PI) / (180.0 / Math.PI),
            Math.round((Math.PI - beta) * 180.0 / Math.PI) / (180.0 / Math.PI),
            Math.round((Math.PI - gamma) * 180.0 / Math.PI) / (180.0 / Math.PI),
            Math.round((Math.PI - delta) * 180.0 / Math.PI) / (180.0 / Math.PI),
            this.state.actuatorState
        );
    }



}
