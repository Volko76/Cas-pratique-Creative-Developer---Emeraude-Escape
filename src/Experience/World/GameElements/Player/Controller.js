import * as THREE from "three";

class Controller {
  constructor({ player, scene, camera }) {
    this.player = player;
    this.scene = scene;
    this.camera = camera;

    const touchActionsDiv = document.getElementById('touch-actions');

    touchActionsDiv.addEventListener('pointerdown', this.handlePointerDown);
    touchActionsDiv.addEventListener('pointermove', this.handlePointerMove);
    touchActionsDiv.addEventListener('pointerup', this.handlePointerUp);
    touchActionsDiv.addEventListener('pointercancel', this.handlePointerCancel);
  }

  handlePointerDown = (e) => {
    const dot = this.createDot(e);
    dot.id = e.pointerId;
    document.body.append(dot);
  }

  handlePointerMove = (e) => {
    const dot = document.getElementById(e.pointerId);
    if (!dot) return;
    this.positionDot(e, dot);
    this.movePlayer(e, this.player);
  }

  handlePointerUp = (e) => {
    const dot = document.getElementById(e.pointerId);
    if (!dot) return;
    dot.remove();
  }

  handlePointerCancel = (e) => {
    const dot = document.getElementById(e.pointerId);
    if (!dot) return;
    dot.remove();
  }

  createDot(e) {
    const dot = document.createElement('div');
    dot.classList.add("dot");
    if (e.isPrimary) dot.classList.add("primary");
    return dot;
  }

  positionDot(e, dot) {
    dot.style.width = `${e.width || 10}px`;
    dot.style.height = `${e.height || 10}px`;
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
  }

  movePlayer(e, player) {
    const movementX = e.movementX;
    player.moveHorizontal(movementX / 100);
  }
}

export default Controller;
