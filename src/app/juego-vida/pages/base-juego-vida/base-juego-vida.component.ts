//import { RegisterPageComponent } from './../../../auth/pages/register-page/register-page.component';
import { Component, OnInit } from '@angular/core';
import { cubito } from '../../class/cubito';
import { FormControl, FormGroup } from '@angular/forms';


/*function RGBtoNumber(r: number, g: number, b: number): number {
  // Asegúrate de que los valores estén dentro del rango válido (0-255)
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  // Combina los valores en un solo número utilizando la notación hexadecimal
  return (r << 16) | (g << 8) | b;
}*/

@Component({
  templateUrl: './base-juego-vida.component.html',
  styleUrls: ['./base-juego-vida.component.css'],
  selector: 'base-juego-vida',
})
export class BaseJuegoVidaComponent implements OnInit {
  canvas:HTMLCanvasElement | null=null;// = document.querySelector('canvas');
  context:CanvasRenderingContext2D | null=null;// = this.canvas?.getContext('2d');
  //----------------------------
  canLogic = true;
  canRender = true;
  //----------------------------
  pruebas:number= -2;   
  direccion:number=0.1;
  //----------------------------
  board:cubito [][] = []; //mi tableero sin icializar
  cloneBoard:cubito [][] = []; //mi tableero sin icializar
  juegoVidaIniciado:boolean = false;
  timeRefreshJuegoVida:number = 50;//5; //en milisegundos, velocidad del juego, cuanto menos más rapido
  numCelulas = 500;
  //inicioAncho:number = 250*2.5;
  //inicioAlto:number=150*2.5;
  BLOCK_SIZE:number = 4;
  TIPO_PRUEBA:number = 3;//indica el juego en pantalla, 3 es el de la vida, 2 es el arcoiris, 1 es una prueba cutre
  tableroAncho:number = Number((250).toFixed(0)); //height
  tableroAlto:number = 150;//nº de cubitos  width
  public control:string="";  
  //REACT FORM
  btActivarLabel:string ="Pausar";
  btColorText:string = "RGB(255,0,0)";
  
  public vidaForm = new FormGroup({
    refreshRate:      new FormControl<number>(50,{nonNullable:true}), //lo que va entre '' es el valor por defecto del campo, que podría ser 0 o un texto cualquiera
    numCelulas:       new FormControl<number>(250,{nonNullable:true}), //no nulo hay que acordarse de todoooooooo, locura
    boardWidth:       new FormControl<number>(250,{nonNullable:true}),
    boardHeight:      new FormControl<number>(150,{nonNullable:true}),
    blockSize:        new FormControl<number>(4,{nonNullable:true}),
  });

  
  public formOption = new FormGroup({
    opcionSeleccionada:       new FormControl<number>(3,{nonNullable:true})
  });

  //----------------------------
  constructor(){
    //console.log("Tablero inicializado.");
  }
  ngOnInit(): void {//no vale usar el contructor, ya que el constructor se ejecuta antes del html
    this.canvas = document.querySelector('canvas');//recuperamos el objeto que hay en el html
    if (this.canvas){
      this.context = this.canvas.getContext('2d');
      this.incializar_Tablero();
      this.incializar_Canvas();//inicializamos con un tablero en el que caben 50 cubitos
      
      if (this.TIPO_PRUEBA ===3)
        this.incializarJuegoVida(this.numCelulas);
      //console.log(this.board);
      this.frame_update();//frame update loop
    }
    else{
      console.error('Canvas not found');
      this.context = {} as CanvasRenderingContext2D;  //asignamos un objeto vacio 
    }        
  }

