import { Component, ViewChild, OnInit } from '@angular/core';
import { Bodies, Body, Engine, IBodyDefinition, IChamferableBodyDefinition, Render, Runner, World } from 'matter-js';
import { FRUITS_BASE, FRUITS_HLW } from '../../assets/img/fruits';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public THEME = 'halloween';
  public FRUITS = FRUITS_BASE;
  public shouldPlay: boolean = true;
  public score: number = 0;
  public moveLeft: boolean = false;
  public moveRight: boolean = false;
  public disableAction: boolean = false;
  public currentBody: any;
  public currentFruit: any;

  @ViewChild('gameContainer') gameContainer: any;
  @ViewChild('backgroundMusic') backgroundMusic: any;
  @ViewChild('blubSound') blubSound: any;
  @ViewChild('fall') fall: any;

  public engine: any;
  public world: any;

  switchTheme(THEME: string) {
    switch (THEME) {
      case 'halloween':
        this.FRUITS = FRUITS_HLW;
        break;
      default:
        this.FRUITS = FRUITS_BASE;
    }
  }

  ngOnInit() {
    this.setupMatterJS();
    this.addFruit();
    this.gameLoop();
  }

  setupMatterJS() {
    this.engine = Engine.create();
    this.world = this.engine.world;

    const render = Render.create({
      engine: this.engine,
      element: this.gameContainer,
      options: {
        wireframes: false,
        background: '#F7F4C8',
        width: 620,
        height: window.innerHeight - 50,
      },
    });

    const leftWall = Bodies.rectangle(15, 395, 30, 790, {
      isStatic: true,
      render: { fillStyle: "#E6B143" }
    });

    const rightWall = Bodies.rectangle(605, 395, 30, 790, {
      isStatic: true,
      render: { fillStyle: "#E6B143" }
    });

    const ground = Bodies.rectangle(310, 820, 620, 60, {
      name: "ground",
      isStatic: true,
      render: { fillStyle: "#E6B143" }
    } as IChamferableBodyDefinition);

    const topLine = Bodies.rectangle(310, 150, 620, 2, {
      name: "topLine",
      isStatic: true,
      isSensor: true,
      render: { fillStyle: "#E6B143" },
    } as IChamferableBodyDefinition);

    World.add(this.world, [leftWall, rightWall, ground, topLine]);
    Render.run(render);
    Runner.run(this.engine);
  }

  playBackgroundMusic() {
    this.backgroundMusic.play();
    document.removeEventListener('click', this.playBackgroundMusic);
  }

  startMoveLeft() {
    this.moveLeft = true;
  }

  stopMoveLeft() {
    this.moveLeft = false;
  }

  startMoveRight() {
    this.moveRight = true;
  }

  stopMoveRight() {
    this.moveRight = false;
  }

  releaseFruit() {
    if (this.shouldPlay) {
      this.shouldPlay = false;
    }
    if (!this.disableAction) {
      this.currentBody.isSleeping = false;
      this.disableAction = true;
      this.fall.play();

      setTimeout(() => {
        this.addFruit();
        this.disableAction = false;
      }, 1000);
    }
  }

  addFruit() {
    const index = Math.floor(Math.random() * 5);
    const fruit = this.FRUITS[index];

    const body = Bodies.circle(300, 50, fruit.radius, {
      index: index,
      isSleeping: true,
      render: {
        sprite: { texture: `${fruit.name}.png`, xScale: 0.5, yScale: 0.5 },
      },
      restitution: 0.2,
    } as IBodyDefinition);

    this.currentBody = body;
    this.currentFruit = fruit;

    World.add(this.world, body);
  }

  moveFruit() {
    if (this.moveLeft && this.currentBody.position.x - this.currentFruit.radius > 30) {
      Body.setPosition(this.currentBody, {
        x: this.currentBody.position.x - 4,
        y: this.currentBody.position.y,
      });
    }

    if (this.moveRight && this.currentBody.position.x + this.currentFruit.radius < 590) {
      Body.setPosition(this.currentBody, {
        x: this.currentBody.position.x + 4,
        y: this.currentBody.position.y,
      });
    }
  }

  music() {
    if (this.backgroundMusic.paused || this.backgroundMusic.ended) {
      this.backgroundMusic.play();
    } else {
      this.backgroundMusic.pause();
    }
  }

  gameLoop = () => {
    this.moveFruit();
    requestAnimationFrame(this.gameLoop);
  };
}
