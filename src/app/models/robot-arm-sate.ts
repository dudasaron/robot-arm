export class RobotArmState {

    public constructor(
        public baseRotation: number,
        public shoulderRotaion: number,
        public ankleRotation: number,
        public wristRotation: number,
        public actuatorState: number
    ) {

    }
}
