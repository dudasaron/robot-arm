import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import * as $ from 'jquery';
import { element } from 'protractor';
import { RobotArm } from './models/robot-arm';
import { RobotArmConfiguration } from './models/robot-arm-configuration';
import { LinearAlgebra } from './models/geometry/linear-algebra';
import { ArmConfig } from './models/arm-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  private readonly SCREEN_WIDTH = 400;
  private readonly SCREEN_HEIGHT = 400;
  private readonly VIEW_ANGLE = 45;
  private readonly ASPECT_RATIO = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
  private readonly NEAR_CUT = 0.1;
  private readonly FAR_CUT = 100;

  private renderer: THREE.Renderer;
  private camera: THREE.Camera;
  private scene: THREE.Scene;

  private canvas: HTMLCanvasElement;

  public arm: RobotArm;

  private renderPipeline: (() => void)[] = [];


  private arm_parts: any[] = [];
  private redraw_arm = false;

  private prevPos = [1, 0];
  private currentPos = [1, 0];
  private targetPos = [1, 0];

  public control = new ArmConfig();

  constructor() {
    this.arm = new RobotArm(new RobotArmConfiguration(
      {x: 0, y: 0, z: 0.9},
      {x: 0, y: -0.207, z: 0.117},
      {x: 0, y: 0, z: 1.35},
      {x: 0, y: 0, z: 0.90},
      {x: 0, y: 0, z: 0.45}
    ));
    this.arm.state = this.arm.touchPoint(1, 0, 0);
  }

  public ngOnInit(): void {
    this.startRendering();
  }

  private startRendering(): void {
    this.renderer = new THREE.WebGLRenderer();

    this.setUpCamera(); // TODO: return the camera object

    this.setUpScene(); // TODO: return the scene object

    this.setUpLighting(); // TODO: work on a parameter scene

    // Add the camera to the scene.
    this.scene.add(this.camera);

    this.renderer.render(this.scene, this.camera);

    // Start the renderer.
    this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);

    const update = () => {
      // Draw!
      this.renderer.render(this.scene, this.camera);

      for (let i = 0; i < this.renderPipeline.length; ++i) {
        this.renderPipeline[i]();
      }

      // Schedule the next frame.
      setTimeout(requestAnimationFrame(update), 10);
    };

    // Schedule the first frame.
    requestAnimationFrame(update);

    // Get the DOM element to attach to
    const container = document.getElementById('preview-canvas');

    $(container).empty();
    // Attach the renderer-supplied
    // DOM element.
    container.appendChild(this.renderer.domElement);
  }

  private setUpCamera() {
    this.camera = new THREE.PerspectiveCamera(
      this.VIEW_ANGLE,
      this.ASPECT_RATIO,
      this.NEAR_CUT,
      this.FAR_CUT
    );

    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 10;

    this.camera.lookAt(2.5, 0, 0);

    this.camera.up.set(0, 0, 1);

    let camera_rotation = Math.PI;
    this.renderPipeline.push(() => {
      this.camera.position.set(Math.sin(camera_rotation) * 6 + 2.5, Math.cos(camera_rotation) * 6, 7);
      this.camera.lookAt(2.5, 0, 0);

      camera_rotation += 0.005;
      if (camera_rotation >= 2 * Math.PI) {
        camera_rotation -= 2 * Math.PI;
      }
    });
  }

  private setUpScene(): void {
    this.scene = new THREE.Scene();

    let canvas_updated = true;

    // Create the canvas for the surface
    this.initCanvas((event: any) => {
      if (LinearAlgebra.equals(this.prevPos, this.targetPos)) {
        const x = event.layerX - event.target.offsetLeft;
        const y = event.layerY - event.target.offsetTop;
        canvas_updated = true;
        this.renderCanvas({x: x, y: y});

        this.targetPos = [5 * x / 400, 5 * y / 400 - 2.5];
      }
    });

    // Create the surface planes material from the canvas
    const surface_texture = new THREE.Texture(this.canvas);
    const surface_material = new THREE.MeshBasicMaterial({ map: surface_texture, side: THREE.DoubleSide });

    // Create the surface
    const surface = new THREE.Mesh(
      new THREE.PlaneGeometry(
        5,
        5,
        40,
        40),
      surface_material);

    surface.position.x = 2.5;

    // Finally, add the surface to the scene.
    this.scene.add(surface);

    this.renderPipeline.push(() => {
      surface_texture.needsUpdate = canvas_updated;
      canvas_updated = false;
    });

    this.arm_parts = this.drawRobotArm();
    for (let i = 0; i < this.arm_parts.length; ++i) {
      this.scene.add(this.arm_parts[i]);
    }

    this.renderPipeline.push(() => {
      if (!LinearAlgebra.equals(this.prevPos, this.targetPos)) {
        const _d = LinearAlgebra.sub(this.targetPos, this.prevPos);
        const _dlen = LinearAlgebra.abs(_d);
        const d = LinearAlgebra.scale(_d, 0.03 / _dlen);

        this.currentPos = LinearAlgebra.add(this.currentPos, d);


        if (LinearAlgebra.abs(LinearAlgebra.sub(this.currentPos, this.targetPos)) < 1.1 * LinearAlgebra.abs(d)) {
          this.currentPos = LinearAlgebra.duplicate(this.targetPos);
          this.prevPos = LinearAlgebra.duplicate(this.targetPos);
        }
        const l = LinearAlgebra.abs(LinearAlgebra.sub(this.currentPos, this.prevPos));

        const z = (- ((l - _dlen / 2) ** 2) + (_dlen / 2) ** 2) * (1.2 / (_dlen / 2) ** 2);

        this.arm.state = this.arm.touchPoint(this.currentPos[0], this.currentPos[1], z );
        for (let i = 0; i < this.arm_parts.length; ++i) {
          this.scene.remove(this.arm_parts[i]);
        }
        this.arm_parts = this.drawRobotArm();
        for (let i = 0; i < this.arm_parts.length; ++i) {
          this.scene.add(this.arm_parts[i]);
        }
      }
    });
  }

  private drawRobotArm(): any[] {
    const result = [];
    const line_material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const origin = new THREE.Vector3(0, 0, 0);

    const last_pos = new THREE.Vector3();
    const next_pos = new THREE.Vector3();
    last_pos.copy(origin);

    const axel = new THREE.Vector3(1, 0, 0);
    const up = new THREE.Vector3(0, 0, 1);
    axel.applyAxisAngle(up, this.arm.state.baseRotation);

    // Base
    result.push(new THREE.Line(this.createLineGeometry(origin, this.arm.config.baseOffset), line_material));
    const joint = this.createJoint(this.arm.config.baseOffset);
    result.push(joint);
    last_pos.copy(joint.position);

    // Shoulder
    let offset = new THREE.Vector3(this.arm.config.shoulderOffset.x, this.arm.config.shoulderOffset.y, this.arm.config.shoulderOffset.z);
    offset.applyAxisAngle(up, this.arm.state.baseRotation);
    next_pos.copy(last_pos).add(offset);
    result.push(new THREE.Line(this.createLineGeometry(last_pos, next_pos), line_material));
    result.push(this.createJoint(next_pos));
    last_pos.copy(next_pos);

    // Elbow
    offset = new THREE.Vector3(this.arm.config.elbowOffset.x, this.arm.config.elbowOffset.y, this.arm.config.elbowOffset.z);
    offset.applyAxisAngle(axel, this.arm.state.shoulderRotation);
    next_pos.copy(last_pos).add(offset);
    result.push(new THREE.Line(this.createLineGeometry(last_pos, next_pos), line_material));
    result.push(this.createJoint(next_pos));
    last_pos.copy(next_pos);

    // Wrist
    offset = new THREE.Vector3(this.arm.config.wristOffset.x, this.arm.config.wristOffset.y, this.arm.config.wristOffset.z);
    offset.applyAxisAngle(axel, this.arm.state.shoulderRotation + this.arm.state.elbowRotation);
    next_pos.copy(last_pos).add(offset);
    result.push(new THREE.Line(this.createLineGeometry(last_pos, next_pos), line_material));
    result.push(this.createJoint(next_pos));
    last_pos.copy(next_pos);


    // Hand
    offset = new THREE.Vector3(this.arm.config.handOffset.x, this.arm.config.handOffset.y, this.arm.config.handOffset.z);
    offset.applyAxisAngle(axel, this.arm.state.shoulderRotation + this.arm.state.elbowRotation + this.arm.state.wristRotation);
    next_pos.copy(last_pos).add(offset);
    result.push(new THREE.Line(this.createLineGeometry(last_pos, next_pos), line_material));
    result.push(this.createJoint(next_pos, 0.05));
    last_pos.copy(next_pos);

    return result;
  }

  private createJoint(coords: any, d?: number): THREE.Mesh {
    const joint_geometry = new THREE.SphereGeometry(d || 0.1, 10, 10);
    const joint_material = new THREE.MeshLambertMaterial( {color: 0x00ff00 });

    const mesh = new THREE.Mesh(joint_geometry, joint_material);
    mesh.position.set(coords.x, coords.y, coords.z);
    return mesh;
  }

  private createLineGeometry(from: any, to: any): THREE.Geometry {
    const geometry = new THREE.Geometry();

      geometry.vertices.push(new THREE.Vector3(from.x, from.y, from.z));
      geometry.vertices.push(new THREE.Vector3(to.x, to.y, to.z));

      return geometry;
  }

  private setUpLighting(): void {

    // create a point light
    const pointLight =
    new THREE.PointLight(0xFFFFFF);

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 30;

    // add to the scene
    this.scene.add(pointLight);
  }

  private initCanvas(on_click: (event) => void) {
    this.canvas = <HTMLCanvasElement>document.getElementById('target-position-selector');

    this.canvas.onclick = on_click;

    this.canvas.width = 400;
    this.canvas.height = 400;

    this.renderCanvas();
  }

  private renderCanvas(coords?: any) {
    const context = this.canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, 400, 400);

    for (let i = 0; i <= 400; i += 4) {
      context.strokeStyle = i % 40 === 0 ? '#303030' : '#afafaf';
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, 400);
      context.moveTo(0, i);
      context.lineTo(400, i);
      context.stroke();
    }

    context.fillStyle = '#000';
    context.fillRect(0, 190, 20, 20);

    if (coords) {
      context.beginPath();
      context.fillStyle = '#f00';
      context.arc(coords.x, coords.y, 5, 0, Math.PI * 2, false);
      context.fill();
    }
  }
}
