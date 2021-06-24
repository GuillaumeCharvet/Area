const etapes_convexify = 10;

var graphics;
var main_poly;

var random_poly = [];
var random_poly_size = 50;

var random_poly2 = [];
var random_poly2_size = 40;

var random_poly3 = [];
var random_poly3_size = 40;

var random_poly4 = [];
var random_poly4_size = 40;

var timer = 0;

var radius_brush = 50;
var radius_brush2 = 40;
var radius_brush3 = 30;
var radius_brush4 = 20;
var brush_active = false;

var posX;
var posY;

var pointer0;

var relaxation_time = 100;

var hauteur = 1;

var bg;
var sponge;


class menu extends Phaser.Scene{
    
    constructor ()
    {
        super("menu");
        this.pad = null;
    }
    
    preload ()
    {
        this.load.image('bg','assets/images/bg.png');
        //this.load.image('sol','assets/images/sol.png');
        //this.load.image('sponge','assets/images/sponge.png');
    }
    
    create ()
    {
        graphics = this.add.graphics();
        bg = this.add.sprite(config.width/2,config.height/2,'bg').setScale(config.width,config.height).setInteractive().setTint(0x00F5DD);
        //bg = this.add.sprite(config.width/2,config.height/2,'sol').setScale(config.width/378,config.height/237).setInteractive();        
        //sponge = this.add.sprite(config.width/2,config.height/2,'sponge').setScale(1,1).setInteractive().setDepth(10);

        //main_poly = [[200,200],[250,250],[300,200],[300,300],[200,300]];
        main_poly = [[100,100],[300,200],[500,100],[400,300],[500,500],[300,400],[100,500],[200,300],];

        for (let index = 0; index < random_poly_size; index++)
        {
            let theta = 2*Math.PI*index/random_poly_size;
            let radius = Math.floor(Math.random()*180);
            //random_poly.push([Math.round(Math.random()*config.width),Math.round(Math.random()*config.height)]);
            random_poly.push([config.width/2+(50+radius)*Math.cos(theta),config.height/2+(50+radius)*Math.sin(theta)]);
            random_poly2.push([config.width/2+(40+radius/1.3)*Math.cos(theta),config.height/2+(40+radius/1.3)*Math.sin(theta)]);
            random_poly3.push([config.width/2+(30+radius/1.8)*Math.cos(theta),config.height/2+(30+radius/1.8)*Math.sin(theta)]);
            random_poly4.push([config.width/2+(20+radius/2.2)*Math.cos(theta),config.height/2+(20+radius/2.2)*Math.sin(theta)]);
        }

        bg.on('pointerdown', function (pointer) {
            brush_active = true;
            if(brush_active){posX=pointer.x;posY=pointer.y;}
            //console.log("brush_active",brush_active);
            //hauteur = 0.5;
        });
        bg.on('pointerup', function (pointer) {
            brush_active = false;
            //console.log("brush_active",brush_active);
            //hauteur = 1;
        });
        bg.on('pointermove', function (pointer) {
            if(brush_active){posX=pointer.x;posY=pointer.y;}
        });

        //setTimeout(()=>{graphics.clear();draw_tabVertex(main_poly);},1000);
    }
    
    update ()
    {
        pointer0 = this.input.activePointer;

        timer++;
        if(timer%(Math.round(60*relaxation_time/1000))==0){convexify(random_poly);convexify(random_poly2);convexify(random_poly3);convexify(random_poly4);}

        if(pointer0.isDown)
        {
            for (let index = 0; index < random_poly.length; index++)
            {
                let d = Math.pow(Math.pow(random_poly[index][0]-posX,2)+Math.pow(random_poly[index][1]-posY,2),0.5);
                if (d<radius_brush)
                {
                    random_poly[index][0] = posX + radius_brush/d*(random_poly[index][0]-posX);
                    random_poly[index][1] = posY + radius_brush/d*(random_poly[index][1]-posY);
                }
                d = Math.pow(Math.pow(random_poly2[index][0]-posX,2)+Math.pow(random_poly2[index][1]-posY,2),0.5);
                if (d<radius_brush2)
                {
                    random_poly2[index][0] = posX + radius_brush2/d*(random_poly2[index][0]-posX);
                    random_poly2[index][1] = posY + radius_brush2/d*(random_poly2[index][1]-posY);
                }
                d = Math.pow(Math.pow(random_poly3[index][0]-posX,2)+Math.pow(random_poly3[index][1]-posY,2),0.5);
                if (d<radius_brush3)
                {
                    random_poly3[index][0] = posX + radius_brush3/d*(random_poly3[index][0]-posX);
                    random_poly3[index][1] = posY + radius_brush3/d*(random_poly3[index][1]-posY);
                }
                d = Math.pow(Math.pow(random_poly4[index][0]-posX,2)+Math.pow(random_poly4[index][1]-posY,2),0.5);
                if (d<radius_brush4)
                {
                    random_poly4[index][0] = posX + radius_brush4/d*(random_poly4[index][0]-posX);
                    random_poly4[index][1] = posY + radius_brush4/d*(random_poly4[index][1]-posY);
                }
            }
        }

        graphics.clear();
        //draw_tabVertex(main_poly);
        draw_tabVertex(random_poly,0xC1FF1A);
        draw_tabVertex(random_poly2,0xFFFA49);
        draw_tabVertex(random_poly3,0xFAD84C);
        draw_tabVertex(random_poly4,0xF5A524);

        /*if (timer%4==0){
            if(pointer0.isDown){sponge.setScale(0.5);}
            else {sponge.setScale(1);}*/
        //sponge.x = posX;
        //sponge.y = posY;}
    }
}

function draw_tabVertex (tab,color){
    let poly = new Phaser.Geom.Polygon();
    let tab_vertices = [];
    for (let i = tab.length-1; i >= 0; i--) {
        let x = tab[i][0];
        let y = tab[i][1];
        let point = new Phaser.Geom.Point(x,y);
        tab_vertices.push(point);     
        //graphics.fillStyle(0x000000, 1);
        //graphics.fillCircle(x,y,5).setDepth(2);
    }
    poly.setTo(tab_vertices);
    graphics.fillStyle(color, 1);
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
        if (diff_angle > Math.PI*(1-0.1))
        //if (diff_angle > Math.PI*(1-0.2) && diff_angle < 2*Math.PI*(1-0.022))
        //if (Math.abs(diff_angle - Math.PI) > Math.PI/6)
        {
            let alpha = 1;
            tab[j][0] = (1-alpha)*tab_aux[j][0]+alpha*(tab_aux[i][0]+tab_aux[k][0])/2;
            tab[j][1] = (1-alpha)*tab_aux[j][1]+alpha*(tab_aux[i][1]+tab_aux[k][1])/2;
            /*for (let index = 1; index <= etapes_convexify; index++) {
                let alpha = index/etapes_convexify;
                alpha = xsin(alpha);
                setTimeout(()=>{
                    tab[j][0] = (1-alpha)*tab_aux[j][0]+alpha*(tab_aux[i][0]+tab_aux[k][0])/2;
                    tab[j][1] = (1-alpha)*tab_aux[j][1]+alpha*(tab_aux[i][1]+tab_aux[k][1])/2;
                },index/etapes_convexify*relaxation_time);
            }*/
        }        
    }
}

function xsin(x){return x+1.2*Math.sin(2*Math.PI*Math.pow(x,2))*Math.cos(2*Math.PI*x/4)}
/*
function xsin(xi){
    return Math.pow(xi,1/4)*(4+(Math.sin(2*2*Math.PI*xi))*Math.cos(2*Math.PI*xi/4))/4;
}*/