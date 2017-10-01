
var width = 640 - 69;
var height = 480;
var h = 10,w=10;
var tBrique = width/w;


var nouveau = function(){
    
    var n = Math.floor(Math.random()*(h*w - 20)) + 20;
    var m = n;
    var jeu = document.getElementById("jeu");
    var briques = new Array(h);

    for(var i = 0;i<n;i++){
	briques[i] = new Array(w);
    }

    document.getElementById("message").style.display = "none";	
    
    n = 0;

    while(m>0){
	var i = Math.floor(Math.random()*m);
	m--;	
	var l = Math.floor(i/w)*(height/(2*h)), c = (i%w)*((60+width)/w);
	
	if(briques[l/(height/(2*h))][c/((60+width)/w)] === undefined){

	    var brique = document.createElement("div");
	    brique.style.width = tBrique+ "px";
	    brique.style.height = ((height/(2*h))-10)+"px";
	    brique.style.marginTop = l + "px";
	    brique.style.marginLeft = c + "px";
	    brique.style.backgroundColor = "white";
	    brique.style.position = "absolute";
	    
	    brique.hasAttribute("class","brique");
	    jeu.appendChild(brique);
	    briques[l/(height/(2*h))][c/((60+width)/w)] = brique;
	    n++;
	}
    }

    return [briques,n];
};


(function(){
    var nbVies = 3;
    var score = 0;
    var positionBarre;
    var barre = document.getElementById("barre");
    var balle = document.getElementById("balle");
    var balleLeft, balleTop;
    var ecran = document.getElementById("jeu");
    var tBarre = 60;
    var score = 0;
    var appuie = false;
    var event;
    
    var displayVies = function(){
	var vies = "";
	
	for(var i=0;i<nbVies;i++){
	    vies += "*";
	}

	document.getElementById("vies").innerHTML = vies;
    };

    var initJeu = function(){
	var t = nouveau();
	if(gameover){
	    nbVies = 3;
	}
	gameover = false;
	gagne = false;
	
	briques = t[0], nbBriques = t[1];
	displayVies();
    };

    var initPos = function(){
	appuie = false;
	balleTop = 455;
	balleLeft = 310;
	positionBarre = 290;
	balle.style.marginTop = balleTop + "px";
	balle.style.marginLeft = balleLeft + "px";
	barre.style.marginLeft = positionBarre + "px";
    };

    var detruireJeu = function(){
	var jeu = document.getElementById("jeu");

	for(var i=0;i<briques.length;i++){
	    for(var j=0;j<briques[i].length;j++){
		if(briques[i][j] !== undefined){
		    jeu.removeChild(briques[i][j]);
		    briques[i][j] = undefined;
		}
	    }
	}
    };

    var afficheScore = function(){
	document.getElementById("score").innerHTML = score;
    };

    var afficheMessage = function(msg){
	var p = document.getElementById("message");

	p.innerHTML = msg;
	p.style.display = "block";
	
    }

    var moveKeyboard = function(){
	
	//console.log(appuie);

	if(appuie)
	{
	    e = event;
	    if(e === 39 && positionBarre + tBarre < width+50){
		positionBarre++;
		barre.style.marginLeft = positionBarre + "px";
	    }

	    if(e === 37 && positionBarre > 0){
		positionBarre--;
		barre.style.marginLeft = positionBarre + "px";
	    }
	}
    }
    

    document.addEventListener('keydown', function(e){
	if(start && (e.keyCode === 37 || e.keyCode === 39)){
	    event = e.keyCode;
	    appuie = true;
	}

	if(e.keyCode  === 32)
	    demarre();
    });

    document.addEventListener('keyup',function(e){
	appuie = false;
    });

    ecran.addEventListener('mousemove',function(e){
	 
	if(start){
	    var a = e.pageX-ecran.offsetLeft;
	    if(a > 0 && a < width-5)
		positionBarre = a;
		barre.style.marginLeft = positionBarre + "px";
	}
    });
    

    var start = false;
    var gameover = false, gagne = false;
    var briques,monte,gauche;
    initPos();
    initJeu();
    
    var demarre = function(){
	if(gameover || gagne){
	   
	    barre.style.display = "block";
	    balle.style.display = "block";
	    initJeu();
	}

	if(!start){
	    start = true;
	    afficheScore();
	    monte = 1;
	    gauche = 0;
	}
    }
    
    ecran.addEventListener("click", demarre);    

    var casseBrique = function(){
	var posBriqueH = Math.floor((balleLeft+10) / ((60+width)/w));
	var posBriqueV = Math.floor(balleTop / (height / (2*h)));
	
	if(briques[posBriqueV] !== undefined && briques[posBriqueV][posBriqueH] !== undefined){
	    
	    /*if(balleTop+"px" < briques[posBriqueV][posBriqueH].marginTop || balleTop+"px" >= briques[posBriqueV][posBriqueH].marginTop+h)
		monte = -monte
	    else
		gauche = -gauche;*/

	    monte = -monte;
	    //console.log(balleTop,briques[posBriqueV][posBriqueH].style.marginTop);
	    document.getElementById("jeu").removeChild(briques[posBriqueV][posBriqueH]);
	    briques[posBriqueV][posBriqueH] = undefined;
	    score += 5;
	    
	    

	    if(--nbBriques === 0){
		score += 50;
		start = false;
		gagne = true;
		initPos();
		barre.style.display = "none";
		balle.style.display = "none";
		afficheMessage("VICTOIRE !");
	    }

	    afficheScore();	
	}
    };

    var mvtVBalle = function(){
	balleTop -= monte;
	balle.style.marginTop = balleTop+"px";
	
	if(balleTop === 0 || balleTop === 455 && balleLeft + 10 >= positionBarre && balleLeft < positionBarre + tBarre){
	    monte = -monte;
	}
    };

    var mvtHBalle = function(){
	if(balleTop === 455){
	    
	    if(balleLeft + 10 >= positionBarre && balleLeft < positionBarre + tBarre/3){
		
		gauche = -1;
	    }
	    else if(balleLeft + 10 >= positionBarre + tBarre/3 && balleLeft < positionBarre + tBarre*2/3){
		gauche = 0;
	    }
	    else if(balleLeft + 10 >= positionBarre + tBarre*2/3 && balleLeft < positionBarre + tBarre){
		gauche = 1;
	    }
	};
	
	if(balleLeft === 0 || balleLeft === width+39){
	    gauche = -gauche;
	}

	balleLeft += gauche;
	balle.style.marginLeft = balleLeft+"px";
    }

    var checkDead = function(){
	if(balleTop === height){
	    start = false;
	    nbVies--;
	    
	    initPos();

	    displayVies();

	    if(nbVies === 0){
		gameover = true;
		score = 0;
		detruireJeu();
		afficheMessage("GAMEOVER");
		barre.style.display = "none";
		balle.style.display = "none";
		initPos();
	    }
	}
    };

    
    
    var jeu = function(){
	if(start){
	    casseBrique();
	    
	    mvtVBalle();
	    
	    mvtHBalle();

	    checkDead();
	}
    };
    setInterval(jeu,1);
    setInterval(moveKeyboard,1);
})();