  private incializar_Tablero():void{
    //creo un array con new y lo vacio con fill, a continaución con map cambio el vacio por otro array que tambien
    //inicializo a vacio con fill, pero que con map sustituyo cada posición nula del array con el objeto cubito 
    //que voy creando con map
    //this.control = "inicializando tablero";
    let indice:number = 0
    //this.tableroAlto=alto;
    //this.tableroAncho=ancho;
    this.board = new Array(this.tableroAlto).fill(null).map
    (
      (_,indiceY) => new Array(this.tableroAncho).fill(null).map //cada fila le agrego un array vacio con fill null
      (
        (_,indiceX) => {
            //console.log("miBoard: ", this.board[0].length);
            return new cubito(indice +=1,indiceX,indiceY)
          }//asigno un indice unico a cada elemento
      )
    );
    //hasta que no se termina de crear el array no puedo pasarle la dirección del mismo a los cubitos

  }
  //clona el tablero para el juego de la vida, asi creamos el array clone una sola vez
  clonarTablero(){
    //cloneBoard:cubito [][] = [];
    this.control = "Clonando tablero";
    this.cloneBoard = this.board.map((fila) => fila.map((celula) => new cubito(celula.id,celula.x,celula.y,celula.enabled,celula.color)));
    this.cloneBoard.forEach((fila) => fila.forEach((celula) => celula.refBoard=this.cloneBoard));//agrego una sola vez a cada celula la referencia a su propio array, pero esto siempre tengo que hacerlo despues de crearlo
    //console.log("cloneBoard tam: ",this.cloneBoard.length);

  }
  //utilizando el array clonado copiamos sólo el contenido del tablero que nos interesa, ganamos en eficiencia
  copiarTablero(){
    //this.control = "Copiando tablero";
    for (let y = 0; y < this.board.length;y++){
      for(let x= 0; x < this.board[y].length;x++){
        this.cloneBoard[y][x].enabled = this.board[y][x].enabled;
      }
    }
    //console.log("tablero copiado: ",this.cloneBoard[10][10].color);
  }

  private incializar_Canvas(BOARD_ALTO:number=this.tableroAlto,BOARD_ANCHO:number= this.tableroAncho):void{
    this.control = "inicializando Canvas";
    this.canvas!.width = this.BLOCK_SIZE * BOARD_ANCHO;
    this.canvas!.height = this.BLOCK_SIZE * BOARD_ALTO;
    this.context!.scale(this.BLOCK_SIZE,this.BLOCK_SIZE);//CADA PIXEL VA A TENER EL TAMAÑO DE UN CUBITO block size
  }
  //game.loop();
  
  private frame_update(){
    if (this.canLogic)
      this.activarBoardPruebas(this.TIPO_PRUEBA);//logica del tablero
    if (this.canRender)
      this.draw(); //pinta el tablero
    window.requestAnimationFrame(this.frame_update.bind(this));//cuantos fps? , con bind me aseguro de usar la instancia actual del objeto
  }

