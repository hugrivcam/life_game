//import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
export class cubito {
  id:number=0;
  x:number=0;//posicion x e y del cubito en la matriz
  y:number=0;
  private miBoard:cubito [][]=[];
  public color:string; //='RGB(0,0,0)';
  public enabled:boolean; //=false;
  constructor(id:number, x:number,y:number,enabled:boolean = false,color:string='RGB(0,0,0)') {
    this.id = id;
    //this.miBoard = board;
    //console.log("constructor cubito:",  board.length);
    this.x = x;
    this.y = y;
    this.enabled = enabled;
    this.color = color;
  }
  set refBoard(board:cubito[][]){
    this.miBoard = board;
  }
  get totalVecinos():number{
    let x,y;
    let totalVecinos:number = 0;
    let xi = this.x-1;
    let yi = this.y-1;
    let xf = this.x+1;
    let yf = this.y+1;
    //return 0;
    //if (this.miBoard){
      try
      {
        if (xi<1) xi=1;
        if (xf>this.miBoard[0].length-2) xf = this.x; 
        if (yi<1) yi=1; 
        if (yf>this.miBoard.length-2) yf = this.y;
        //console.log(xi,xf,yi,yf);
        //console.log("vecinos1",this.miBoard.length);
        for (y=yi;y<=yf;y++){//check all neighbors
          for(x=xi;x<=xf;x++)
          {
            if(!(x===this.x && y===this.y)){//si no es la celda actual
              //console.log("x,y",x,y);
              if(this.miBoard[y][x].enabled) totalVecinos+=1;
            }
          }
        }
        //console.log("vecinos2");
        //if (totalVecinos>0)
        //  console.log("TotalVecinos:",totalVecinos);
        return totalVecinos;
      }
      catch(error)
      {
        if (error instanceof Error) {
          console.log("Se ha producido un error de tipo Error:", error.message, "posicion y,x: ",y, x);
        } else if (error instanceof TypeError) {
          console.log("Se ha producido un error de tipo TypeError:", error.message);
        } else {
          console.log("Se ha producido un error de otro tipo:", error);
        }
        return 0;
      }
    //}
    //else
    //{
    //  console.log("cubito no tiene referencia a su array padre");
    //  return 0;     
    //}
  }
}