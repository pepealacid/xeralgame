import { environment } from "src/environments/environment";

export class Fruit {
        private ctx: CanvasRenderingContext2D;
        private width: number = 0;
        private height: number = 0;
        public posX: number;
        public posY: number;
        private image: HTMLImageElement;
        private keyPressed: string[] = [];
        private velMOVE: number = 3;
        private angle: number = 0;
        private index: number;
  
  
      constructor(ctx: CanvasRenderingContext2D, posX: number, posY: number, index: number) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.image = new Image();
        this.index = index;

        switch (this.index) {
            case 0:
                this.width = 40;
                this.height = 40;
                break;
            case 1:
                this.width = 60;
                this.height = 60;
                break;
            case 2:
                this.width = 100;
                this.height = 100;
                break;
            case 3:
                this.width = 140;
                this.height = 140;
                break;
            case 4:
                this.width = 180;
                this.height = 180;
                break;
            case 5:
                this.width = 220;
                this.height = 220;
                break;
            case 6:
                this.width = 260;
                this.height = 260;
                break;
            case 7:
                this.width = 340;
                this.height = 340;
                break;
            default:
                break;
        }
        this.image.src = `../../assets/img/fruits/${environment.theme}/${this.index}_fruit.png`;
        this.setEvents();
      }
  
      draw(): void {
          this.ctx.save();
            this.ctx.translate(this.posX + this.width / 2, this.posY + this.height / 2);
            this.ctx.rotate(this.angle);
            this.ctx.drawImage(this.image, -this.width / 2 , -this.height / 2, this.width, this.height);
            this.ctx.restore();
          }

          rotate(angle: number): void {
            this.angle = angle;
          }
  
          // movement() {
              
          //       this.keyPressed.forEach((elm) => {
          //         if (elm.includes("ArrowRight") && this.posX < window.innerWidth - this.width) {
          //           this.posX += this.velMOVE;
          //         } else if (
          //           elm.includes("ArrowLeft") && this.posX > 200) {
          //           this.posX -= this.velMOVE;
          //         }
          //       });
          //   }
  
            setEvents(): void {
              document.addEventListener("keydown", (event) => {
                const { code } = event;
                if (code === "ArrowRight" && !this.keyPressed.includes("ArrowRight")) {
                  this.keyPressed.push("ArrowRight");
                } else if (code === "ArrowLeft" && !this.keyPressed.includes("ArrowLeft")) {
                  this.keyPressed.push("ArrowLeft");
                } else {
                  return; // Explicitly return void
                }
              });
            
              document.addEventListener("keyup", (event) => {
                const { code } = event;
                if (code === "ArrowLeft" || code === "ArrowRight") {
                  this.keyPressed = [];
                } else {
                  return; // Explicitly return void
                }
              });
            }

            setPosition(x: number, y: number): void {
              if(x > 70 && x < window.innerWidth - 70){
              this.posX = x;
            }
                this.posY = y;
            }
            
            }