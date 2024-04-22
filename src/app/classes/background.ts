
export class Background {
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private posX: number;
    private posY: number;
    private image: HTMLImageElement;
  
    constructor(ctx: CanvasRenderingContext2D, width: number, height: number, posX: number, posY: number) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.posX = posX;
      this.posY = posY;
      this.image = new Image();
      this.image.src = '../../assets/img/background.png';
    }
  
    draw(): void {
      this.ctx.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
  }
  
  // Export the class for use in other files
  