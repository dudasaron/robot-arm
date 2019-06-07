export class RobotArmState {

    public get baseRotationDegree() { return 180 * this.baseRotation / Math.PI; }
    public get shoulderRotationDegree() { return 180 * this.shoulderRotation / Math.PI; }
    public get elbowRotationDegree() { return 180 * this.elbowRotation / Math.PI; }
    public get wristRotationDegree() { return 180 * this.wristRotation / Math.PI; }
    public get actuatorStateDegree() { return 180 * this.actuatorState / Math.PI; }

    public constructor(
        public baseRotation: number,
        public shoulderRotation: number,
        public elbowRotation: number,
        public wristRotation: number,
        public actuatorState: number
    ) {

    }
}
