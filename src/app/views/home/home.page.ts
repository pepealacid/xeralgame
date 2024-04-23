import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { Background } from 'src/app/classes/background';
import { Container } from 'src/app/classes/container';
import { BubbleScore } from 'src/app/classes/bubbleScore';
import { Player } from 'src/app/classes/player';
import { Fruit } from 'src/app/classes/fruit';
import { ActionSheetController, GestureController, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { OpeningModalComponent } from 'src/app/modals/opening-modal/opening-modal.modal';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef;
  @ViewChild('game-container', { static: true }) gameContainer!: HTMLElement;
  @ViewChild('leftDiv', { static: true }) leftDiv!: ElementRef;
  @ViewChild('rightDiv', { static: true }) rightDiv!: ElementRef;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private gestureCtrl: GestureController,
    private modalCtrl: ModalController
  ) {
    this.setEvents()
  }

  public score: number = 0;
  public width!: number;
  public height!: number;
  public canvas!: HTMLCanvasElement;
  public context!: any;
  public background: any;
  public container: any;
  public bubbleScore: any;
  public player: any;
  public interval: any;
  public FPS: number = 60;
  public engine: any;
  public render: any;
  public world: any;
  public currentBody: any;
  public currentFruit: any;
  public shouldPlay: boolean = true;
  public disableAction: boolean = false;
  public fruits: any[] = [];
  public bodyMovement: any[] = [];
  public framesCounter: number = 0;
  public shouldAddScore: boolean = true;
  public lastBodyA: any;
  public lastBodyB: any;
  public playingMusic: boolean = true;
  public delayedFruits: any[] = [];
  public radiusDictionary: any = {
    0: 20,
    1: 30,
    2: 50,
    3: 70,
    4: 90,
    5: 100,
    6: 120,
    7: 150,
  };
  public backgroundMusic: any;
  public isPlaying: boolean = false;

  public wallsAdded: boolean = false;
  private lastOnStart: number = 0;
  private DOUBLE_CLICK_THRESHOLD: number = 500;


  ngOnInit(): void {
    this.presentModal();
   
  }

  startGame(): void {
    this.isPlaying = false;
    this.setContext();
    this.setDimensions();
    this.start();
    this.drawAll();
    
    this.addFruit();}

  async presentModal(score: number | null = null): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: OpeningModalComponent,
      cssClass: 'opening-modal',
      componentProps: {
        score: score
      }
    });

    modal.onDidDismiss().then(()=>{
      this.startGame();
    
    })
    return await modal.present();
  }
  

  leftClick(){
    this.bodyMovement.push("ArrowLeft");
  }

  rightClick(){
    this.bodyMovement.push("ArrowRight");
  }

  clearMovement(){
    this.bodyMovement = [];
  }

  ngAfterViewInit(): void {
    // const gesture = this.gestureCtrl.create({
    //   el: this.myCanvas.nativeElement,
    //   threshold: 0,
    //   gestureName: 'double-click',
    //   onStart: () => {
    //     this.onStart();
    //   }
    // });
    // gesture.enable();

    const leftGesture = this.gestureCtrl.create({
      el: this.leftDiv.nativeElement,
      threshold: 0,
      gestureName: 'tap',
      onStart: () => {
        this.leftClick();
      },
      onEnd: () => {
        this.clearMovement();
      }
    });
    leftGesture.enable();

    const rightGesture = this.gestureCtrl.create({
      el: this.rightDiv.nativeElement,
      threshold: 0,
      gestureName: 'tap',
      onStart: () => {
        this.rightClick();
      },
      onEnd: () => {
        this.clearMovement();
      }
    });
    rightGesture.enable();
  }

  restartGame(): void {
    clearInterval(this.interval);
    this.setContext();
    this.setDimensions();
    this.start();
    this.drawAll();
    this.fruits = [];
    this.addFruit();
  }

  onStart(): void {
    const now = Date.now();
    if (Math.abs(now - this.lastOnStart) <= this.DOUBLE_CLICK_THRESHOLD) {
      console.log('DOUBLE CLICK')
      this.releaseFruit();
      this.lastOnStart = 0;
    } else {
    this.lastOnStart = now;
  }
}

  setContext(): void {
    this.canvas = this.myCanvas.nativeElement;
    this.context = this.canvas.getContext('2d');
    this.backgroundMusic = new Audio();
    this.backgroundMusic.src = '../../../assets/audio/background_music.mp3';
    this.backgroundMusic.load();
    this.engine = Engine.create();
    this.render = Render.create({
      engine: this.engine,
      element: this.gameContainer,
      options: {
        wireframes: false,
        width: window.innerWidth,
        height: window.innerHeight - 300,
      },
  });
  Runner.run(this.engine);
    this.world = this.engine.world;
  }

  setDimensions(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.setAttribute('width', `${this.width.toString()}px`);
    this.canvas.setAttribute('height', `${this.height.toString()}px`);
  }

  start(): void {
    this.reset();
    this.backgroundMusic.play();
    this.backgroundMusic.loop = true;
    this.interval = setInterval(() => {
      this.framesCounter++;
      if(this.framesCounter > 3000){
        this.framesCounter = 0;
      }
      this.drawAll();
      this.detectCollisions();
  }, 1000 / this.FPS);
}

  reset(): void {
    this.background = new Background(this.context, this.width, this.height, 0, 0);
    console.log(this.bodyMovement)
    this.player = new Player(this.context, window.innerWidth / 3, 150, this.width/2 - 25, window.innerHeight /5);
    this.container = new Container(this.context, this.width, this.height, 0, 0);
    this.bubbleScore = new BubbleScore(this.context);
  }

  drawAll(): void {
    this.background.draw();
    this.player.draw(this.framesCounter);
    this.player.drawLine();
    this.container.draw();
    this.bubbleScore.draw(this.framesCounter, this.score);
    // this.bubbleScore.setScore(this.score);
    this.player.movement(this.bodyMovement);
    this.bodyMovementFunc();
    this.fruits.forEach((fruitData) => {
      const { body, fruit } = fruitData;


      fruit.rotate(body.angle)
      fruit.setPosition(body.position.x - body.circleRadius, body.position.y - body.circleRadius);
      fruit.draw();
      
      // fruit.movement();
    })


      // PINTAR BORDES DEL MUNDO
  
  //        this.context.fillStyle = 'rgba(128, 128, 128, 0.6)'; 
  
  //     const bodies = this.world.bodies; 
  
  //     bodies.forEach((body: any) => {

  
  //          const vertices = body.vertices; 
  
  //          this.context.beginPath();
  
  //          this.context.moveTo(vertices[0].x, vertices[0].y);
  
  //          for (let i = 1; i < vertices.length; i++) {
  
  //              this.context.lineTo(vertices[i].x, vertices[i].y);
  
  //        }
  
  //          this.context.closePath();
  
  //          this.context.fill();
        
  
  //  });

 
   }

  detectCollisions(): void {
    Events.on(this.engine, "collisionStart", (event: any) => {
      
      event.pairs.forEach((collision: any) => {
       
        if (collision.bodyA.label === collision.bodyB.label && collision.bodyA.label !== "7") {
          const bodyAId = collision.bodyA.id;
          const bodyBId = collision.bodyB.id;
          if(this.lastBodyA !== collision.bodyA && this.lastBodyB !== collision.bodyB){
            if(this.playingMusic){
              const audio = new Audio();
              audio.src= '../../../assets/audio/blub.mp3';
              audio.load();
              audio.play();
            }
            this.score += Number(collision.bodyA.label)+1;
            this.bubbleScore.animate();
          }
          this.lastBodyA = collision.bodyA;
          this.lastBodyB = collision.bodyB;
  
          const matchingFruitIndexA = this.fruits.findIndex(
            (fruitData) => fruitData.body.id === bodyAId
          );
  
          const matchingFruitIndexB = this.fruits.findIndex(
            (fruitData) => fruitData.body.id === bodyBId
          );

          if(matchingFruitIndexA !== -1 && matchingFruitIndexB !== -1){
            if(matchingFruitIndexA > matchingFruitIndexB){
              const { body: bodyA, fruit: fruitA } = this.fruits[matchingFruitIndexA];
              const { body: bodyB, fruit: fruitB } = this.fruits[matchingFruitIndexB];
          World.remove(this.world, [bodyA, bodyB]);
           this.fruits.splice(matchingFruitIndexA, 1);
           this.fruits.splice(matchingFruitIndexB, 1);
             
           console.log(bodyA.position.x - bodyA.circleRadius)
           const newFruit = new Fruit(this.context, bodyA.position.x-bodyA.circleRadius, bodyA.position.y, Number(bodyA.label) + 1);
           console.log(newFruit.posX)
           const newBody = Bodies.circle(
             newFruit.posX,
             newFruit.posY,
             this.radiusDictionary[Number(bodyA.label) + 1],
             {
               label: (Number(bodyA.label) + 1).toString(),
               isSleeping: false,
               restitution: 0.3,
               friction: 1,
               frictionAir: 0.01,
               isStatic: false,
             }
           );
           this.fruits.push({ body: newBody, fruit: newFruit });
            World.add(this.world, [newBody]);

        } else {
          const { body: bodyA, fruit: fruitA } = this.fruits[matchingFruitIndexA];
          const { body: bodyB, fruit: fruitB } = this.fruits[matchingFruitIndexB];
          World.remove(this.world, [bodyB, bodyA]);
           this.fruits.splice(matchingFruitIndexB, 1);
           this.fruits.splice(matchingFruitIndexA, 1);

           
           const newFruit = new Fruit(this.context, bodyA.position.x-bodyA.circleRadius, bodyA.position.y, Number(bodyA.label) + 1);
           console.log(bodyA.position.x - bodyA.circleRadius)
          console.log(newFruit.posX)
          const newBody = Bodies.circle(
            newFruit.posX,
            newFruit.posY,
            this.radiusDictionary[Number(bodyA.label) + 1], 
            {
              label: (Number(bodyA.label) + 1).toString(),
              isSleeping: false,
              restitution: 0.3,
              friction: 1,
              frictionAir: 0.01,
              isStatic: false,
            }
          );
           this.fruits.push({ body: newBody, fruit: newFruit });
          World.add(this.world, [newBody]);
        }
        }
    } else if(collision.bodyA.label === collision.bodyB.label && collision.bodyA.label === '7'){
      console.log('DOS MELONES')
      const bodyAId = collision.bodyA.id;
      const bodyBId = collision.bodyB.id;

      const matchingFruitIndexA = this.fruits.findIndex(
        (fruitData) => fruitData.body.id === bodyAId
      );

      const matchingFruitIndexB = this.fruits.findIndex(
        (fruitData) => fruitData.body.id === bodyBId
      );


      if(matchingFruitIndexA !== -1 && matchingFruitIndexB !== -1){
        if(matchingFruitIndexA > matchingFruitIndexB){
          const { body: bodyA, fruit: fruitA } = this.fruits[matchingFruitIndexA];
          const { body: bodyB, fruit: fruitB } = this.fruits[matchingFruitIndexB];
          console.log(fruitA, fruitB)
      World.remove(this.world, [bodyA, bodyB]);
       this.fruits.splice(matchingFruitIndexA, 1);
       this.fruits.splice(matchingFruitIndexB, 1);}
      else{
        const { body: bodyA, fruit: fruitA } = this.fruits[matchingFruitIndexA];
        const { body: bodyB, fruit: fruitB } = this.fruits[matchingFruitIndexB];
        console.log(fruitA, fruitB)

        World.remove(this.world, [bodyB, bodyA]);
         this.fruits.splice(matchingFruitIndexB, 1);
         this.fruits.splice(matchingFruitIndexA, 1);
      }
      }
    }
  });
    });
  }
  
  

  bodyMovementFunc(): void {
    if (this.currentBody?.isSleeping) {
    // Suponiendo que 'body' es tu objeto Matter.js Body

// Inicializamos el mínimo y el máximo con los valores del primer vértice
let minX = this.currentBody?.vertices[0]?.x;
let maxX = this.currentBody?.vertices[0]?.x;

// Iteramos sobre los vértices para encontrar los extremos en el eje X
for (let i = 1; i < this.currentBody?.vertices?.length; i++) {
    const vertex = this.currentBody?.vertices[i];
    if (vertex.x < minX) {
        minX = vertex.x;
    } else if (vertex.x > maxX) {
        maxX = vertex.x;
    }
}

// Calculamos el ancho como la diferencia entre el máximo y el mínimo
const width = maxX - minX;
    if(this.bodyMovement.includes("ArrowRight") && this.currentBody.position.x - this.currentBody.circleRadius*2 < window.innerWidth - width - this.currentBody.circleRadius) {
      Body.setPosition(this.currentBody, {x: this.currentBody.position.x + 3, y: this.currentBody.position.y});
    } else if (this.bodyMovement.includes("ArrowLeft") && this.currentBody.position.x > this.currentBody.circleRadius + 70) {
      Body.setPosition(this.currentBody, {x: this.currentBody.position.x - 3, y: this.currentBody.position.y});
    }
  }
  }

  clear(): void {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  addFruit(): void {
    const index = Math.floor(Math.random() * 2);
    //const index = 6;
    let radius;
  switch (index) {
    case 0:
      radius = 20;
      break;
    case 1:
      radius = 30;
      break;
    case 2:
      radius = 50;
      break;
    default:
      radius = 20;
      break;
  }
    const body = Bodies.circle(this.player.posX, this.player.posY + 40, radius , {
      label: index.toString(),
      isSleeping: true,
      restitution: 0.3,
      friction: 1,
      frictionAir: 0.01,
      isStatic: false,
    }
    );
    const fruit = new Fruit(this.context, this.player.posX - radius, this.player.posY + 40 - radius, index);

    fruit.setPosition(this.player.posX - radius, this.player.posY-radius);

    

    this.currentBody = body;
    this.currentFruit = fruit;

    this.fruits.push({body, fruit});
    // Engine.run(this.engine); 
    const ground = Bodies.rectangle(0, window.innerHeight - window.innerHeight/6, window.innerWidth + 1000 , 50, {
      isStatic: true,
    });
    // const topWall = Bodies.rectangle(0, window.innerHeight - window.innerHeight/1.51, window.innerWidth + 1000 , 50, {
    //   isStatic: true,
    // });
    const leftWall = Bodies.rectangle(0, window.innerHeight-250, window.innerHeight/8, this.height, { isStatic: true });
    const rightWall = Bodies.rectangle(window.innerWidth - 8, window.innerHeight-250, window.innerHeight/8, this.height, { isStatic: true });
    World.add(this.world, [this.currentBody, ground, leftWall, rightWall]);
    
  }

  releaseFruit(): void {
    if(this.shouldPlay){
      this.shouldPlay = false;
    }
   if (!this.disableAction){
    this.currentBody.isSleeping = false;
    this.disableAction = true;

    if(this.playingMusic){
      const audio = new Audio();
      audio.src = '../../../assets/audio/cae.mp3'
      audio.load();
      audio.play();
    }
    setTimeout(() => {
      this.addFruit();
      this.disableAction = false;
      this.shouldPlay = true;
   }, 1000);
  }
}

  setEvents(): void {
    document.addEventListener("keydown", (event) => {
      const { code } = event;
      if (code === "Space") {
        this.releaseFruit();
      } else if (code === "ArrowRight" && !this.bodyMovement.includes("ArrowRight")){
        this.bodyMovement.push("ArrowRight");
      } else if (code === "ArrowLeft" && !this.bodyMovement.includes("ArrowLeft")){
        this.bodyMovement.push("ArrowLeft");
      }
      else{
        return; // Explicitly return void
      }
    });

document.addEventListener("keyup", (event) => {
  const { code } = event;
  if (code === "ArrowLeft" || code === "ArrowRight") {
    this.bodyMovement = [];
  } else {
    return; // Explicitly return void
  }
});
  }

  generateUniqueId(): number {
    return Math.floor(Math.random() * 1000000); // Puedes ajustar esto según tus necesidades específicas
  }

async handleMusic(): Promise<void> {
  this.playingMusic = !this.playingMusic;
  if(this.playingMusic){
    this.backgroundMusic.play();
  } else {
    this.backgroundMusic.pause();
  }
}


}