  private draw(){
    this.context!.fillStyle = '#000';
    this.context?.fillRect(0,0,this.canvas!.width,this.canvas!.height);//fondo negro
    this.paintBoard();
  }
//----------------------------------------------------------------
  private paintBoard(){
    const fontSize =3;
    this.board.forEach((fila,y) => 
      fila.forEach((cubo,x)=>{          
        if (cubo.enabled) 
        {
          this.context!.fillStyle=cubo.color;
          this.context!.fillRect(x,y,1,1);//1 en este caso son 10 pixeles
        }
        if ((x===0 || y===0 || x==this.tableroAncho-1 || y == this.tableroAlto-1)) 
        {
          this.context!.fillStyle='black';
          this.context!.fillRect(x,y,1,1);//1 en este caso son 10 pixeles
        } 

        //this.context!.fillStyle ='white';
        //this.context!.fillText(cubo.x+","+cubo.y, x,y,);
      }
      )
    )
  }
  private activarBoardPruebas(tipo_prueba:number=1){
    const base = this.pruebas;
    if (tipo_prueba===0){
      //no hacer nada
    }
    if (tipo_prueba===1){ 
      this.board.forEach((fila,y) => {
        fila.forEach((cubo,x)=>{
          //if (Math.random()*10 >= (this.tableroAncho/3)){
          if (Math.random()*10 >= 9.9){          
            cubo.enabled=true;
            cubo.color = 'RGB('+getRandomNumber(120,255)+',200,'+getRandomNumber(1,255)+')' //RGBtoNumber(getRandomNumber(200,255),10,getRandomNumber(20,50));
          }
          else
          {
            cubo.enabled=false;
            cubo.color = 'RGB(0,0,0)';
          }
        })
      });
    }
    if (tipo_prueba===2){
      /*muy lento*/
      for (let y=0;y<this.board.length;y++){
        for (let x=0;x<this.board[0].length;x++){
          this.board[y][x].color = "RGB("+ (255-(x*2*base-y)) +"," + Math.abs(y*2*base-x) + "," + (255-(y*2*base-x)) +")";
          this.board[y][x].enabled = true;
        }          
      }
      /*this.board.forEach((fila,y) => {
        fila.forEach((cubo,x)=>{
          cubo.color = "RGB("+ (255-(x*2*base-y)) +"," + Math.abs(y*2*base-x) + "," + (255-(y*2*base-x)) +")";
          cubo.enabled = true;
        })
      });*/
      if (this.direccion > 0 && this.pruebas === 10)
        this.direccion = -0.1;
      if (this.direccion < 0 && this.pruebas === -7)
        this.direccion = 0.1;
      this.pruebas = Number((this.pruebas + this.direccion).toFixed(2));
      this.canLogic=false;
      setTimeout(() => {
        this.canLogic= true;
      }, this.timeRefreshJuegoVida);
    }
    if (tipo_prueba===3){
      this.logica_Juego_Vida();
      this.canLogic=false;//no voy a recalcular hasta que el algoritmo de tiempo se ejecute
      setTimeout(() => {
          this.canLogic= true;
      }, this.timeRefreshJuegoVida);      
    } 
  }
  //-------------------juego vida ----------------------------
  public pararJuegoVida(){
    this.juegoVidaIniciado=false;
  }
  public reanudarJuegoVida(){
    this.juegoVidaIniciado=true;
  }
  public incializarJuegoVida(numCelulasIniciales:number=10){
    const base:number = 1;//base del color
    let x:number=0,y:number=0;
    let offx:number=0,offy:number=0;
    let k:number;
    for (y = 1; y < this.tableroAlto;y++){ //aplico color a cada celda del tablero
      for (x = 1; x < this.tableroAncho;x++)
      {
        //console.log(x,y);
        this.board[y][x].enabled=false;
        this.board[y][x].color = "RGB("+ (255-(x*2*base-y)) +"," + Math.abs(y*2*base-x) + "," + (255-(y*2*base-x)) +")";
        this.board[y][x].refBoard=this.board;
      }
    }

    for (let i = 1; i<=numCelulasIniciales;i++){//añado las celulas al tablero
      x=getRandomNumber(2,this.tableroAncho-2) ;
      y=getRandomNumber(2,this.tableroAlto-2);
      //console.log("principal "+i+":" ,y,x);
      this.board[y][x].enabled=true;
      //creo 3 vecinos
      for(let j=1;j<=3;j++){
        offx=0;
        offy=0;
        k=0;
        while(this.board[y+offy][x+offx].enabled && k<10){//intentamos encontrar 3 vecinos que se puedan actrivar, si al intento 10 no se puede salimos del bucle
          offx = (getRandomNumber(-1,1));
          offy = (getRandomNumber(-1,1));
          k++;
        }
        this.board[y+offy][x+offx].enabled=true;
      }
    }
    this.clonarTablero();//creamos un array secundario que nos permitira copiar las propiedades del array sin tener que crearlo siempre de cero
    this.juegoVidaIniciado=true;
  }
  private logica_Juego_Vida(){
    if(!this.juegoVidaIniciado) return;
    let miCelula:cubito;
    this.copiarTablero(); //copio la propiedad enabled del tablero base al clonico, o lo que es lo mismo, copio la posicion de las celulas
    for (let y = 2; y < this.tableroAlto-2;y++){
      for (let x = 2; x < this.tableroAncho-2;x++)
      {

        miCelula=this.cloneBoard[y][x];
        if (!miCelula.enabled && miCelula.totalVecinos===3)
          this.board[y][x].enabled=true;
        else
        if(!(miCelula.enabled && (miCelula.totalVecinos===2 || miCelula.totalVecinos===3)))
            this.board[y][x].enabled=false;          
      }
    }
  }
  pararReanudar(){
    if (this.juegoVidaIniciado) {
      this.pararJuegoVida();
      this.btActivarLabel = "Reanudar"
      this.btColorText = "RGB(0,255,0)";
    }
    else
    {
      this.reanudarJuegoVida();
      this.btActivarLabel = "Pausar"
      this.btColorText = "RGB(255,0,0)";
    }
    
  }
  aplicarCambios(){
    this.timeRefreshJuegoVida = this.vidaForm.get("refreshRate")!.value;
    this.numCelulas = this.vidaForm.get("numCelulas")!.value;
    this.tableroAncho = this.vidaForm.get("boardWidth")!.value;
    this.tableroAlto = this.vidaForm.get("boardHeight")!.value;
    this.BLOCK_SIZE = this.vidaForm.get("blockSize")!.value;
    this.ReiniciarJuego();
  }

