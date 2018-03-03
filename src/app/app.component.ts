import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import * as $ from 'jquery';
import { element } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  private canvas: HTMLCanvasElement;
  private canvasUpdated = false;

  public ngOnInit(): void {
    this.initCanvas();
    this.startRendering();
  }

  private startRendering(): void {

    // Get the DOM element to attach to
    const container = document.getElementById('preview-canvas');

    // Set the scene size.
    const WIDTH = container.clientWidth;
    const HEIGHT = container.clientHeight;

    // Set some camera attributes.
    const VIEW_ANGLE = 45;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;


    // Create a WebGL renderer, camera
    // and a scene
    const renderer = new THREE.WebGLRenderer();
    const camera =
      new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
      );

    const scene = new THREE.Scene();

    // Add the camera to the scene.
    scene.add(camera);

    // create the sphere's material
    const texture = new THREE.Texture(this.canvas);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    // Create a new mesh with
    // sphere geometry - we will cover
    // the sphereMaterial next!
    const sphere = new THREE.Mesh(

      new THREE.BoxGeometry(
        1,
        1,
        1),

      material);

    // Move the Sphere back in Z so we
    // can see it.
    sphere.position.z = -5;

    // Finally, add the sphere to the scene.
    scene.add(sphere);

    // create a point light
    const pointLight =
      new THREE.PointLight(0xFFFFFF);

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 30;

    // add to the scene
    scene.add(pointLight);

    // Start the renderer.
    renderer.setSize(WIDTH, HEIGHT);

    renderer.render(scene, camera);

    const update = () => {
      // Draw!
      renderer.render(scene, camera);

      sphere.rotateX(0.01);
      sphere.rotateY(0.01);

      texture.needsUpdate = this.canvasUpdated;
      this.canvasUpdated = false;

      // Schedule the next frame.
      requestAnimationFrame(update);
    }

    // Schedule the first frame.
    requestAnimationFrame(update);

    $(container).empty();
    // Attach the renderer-supplied
    // DOM element.
    container.appendChild(renderer.domElement);
  }

  private initCanvas() {
    this.canvas = <HTMLCanvasElement>document.getElementById('target-position-selector');
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
    if (coords) {
      context.beginPath();
      context.fillStyle = '#f00';
      context.arc(coords.x, coords.y, 5, 0, Math.PI * 2, false);
      context.fill();
    }
    this.canvasUpdated = true;
  }

  public coordinateSelected(event): void {
    const x = event.layerX - event.target.offsetLeft;
    const y = event.layerY - event.target.offsetTop;
    this.renderCanvas({x: x, y: y});
  }
}
