
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
    var tBarreInit = 60;
    var tBarre, tBalle;
    var score = 0;
    var appuie = false;
    var event;
    var bonus = [];
    var bonusRevealed = [false,false,false]; //Sticky SuperBall Explosive
    
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
	tBarre = tBarreInit;
	balleTop = 455;
	balleLeft = 315;
	tBalle = 10;
	positionBarre = 290; //Largeur
	barre.style.width = tBarre + "px";
	balle.style.marginTop = balleTop + "px";
	balle.style.marginLeft = balleLeft + "px";
	balle.style.width = tBalle + "px";
	balle.style.height = tBalle + "px";
	barre.style.marginLeft = positionBarre + "px";

	for(var i = 0; i<bonusRevealed.length;i++)
	    bonusRevealed[i] = false;
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
	
	if(appuie)
	{
	    e = event;
	    if(e === 39 && positionBarre + tBarre < width+50){
		positionBarre++;
		barre.style.marginLeft = positionBarre + "px";
		if(balleTop === 455){
		    balleLeft++;
		    balle.style.marginLeft = balleLeft + "px";
		}
	    }

	    if(e === 37 && positionBarre > 0){
		positionBarre--;
		barre.style.marginLeft = positionBarre + "px";
		if(balleTop === 455){
		    balleLeft--;
		    balle.style.marginLeft = balleLeft + "px";
		}
	    }
	}
    }
    

    document.addEventListener('keydown', function(e){
	if((e.keyCode === 37 || e.keyCode === 39)){
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
	if(!start && !gameover && !gagne){
	    start = true;
	    afficheScore();
	    monte = 1;
	    gauche = (balleLeft+tBalle/2 - (positionBarre - (-tBarre/2)))/(tBarre/2);
	}

	if(gameover || gagne){
	   
	    barre.style.display = "block";
	    balle.style.display = "block";
	    initJeu();
	}
    }
    
    ecran.addEventListener("click", demarre);

    var revealBonus = function(){
	var r = Math.floor(Math.random()*6);
	//r = 3;

	switch(r){
	case 0:
	    if(tBarre < 4*tBarreInit){
		tBarre *= 2;
		barre.style.width = tBarre+"px";
	    }
	    else
		score += 10;
	    break;
	case 1:
	    if(tBarre > tBarreInit/4){
		tBarre /= 2;
		barre.style.width = tBarre+"px";
	    }
	    else
		score -= 10;
	    break;
	case 2:
	    score += 50;
	    break;
	case 3:
	    bonusRevealed[0] = true;
	    break;
	case 4:
	    bonusRevealed[1] = true;
	    break;
	case 5:
	    bonusRevealed[2] = true;
	    break;
	}
	
	
    }

    var moveBonus = function(){
	for(var i=bonus.length-1;i>=0;i--){
	    var pos = parseInt(bonus[i].style.marginTop)+1;
	    
	    
	    bonus[i].style.marginTop = pos+"px";
	    
	    
	}

	if(bonus.length > 0 && parseInt(bonus[bonus.length-1].style.marginTop) >= 465)
	{
	    var posLeft = parseInt(bonus[bonus.length-1].style.marginLeft);
	    if(posLeft > positionBarre && posLeft < tBarre + positionBarre)
		revealBonus();
	    ecran.removeChild(bonus[bonus.length-1]);
	    bonus.pop();
	}
    }

    var creerBonus = function(left,top){
	var divBonus = document.createElement("div");
	divBonus.style.marginLeft = left;
	divBonus.style.marginTop = top;
	divBonus.style.width = "5px";
	divBonus.style.height = "5px";
	divBonus.style.backgroundColor = "white";
	divBonus.style.position = "absolute";
	ecran.appendChild(divBonus);
	divBonus.hasAttribute("class", "bonus");
	bonus.unshift(divBonus);
	
    }

    var casseBrique = function(){
	var posBriqueH = Math.floor((balleLeft+10) / ((60+width)/w));
	var posBriqueV = Math.floor(balleTop / (height / (2*h)));
	
	if(briques[posBriqueV] !== undefined && briques[posBriqueV][posBriqueH] !== undefined){
	    var mLeft = parseFloat(briques[posBriqueV][posBriqueH].style.marginLeft);
	    var mTop = parseFloat(briques[posBriqueV][posBriqueH].style.marginTop);

	    if(!bonusRevealed[1]){
		//console.log(balleLeft + 10 >= mLeft + parseFloat(briques[posBriqueV][posBriqueH].style.width))
		if((balleTop + tBalle >= mTop && balleTop < mTop + parseFloat(briques[posBriqueV][posBriqueH].style.height)) && (balleLeft < mLeft || balleLeft + 10 >= mLeft + parseFloat(briques[posBriqueV][posBriqueH].style.width))){
		    
		    gauche = -gauche;
		}
		else
		    monte = -monte;
	    }
	    
	    ecran.removeChild(briques[posBriqueV][posBriqueH]);
	    briques[posBriqueV][posBriqueH] = undefined;

	    if(bonusRevealed[2])
	    {
		if(briques[posBriqueV][posBriqueH+1] != undefined)
		{
		    ecran.removeChild(briques[posBriqueV][posBriqueH+1]);
		    briques[posBriqueV][posBriqueH+1] = undefined;
		    --nbBriques;
		}

		if(briques[posBriqueV][posBriqueH-1] != undefined)
		{
		    ecran.removeChild(briques[posBriqueV][posBriqueH-1]);
		    briques[posBriqueV][posBriqueH-1] = undefined;
		    --nbBriques;
		}

		if(briques[posBriqueV+1] != undefined && briques[posBriqueV+1][posBriqueH] != undefined)
		{
		    ecran.removeChild(briques[posBriqueV+1][posBriqueH]);
		    briques[posBriqueV+1][posBriqueH] = undefined;
		    --nbBriques;
		}

		if(briques[posBriqueV-1] != undefined && briques[posBriqueV-1][posBriqueH] != undefined)
		{
		    ecran.removeChild(briques[posBriqueV-1][posBriqueH]);
		    briques[posBriqueV-1][posBriqueH] = undefined;
		    --nbBriques;
		}

		score += 10;
	    }
	    
	    score += 5;
	    
	    

	    if(--nbBriques <= 0){
		score += 50;
		start = false;
		gagne = true;
		afficheMessage("VICTOIRE !");
		barre.style.display = "none";
		balle.style.display = "none";
		initPos();
	    }
	    else if(!(Math.floor(Math.random()*4))){
		creerBonus(mLeft,mTop);
	    }

	    afficheScore();	
	}
    };

    var mvtVBalle = function(){
	balleTop -= monte;
	balle.style.marginTop = balleTop+"px";
	
	if(balleTop === 0){
	    monte = -monte;
	}

	if(balleTop === 455 && balleLeft + 10 >= positionBarre && balleLeft < positionBarre + tBarre){
	    monte = -monte;
	    if(bonusRevealed[0])
		start = false;
	}
    };

    var mvtHBalle = function(){
	if(balleTop === 455 && balleLeft + 10 >= positionBarre && balleLeft < positionBarre + tBarre){
	    /*
	    if(balleLeft + 10 >= positionBarre && balleLeft < positionBarre + tBarre/3){
		
		gauche = -1;
	    }
	    else if(balleLeft + 10 >= positionBarre + tBarre/3 && balleLeft < positionBarre + tBarre*2/3){
		gauche = 0;
	    }
	    else if(balleLeft + 10 >= positionBarre + tBarre*2/3 && balleLeft < positionBarre + tBarre){
		gauche = 1;
		}*/
	    gauche = (balleLeft+tBalle/2 - (positionBarre - (-tBarre/2)))/(tBarre/2);
	};
	
	if(balleLeft <= 0 || balleLeft >= width+39){
	    gauche = -gauche;
	}

	balleLeft += gauche;
	balle.style.marginLeft = balleLeft+"px";
    }

    var detruireBonus = function(){
	for(var i=bonus.length -1;i>=0;i--){
	    ecran.removeChild(bonus[i]);
	    bonus.pop();
	}
    }

    var checkDead = function(){
	if(balleTop === height){
	    start = false;
	    nbVies--;
	    
	    initPos();

	    displayVies();

	    detruireBonus();

	    if(nbVies === 0){
		gameover = true;
		score = 0;
		detruireJeu();
		afficheMessage("GAMEOVER");
		barre.style.display = "none";
		balle.style.display = "none";
		//initPos();
	    }
	}
    };

    
    
    var jeu = function(){
	if(start){
	    casseBrique();

	    if(start)
	    {
		mvtVBalle();
		
		mvtHBalle();
		
		checkDead();
	    }
	}
    };
    setInterval(jeu,1);
    setInterval(moveKeyboard,1);
    setInterval(moveBonus,1);
})();
