interface ExtendedHTMLImageElement extends HTMLImageElement {
    frames: number;
    framesIndex: number;
  }

export class Player {
  private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private posX: number;
    private posY: number;
    private image: ExtendedHTMLImageElement;
    private velMOVE: number = 3;


    constructor(ctx: CanvasRenderingContext2D, width: number, height: number, posX: number, posY: number) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.posX = posX;
      this.posY = posY;
      this.image = new Image() as ExtendedHTMLImageElement;
      this.image.src = '../../assets/img/playerfull2.png';
      this.image.frames = 6;
      this.image.framesIndex = 0;
      // this.setEvents();
    }

    draw(framesCounter: number): void {
      const spriteWidth = this.image.width / 3; // Ancho de cada sprite
      const spriteHeight = this.image.height / 2; // Alto de cada sprite
      const row = Math.floor(this.image.framesIndex / 3); // Calcular la fila actual del sprite
      const column = this.image.framesIndex % 3; // Calcular la columna actual del sprite
  
      this.ctx.drawImage(
        this.image, // Imagen completa del jugador
        spriteWidth * column, // Posición X del sprite dentro de la imagen completa
        spriteHeight * row, // Posición Y del sprite dentro de la imagen completa
        spriteWidth, // Ancho del sprite
        spriteHeight, // Alto del sprite
        this.posX, // Posición X donde se dibujará en el lienzo
        this.posY, // Posición Y donde se dibujará en el lienzo
        this.width, // Ancho del jugador en el lienzo
        this.height // Alto del jugador en el lienzo
      );
      this.animate(framesCounter); // Animar los cuadros del sprite
    }


        drawLine(): void {
          this.ctx.beginPath();
          this.ctx.strokeStyle = "white"; // Color de la línea
          this.ctx.lineWidth = 5; // Grosor de la línea
          this.ctx.moveTo(this.posX, this.posY); // Comienza desde la posición actual del jugador
          this.ctx.lineTo(this.posX, this.posY + 870); // Dibuja hacia abajo 100px
          this.ctx.stroke();
        }


        movement(keyPressed: string[]) {
            
              keyPressed.forEach((elm) => {
                if (elm.includes("ArrowRight") && this.posX < window.innerWidth - this.width + 130) {
                  this.posX += this.velMOVE;
                } else if (
                  elm.includes("ArrowLeft") && this.posX > 100) {
                  this.posX -= this.velMOVE;
                }
              });
          }

          // setEvents(): void {
          //   document.addEventListener("keydown", (event) => {
          //     const { code } = event;
          //     if (code === "ArrowRight" && !this.keyPressed.includes("ArrowRight")) {
          //       this.keyPressed.push("ArrowRight");
          //     } else if (code === "ArrowLeft" && !this.keyPressed.includes("ArrowLeft")) {
          //       this.keyPressed.push("ArrowLeft");
          //     } else {
          //       return; // Explicitly return void
          //     }
          //   });
          
          //   document.addEventListener("keyup", (event) => {
          //     const { code } = event;
          //     if (code === "ArrowLeft" || code === "ArrowRight") {
          //       this.keyPressed = [];
          //     } else {
          //       return; // Explicitly return void
          //     }
          //   });
          // }

          animate(framesCounter: number): void {
            if(framesCounter % 10 === 0) {
              this.image.framesIndex++;
              if(this.image.framesIndex >= this.image.frames) {
                this.image.framesIndex = 0;
              }
            }
          }
          
          }