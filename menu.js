const etapes_convexify = 50;

var graphics;
var main_poly;

var random_poly = [];
var random_poly_size = 40;
var timer = 0;

var relaxation_time = 300;

class menu extends Phaser.Scene{
    
    constructor ()
    {
        super("menu");
        this.pad = null;
    }
    
    preload ()
    {

    }
    
    create ()
    {
        timer++;

        graphics = this.add.graphics();

        //main_poly = [[200,200],[250,250],[300,200],[300,300],[200,300]];
        main_poly = [[100,100],[300,200],[500,100],[400,300],[500,500],[300,400],[100,500],[200,300],];

        for (let index = 0; index < random_poly_size; index++)
        {
            let theta = 2*Math.PI*index/random_poly_size;
            let radius = Math.floor(Math.random()*180);
            //random_poly.push([Math.round(Math.random()*config.width),Math.round(Math.random()*config.height)]);
            random_poly.push([config.width/2+(50+radius)*Math.cos(theta),config.height/2+(50+radius)*Math.sin(theta)]);
        }       

        //setTimeout(()=>{graphics.clear();draw_tabVertex(main_poly);},1000);
    }
    
    update ()
    {
        timer++;
        if(timer%(Math.round(60*relaxation_time/1000))==0){convexify(random_poly);}

        graphics.clear();
        //draw_tabVertex(main_poly);
        draw_tabVertex(random_poly);
    }
}

function draw_tabVertex (tab){
    let poly = new Phaser.Geom.Polygon();
    let tab_vertices = [];
    for (let i = tab.length-1; i >= 0; i--) {
        let x = tab[i][0];
        let y = tab[i][1];
        let point = new Phaser.Geom.Point(x,y);
        tab_vertices.push(point);     
        graphics.fillStyle(0xFF0000, 1);
        graphics.fillCircle(x,y,5).setDepth(2);
    }
    poly.setTo(tab_vertices);
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillPoints(poly.points, true).setDepth(1);
}

function convexify (tab){
    
    var tab_aux = [];
    tab_aux = JSON.parse(JSON.stringify(tab));
    for (let i = 0; i < tab_aux.length; i++) {
        let j = i+1<tab_aux.length?i+1:i+1-tab_aux.length;
        let k = i+2<tab_aux.length?i+2:i+2-tab_aux.length;
        let angle1 = Phaser.Math.Angle.Between(tab_aux[i][0],tab_aux[i][1],tab_aux[j][0],tab_aux[j][1]);
        let angle2 = Phaser.Math.Angle.Between(tab_aux[i][0],tab_aux[i][1],tab_aux[k][0],tab_aux[k][1]);
        let diff_angle = angle2-angle1<0?angle2-angle1+2*Math.PI:angle2-angle1;
        if (diff_angle > Math.PI)
        {
            for (let index = 1; index <= etapes_convexify; index++) {
                let alpha = index/etapes_convexify;
                alpha = xsin(alpha);
                setTimeout(()=>{
                    tab[j][0] = (1-alpha)*tab_aux[j][0]+alpha*(tab_aux[i][0]+tab_aux[k][0])/2;
                    tab[j][1] = (1-alpha)*tab_aux[j][1]+alpha*(tab_aux[i][1]+tab_aux[k][1])/2;
                },index/etapes_convexify*relaxation_time);
            }
        }        
    }
}

function xsin(x){return x+1.2*Math.sin(2*Math.PI*Math.pow(x,2))*Math.cos(2*Math.PI*x/4)}
/*
function xsin(xi){
    return Math.pow(xi,1/4)*(4+(Math.sin(2*2*Math.PI*xi))*Math.cos(2*Math.PI*xi/4))/4;
}*/