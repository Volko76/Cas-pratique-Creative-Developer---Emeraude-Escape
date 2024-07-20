import * as THREE from "three";

function positionDot(e, dot) {
  dot.style.width = `${e.width || 10}px`;
  dot.style.height = `${e.height || 10}px`;
  dot.style.left = `${e.clientX}px`;
  dot.style.top = `${e.clientY}px`;
}

function movePlayer(e, camera, scene, player) {
  // Get touch coordinates
  const touchX = e.clientX;
  const touchY = e.clientY;

  // Get canvas bounding rectangle
  const canvas = document.getElementById('canvas');
  const rect = canvas.getBoundingClientRect();

  // Convert touch coordinates to normalized device coordinates
  const x = ((touchX - rect.left) / rect.width) * 2 - 1;
  const y = -((touchY - rect.top) / rect.height) * 2 + 1;

  // Create a raycaster
  const raycaster = new THREE.Raycaster();

  // Set raycaster origin and direction
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

  // Intersect with scene
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Move object to intersection point
  if (intersects.length > 0) {
    player.position.copy(intersects[0].point);
  }

  // Move player horizontally
  player.moveHorizontal(touchX / 100);
}

export default class Controller {
  constructor(_options) {
    this.player = _options.player;
    this.scene = _options.scene;
    this.camera = _options.camera;

    console.log(this.camera);
    console.log(this.scene);
    console.log(this.player);

    // Find the canvas to add touch events to it
    const touchActionsDiv = document.getElementById('touch-actions');

    // Creating red dots where we touch
    touchActionsDiv.addEventListener('pointerdown', e => {
      console.log(e);
      const dot = document.createElement('div');
      dot.classList.add("dot");
      if (e.isPrimary) dot.classList.add("primary");
      dot.id = e.pointerId;
      positionDot(e, dot);
      document.body.append(dot);
    });

    // Move those red dots where we move
    touchActionsDiv.addEventListener('pointermove', e => {
      const dot = document.getElementById(e.pointerId);
      if (dot == null) return;
      positionDot(e, dot);
      movePlayer(e, this.camera, this.scene, this.player);
    });

    // Remove the current red dot when we stop touching
    touchActionsDiv.addEventListener('pointerup', e => {
      const dot = document.getElementById(e.pointerId);
      if (dot == null) return;
      dot.remove();
    });

    // Same if canceled
    touchActionsDiv.addEventListener('pointercancel', e => {
      const dot = document.getElementById(e.pointerId);
      if (dot == null) return;
      dot.remove();
    });
  }
}
