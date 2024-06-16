
class RunGame {

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private character: Character;
  private structureArr: Array<Structure> = [];
  
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
    this.character = new Character("red", 30, 30, 40, 40);

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
      
      if (this.structureArr.length === 0) {
        this.structureArr.push(new Structure("green", 200, 0, 10, 50));
      }

      this.structureArr[0].move();
      this.structureArr[0].draw(this.context);
      
      if (this.structureArr[0].isScreenover()) {
        this.structureArr.pop();
      }
      
      this.character.move(this.keyValue, this.canvas.width, this.canvas.height);
      this.character.draw(this.context);

      this.gameLoop();
    }, 100)
  }

  private handleKeydown(event: KeyboardEvent): void {
    const key = event.key;

    const keyMap: { [key: string] : string } = {
      'ArrowUp' : 'U',
      'ArrowDown' : 'D',
      'ArrowLeft' : 'L',
      'ArrowRight': 'R'
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

class Structure {

  private color: string;
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  //맵 그리기 

  constructor(color: string, x:number, y:number, width: number, height: number) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.color;
    context.fillRect(this.x,this.y,this.width,this.height);
  }

  public move(): void {
    const speed = 4;
    if(this.x === 0) {
      this.width -= speed;
      return
    } 
    this.x = this.x - speed;

  }

  public isScreenover(): boolean {

    return this.x <= 0 && this.width <= 0;
  }

}

function startGame() {
  const runGame = new RunGame('game', 200, 200);
  runGame.start();
}
