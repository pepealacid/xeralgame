
export class BubbleScore {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private posX: number;
  private posY: number;
  private image: HTMLImageElement;
  private initialY: number;
  private amplitude: number = 20;
  private frequency: number = 0.02;
  private bubbleScale: number = 1;
  private textColor: string = 'black';
  private textSize: string = 'bold 60px Arial';

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.width = 220;
    this.height = 220;
    this.posX = 40;
    this.posY = 30;
    this.initialY = this.posY;
    this.image = new Image();
    this.image.src = '../../assets/img/bubble.png';
  }

  draw(framesCounter: any, score: number): void {
    this.posY = this.initialY + Math.sin(framesCounter * this.frequency) * this.amplitude;
    this.ctx.drawImage(this.image, this.posX, this.posY, this.width * this.bubbleScale, this.height * this.bubbleScale);

    this.ctx.fillStyle = this.textColor;
    this.ctx.font = this.textSize;

    const textX = this.posX + this.width / 2;
    const textY = this.posY + this.height / 2 ;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(`${score}`, textX, textY);
  }

  animate(){
    const startTime = Date.now();
    const duration = 1000;

    const animateBubble = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = elapsedTime / duration;

      if (progress < 1) {
        this.bubbleScale = 1 + progress * 0.1;
        requestAnimationFrame(animateBubble);
      } else if (elapsedTime < duration + 1000) {
        const additionalTime = elapsedTime - duration;
        this.bubbleScale = 1.1 - additionalTime / 1000 * 0.1;
        requestAnimationFrame(animateBubble);
      }
    };

    const animateText = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = elapsedTime / duration;

      if (progress < 1) {
        this.textColor = "red";
        this.textSize = `bold ${60 + 40 * progress}px Arial`;
        requestAnimationFrame(animateText);
      } else if (elapsedTime < duration + 1000) {
        const additionalTime = elapsedTime - duration;
        this.textColor = "red";
        this.textSize = `bold ${100 - 40 * additionalTime / 1000}px Arial`;
        requestAnimationFrame(animateText);
      } else {
        this.textColor = "black";
        this.textSize = "bold 60px Arial";
      }
    };

    animateBubble();
    animateText();
  }
}

// Export the class for use in other files
