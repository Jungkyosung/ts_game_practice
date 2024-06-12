
class RunGame {

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

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
  } 

  clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawRect(x: number, y: number, w: number, h: number, color: string): void {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, w, h);
  }
}

class Character {

  private color: string;
  private x: number;
  private y: number;

  constructor(color: string, x: number, y: number) {
    this.color = color;
    this.x = x;
    this.y = y;
  }
}

let keyValue = '';

function exe(g: RunGame, x: number, y: number) {
  setTimeout(()=>{
    g.clear();
    g.drawRect(x, y, 40, 40, "red")
    
    if (x === (200 - 40) || x === 0) {
      x = x;
    } else if (keyValue === 'L') {
      x -= 1;
    } else if (keyValue === 'R') {
      x += 1;
    }

    if (y === (200 - 40) || y === 0) {
      y = y;
    } else if (keyValue === 'U') {
      y -= 1;
    } else if (keyValue === 'D') {
      y += 1;
    }


    exe(g, x, y);
  }, 100)
}

window.addEventListener('keydown', handleKeydown);

function handleKeydown(event: KeyboardEvent) {
  let key = event.key;
  console.log(key);
  if (isUp(key)) {
    keyValue = 'U'
  } else if (isDown(key)) {
    keyValue = 'D'
  } else if (isLeft(key)) {
    keyValue = 'L'
  } else if (isRight(key)) {
    keyValue = 'R'
  }
}


function isUp(key: string) {
  return key === 'ArrowUp'
}
function isDown(key: string) {
  return key === 'ArrowDown'
}
function isLeft(key: string) {
  return key === 'ArrowLeft'
}
function isRight(key: string) {
  return key === 'ArrowRight'
}

function startGame() {
  const runGame = new RunGame('game', 200, 200);

  let x: number;
  let y: number;
  x = 30;
  y = 30;

  exe(runGame, x, y);
}
