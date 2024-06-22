
class RunGame {

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private character: Character;
  private keyValue: string = '';

  constructor(canvasId: string, width: number, height: number) {
    this.canvas = document.createElement("canvas");
    this.canvas.id = canvasId;
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);

    const context = this.canvas.getContext('2d');
    //canvas 지원 브라우저 확인
    if (!context) {
      throw new Error('Failed to get 2D context');
    }

    this.context = context;
    this.character = new Character("red", 30, this.canvas.height - 40, 40, 40);

    window.addEventListener('keydown', this.handleKeydown.bind(this));

  }

  public clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public start(): void {
    this.gameLoop();
  }

  private gameLoop(): void {
    setTimeout(()=>{
      this.clear();

      this.character.move(this.keyValue, this.canvas.width, this.canvas.height);
      this.character.draw(this.context);

      this.gameLoop();
    }, 100)
  }

  private handleKeydown(event: KeyboardEvent): void {
    const key = event.key;

    console.log('key : ', key + '0');

    const keyMap: { [key: string] : string } = {
      'ArrowUp' : 'U',
      'ArrowDown' : 'D',
      'ArrowLeft' : 'L',
      'ArrowRight': 'R',
      ' ': 'space'
    }

    this.keyValue = keyMap[key];

  }

}

class Character {

  private color: string;
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  constructor(color: string, x: number, y: number, width: number, height: number) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  public move(keyValue: string, canvasWidth: number, canvasHeight: number): void {
    const speed = 2;

    if (keyValue === 'L' && this.x > 0) {
      this.x -= speed;
    } else if (keyValue === 'R' && this.x < canvasWidth - this.width) {
      this.x += speed;
    } else if (keyValue === 'U' && this.y > 0) {
      this.y -= speed;
    } else if (keyValue === 'D' && this.y < canvasHeight - this.height) {
      this.y += speed;
    }
  }

}

function startGame() {
  const runGame = new RunGame('game', 200, 200);
  runGame.start();
}
