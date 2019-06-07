export class ArmConfig {

    private _baseRotation: number;
    private _shoulderRotation: number;
    private _elbowRotation: number;
    private _wristRotation: number;

    public get baseRotation(): number { return this._baseRotation; }
    public get shoulderRotation(): number { return this._shoulderRotation; }
    public get elbowRotation(): number { return this._elbowRotation; }
    public get wristRotation(): number { return this._wristRotation; }

    public set baseRotation(value: number) { this._baseRotation = value; }
    public set shoulderRotation(value: number) { this._shoulderRotation = value; }
    public set elbowRotation(value: number) { this._elbowRotation = value; }
    public set wristRotation(value: number) { this._wristRotation = value; }

    public get baseRotationDegree(): number { return this._baseRotation * 180.0 / Math.PI; }
    public get shoulderRotationDegree(): number { return this._shoulderRotation * 180.0 / Math.PI; }
    public get elbowRotationDegree(): number { return this._elbowRotation * 180.0 / Math.PI; }
    public get wristRotationDegree(): number { return this._wristRotation * 180.0 / Math.PI; }

    public set baseRotationDegree(value: number) { this._baseRotation = (value / 180.0 * Math.PI); }
    public set shoulderRotationDegree(value: number) { this._shoulderRotation = (value / 180.0 * Math.PI); }
    public set elbowRotationDegree(value: number) { this._elbowRotation = (value / 180.0 * Math.PI); }
    public set wristRotationDegree(value: number) { this._wristRotation = (value / 180.0 * Math.PI); }

}