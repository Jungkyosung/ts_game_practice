
class RunGame {

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private character: Character;
  private structureArr: Array<Structure> = [];
  private backGround: BackGround;
  private isJump: boolean = false;
  private gravity: number = -1;
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
    this.backGround = new BackGround("./static/back1.jpg", this.context, 0, 0, 400, 200, 0, 0, 400, 200)

    window.addEventListener('keydown', this.handleKeydown.bind(this));

  }

  public clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public start(): void {
    this.gameLoop();
  }

  public isOverlap () : Boolean {
    let overlap:Boolean = false;
    
    const c = this.character.location;
    const cLeft = c.x;
    const cRight = c.x + c.width;
    const cTop = c.y;
    const cBottom = c.y + c.height;
    
    const sArr : Array<Structure> = this.structureArr;

    sArr.forEach(element => {
      const s = element.location;
      const sLeft = s.x;
      const sRight = s.x + s.width;
      const sTop = s.y;
      const sBottom = s.y + s.height;

      overlap = 
        (
          // 가로 충돌
          sLeft <= cRight &&
          sRight >= cLeft &&
          // 세로 충돌
          sTop <= cBottom &&
          sBottom >= cTop
        );

      if (overlap) {
        console.log('충돌 >>', overlap);
        return;
      }
    });

    return overlap;
  }

  private gameLoop(): void {
    setTimeout(()=>{
      this.clear();
      
      this.backGround.draw(this.context);
      this.backGround.move();

      if (this.structureArr.length === 0) {
        this.structureArr.push(new Structure("green", 400, 0, 10, 50));
      }

      this.structureArr[0].move();
      this.structureArr[0].draw(this.context);
      
      if (this.structureArr[0].isScreenover()) {
        this.structureArr.pop();
      }
      
      if (this.keyValue === 'J') {
        this.isJump = true;
      }

      if (this.isJump) {
        this.gravity = ((this.gravity * 100) + (0.1 * 100)) / 100;
        this.character.move('J', this.canvas.width, this.canvas.height, this.gravity);
        this.character.draw(this.context);
        console.log('this.gravity:', this.gravity)
      } else {
        this.character.move(this.keyValue, this.canvas.width, this.canvas.height, this.gravity);
        this.character.draw(this.context);
      }

      if (this.gravity >= 1) {
        this.isJump = false;
        this.gravity = -1;
        this.keyValue = ''
      }

      if (this.isOverlap()) { // 죽음
        return;
      }

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
      ' ': 'J'
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

  public move(keyValue: string, canvasWidth: number, canvasHeight: number, gravity: number): void {
    const speed = 2;

    if (keyValue === 'L' && this.x > 0) {
      this.x -= speed;
    } else if (keyValue === 'R' && this.x < canvasWidth - this.width) {
      this.x += speed;
    } else if (keyValue === 'U' && this.y > 0) {
      this.y -= speed;
    } else if (keyValue === 'D' && this.y < canvasHeight - this.height) {
      this.y += speed;
    } else if (keyValue === 'J') {
      this.y = (gravity * gravity) * (canvasHeight - this.height);  //
    }
  }

  public get location() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
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

  public get location() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

class BackGround {

  private img = new Image();
  private context: CanvasRenderingContext2D; 
  private dx: number;
  private dy: number;
  private dWidth: number;
  private dHeight: number;
  private sx: number;
  private sy: number;
  private sWidth: number;
  private sHeight: number; 

  constructor(
    src: string, 
    context: CanvasRenderingContext2D,
    dx: number, 
    dy: number,
    dWidth: number,
    dHeight: number,
    sx: number,
    sy: number,
    sWidth: number,
    sHeight: number
  ) {
    this.img.src = src;
    this.context = context;
    this.dx = dx;
    this.dy = dy;
    this.dWidth = dWidth;
    this.dHeight = dHeight;
    this.sx = sx;
    this.sy = sy;
    this.sWidth = sWidth;
    this.sHeight = sHeight;
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.img, this.sx, this.sy, this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight);
  }


  public move() {
    this.sx++;
  }



}

function startGame() {
  const runGame = new RunGame('game', 400, 200);
  runGame.start();
}
