import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/105/three.module.js';

// TODO: make configurable
const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 400;
const VIEW_ANGLE = 45;
const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
const NEAR_CUT = 0.1;
const FAR_CUT = 100;

const CAMERA_X = 2.5;
const CAMERA_Y = -6;
const CAMERA_Z = 7;

const LOOK_AT_X = 2.5;
const LOOK_AT_Y = 0;
const LOOK_AT_Z = 0;

const UP_X = 0;
const UP_Y = 0;
const UP_Z = 1;

const LIGHT_X = 10;
const LIGHT_Y = 50;
const LIGHT_Z = 30;

const LIGHT_COLOR = 0xFFFFFF;

// TODO: create class, so multiple instantiations is possible
let renderer, camera, scene;

let canvas;
let canvas_updated = true;

let renderPipeline = [];

let arm;
let armParts = [];

export function initDisplay(robotArm, targetElement, canvasElement) {
    // Store configs
    arm = robotArm
    canvas = canvasElement;

    // Create rendere
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    // Create scene
    scene = _setUpScene();

    // Create camera
    camera = _setUpCamera();
    scene.add(camera);

    // Add some lighning
    let light = _setUpLight();
    scene.add(light);

    // First draw
    redraw(true);

    // Clean up
    targetElement.innerHTML = '';
    // Attach the renderer-supplied
    // DOM element.
    targetElement.appendChild(renderer.domElement);

}

export function redraw(updateCanvas = false) {
    canvas_updated = updateCanvas;
    requestAnimationFrame(_update);
}

function _update() {

    renderPipeline.forEach(stage => stage());

    renderer.render(scene, camera);

}

function _setUpScene() {
    let scene = new THREE.Scene();

    canvas_updated = true;
    // Create the surface planes material from the canvas
    let surface_texture = new THREE.Texture(canvas);
    let surface_material = new THREE.MeshBasicMaterial({ map: surface_texture, side: THREE.DoubleSide });

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
    scene.add(surface);

    // Add surface update to the render pipeline
    renderPipeline.push(() => {
      surface_texture.needsUpdate = canvas_updated;
      canvas_updated = false;
    });

    // Initially draw the arm
    armParts = _getArmParts();
    armParts.forEach(part => scene.add(part));

    // Add arm drawing to the render pipeline
    renderPipeline.push(() => {
        armParts.forEach(part => scene.remove(part));

        armParts = _getArmParts();

        armParts.forEach(part => scene.add(part));
    });

    return scene;
}

function _setUpCamera() {
    let camera = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT_RATIO,
      NEAR_CUT,
      FAR_CUT
    );

    camera.position.x = CAMERA_X;
    camera.position.y = CAMERA_Y;
    camera.position.z = CAMERA_Z;

    camera.lookAt(LOOK_AT_X, LOOK_AT_Y, LOOK_AT_Z);

    camera.up.set(UP_X, UP_Y, UP_Z);

    return camera;
}

function _setUpLight() {

    // create a point light
    const pointLight =
    new THREE.PointLight(LIGHT_COLOR);

    // set its position
    pointLight.position.x = LIGHT_X;
    pointLight.position.y = LIGHT_Y;
    pointLight.position.z = LIGHT_Z;

    // add to the scene
    return pointLight;
  }

function _getArmParts() {
    const parts = [];
    const line_material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const origin = new THREE.Vector3(0, 0, 0);

    const last_pos = new THREE.Vector3();
    const next_pos = new THREE.Vector3();
    last_pos.copy(origin);

    const axel = new THREE.Vector3(1, 0, 0);
    const up = new THREE.Vector3(0, 0, 1);
    axel.applyAxisAngle(up, arm.state.baseRotation * arm.config.baseServoScale);

    // Base
    parts.push(new THREE.Line(_createLineGeometry(origin, arm.config.baseOffset), line_material));
    const joint = _createJoint(arm.config.baseOffset);
    parts.push(joint);
    last_pos.copy(joint.position);

    // Shoulder
    let offset = new THREE.Vector3(arm.config.shoulderOffset.x, arm.config.shoulderOffset.y, arm.config.shoulderOffset.z);
    offset.applyAxisAngle(up, arm.state.baseRotation * arm.config.baseServoScale + arm.config.baseServoOffset);
    next_pos.copy(last_pos).add(offset);
    parts.push(new THREE.Line(_createLineGeometry(last_pos, next_pos), line_material));
    parts.push(_createJoint(next_pos));
    last_pos.copy(next_pos);

    // Elbow
    offset = new THREE.Vector3(arm.config.elbowOffset.x, arm.config.elbowOffset.y, arm.config.elbowOffset.z);
    offset.applyAxisAngle(axel, arm.state.shoulderRotation * arm.config.shoulderServoScale + arm.config.shoulderServoOffset);
    next_pos.copy(last_pos).add(offset);
    parts.push(new THREE.Line(_createLineGeometry(last_pos, next_pos), line_material));
    parts.push(_createJoint(next_pos));
    last_pos.copy(next_pos);

    // Wrist
    offset = new THREE.Vector3(arm.config.wristOffset.x, arm.config.wristOffset.y, arm.config.wristOffset.z);
    offset.applyAxisAngle(axel, arm.state.shoulderRotation * arm.config.shoulderServoScale + arm.config.shoulderServoOffset + arm.state.elbowRotation * arm.config.elbowServoScale + arm.config.elbowServoOffset);
    next_pos.copy(last_pos).add(offset);
    parts.push(new THREE.Line(_createLineGeometry(last_pos, next_pos), line_material));
    parts.push(_createJoint(next_pos));
    last_pos.copy(next_pos);


    // Hand
    offset = new THREE.Vector3(arm.config.handOffset.x, arm.config.handOffset.y, arm.config.handOffset.z);
    offset.applyAxisAngle(axel, arm.state.shoulderRotation * arm.config.shoulderServoScale + arm.config.shoulderServoOffset + arm.state.elbowRotation * arm.config.elbowServoScale + arm.config.elbowServoOffset + arm.state.wristRotation * arm.config.wristServoScale + arm.config.wristServoOffset);
    next_pos.copy(last_pos).add(offset);
    parts.push(new THREE.Line(_createLineGeometry(last_pos, next_pos), line_material));
    parts.push(_createJoint(next_pos, 0.05, arm.state.actuatorState ? 0xff0000 : 0x00ff00));
    last_pos.copy(next_pos);

    return parts;
}

function _createJoint(coords, d, color) {
    const joint_geometry = new THREE.SphereGeometry(d || 0.1, 10, 10);
    const joint_material = new THREE.MeshLambertMaterial( {color: color || 0x00ff00 });

    const mesh = new THREE.Mesh(joint_geometry, joint_material);
    mesh.position.set(coords.x, coords.y, coords.z);
    return mesh;
}

function _createLineGeometry(from, to) {
    const geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3(from.x, from.y, from.z));
    geometry.vertices.push(new THREE.Vector3(to.x, to.y, to.z));

    return geometry;
}