  ReiniciarJuego(){
    if (this.canvas){
      if (this.TIPO_PRUEBA ===3)
        this.pararJuegoVida();
      this.board=[];
      this.cloneBoard=[];

      this.incializar_Tablero();
      this.incializar_Canvas();//inicializamos con un tablero en el que caben 50 cubitos
      
      if (this.TIPO_PRUEBA ===3)        
        this.incializarJuegoVida(this.numCelulas);
        this.btActivarLabel = "Pausar"
        this.btColorText = "RGB(255,0,0)";  
      //this.frame_update();//frame update loop
    } 
    else{
      console.error('Canvas not found');
      this.context = {} as CanvasRenderingContext2D;  //asignamos un objeto vacio 
    }            
  }

  // refreshRate:      new FormControl<number>(10,{nonNullable:true}), //lo que va entre '' es el valor por defecto del campo, que podría ser 0 o un texto cualquiera
  // numCelulas:       new FormControl<number>(500,{nonNullable:true}), //no nulo hay que acordarse de todoooooooo, locura
  // boardWidth:       new FormControl<number>(500,{nonNullable:true}),
  // boardHeight:      new FormControl<number>(300,{nonNullable:true}),
  // blockSize:        new FormControl<number>(2,{nonNullable:true}),  
  public reset(){
    this.vidaForm.get("refreshRate")!.setValue(10);
    this.vidaForm.get("numCelulas")!.setValue(500);
    this.vidaForm.get("boardWidth")!.setValue(500);
    this.vidaForm.get("boardHeight")!.setValue(300);
    this.vidaForm.get("blockSize")!.setValue(2);
    this.aplicarCambios();
    this.ReiniciarJuego();
  }
  public onChangeGame(){
    this.TIPO_PRUEBA =  this.formOption.get("opcionSeleccionada")!.value;
    //console.log(this.TIPO_PRUEBA);
    this.vidaForm.get("boardWidth")!.setValue(150);
    this.vidaForm.get("boardHeight")!.setValue(100);
    this.vidaForm.get("blockSize")!.setValue(5);
    this.aplicarCambios();    
    this.ReiniciarJuego();
  } 
}

function getRandomNumber(min: number, max: number): number {
  //console.log("random:",x)
  return Number((Math.random() * (max - min) + min).toFixed(0));
}
