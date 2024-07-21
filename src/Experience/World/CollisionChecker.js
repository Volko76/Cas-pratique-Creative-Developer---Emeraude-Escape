// src/Experience/World/CollisionChecker.js

import * as THREE from 'three';

export default class CollisionChecker {
    constructor(options) {
        this.event = options.event;
        this.parameter = options.parameter;
        this.player = options.player;
        this.spawner = options.spawner;

        this.playerBoundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.initPlayerBoundingBox();

        console.log(this.spawner.corn.badItems);
    }

    initPlayerBoundingBox() {
        this.playerBoundingBox.setFromObject(this.player.player);
        console.log(this.playerBoundingBox);
    }

    checkCollision() {
        this.updatePlayerBoundingBox();
        this.checkBadItemsCollision();
        this.checkGoodItemsCollision();
    }

    updatePlayerBoundingBox() {
        this.playerBoundingBox.copy(this.player.playerGeometry.boundingBox).applyMatrix4(this.player.player.matrixWorld);
        this.playerBoundingBox.min.y = this.playerBoundingBox.max.y - 0.1
    }

    checkBadItemsCollision() {
        this.spawner.corn.badItems.forEach((item) => {
            if (this.isCollision(item)) {
                console.log('touched bad');
                this.addPoint({ name: 'bad' });
                this.player.scene.remove(item)
            }
        });
    }

    checkGoodItemsCollision() {
        this.spawner.corn.goodItems.forEach((item) => {
            if (this.isCollision(item)) {
                console.log('touched good');
                this.addPoint({ name: 'good' });
                console.log(item)
                this.player.scene.remove(item)
            }
        });
    }

    isCollision(item) {
        return this.playerBoundingBox.intersectsBox(new THREE.Box3().setFromObject(item));
    }

    addPoint(item) {
        if (item.name === 'good') {
            this.parameter.score += 1;
        } else if (item.name === 'bad') {
            if (this.parameter.score > 0) {
                this.parameter.score -= 1;
            }
            this.parameter.multiplier = 1;
        } else {
            this.parameter.score += 5 * this.parameter.multiplier;
            this.parameter.multiplier += 1;
        }
        this.event.updateScoreIndicator();
    }

    update() {
        this.checkCollision();
    }
}
