var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided, bg, bg1;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  
  bg1 = loadImage ("backgroundImg (2).png");
  trex_running = loadAnimation("trex_1 (1).png","trex_2 (1).png","trex_3 (3).png");
  trex_collided = loadAnimation("trex_collided-1.png");
  
  groundImage = loadImage("ground-1.png");
  
  
  cloudImage = loadImage("cloud (1).png");
  
  obstacle1 = loadImage("obstacle1 (2).png");
  obstacle2 = loadImage("obstacle2 (2).png");
  obstacle3 = loadImage("obstacle3 (1).png");
  obstacle4 = loadImage("obstacle4 (1).png");
  
  restartImg = loadImage("restart (2).png")
  gameOverImg = loadImage("gameOver (1).png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(700, 500);
bg = createSprite (350,250,20,20);
  bg.addImage(bg1);
  bg.scale= 2;
  var message = "This is a message";
 console.log(message)
  
  ground = createSprite(200,440,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  trex = createSprite(50,400,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.1;
  
  
  
  gameOver = createSprite(350,250);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(350,290);
  restart.addImage(restartImg);
  
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.05;
  
  invisibleGround = createSprite(200,410,400,30);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,30,trex.height);
 
  
  score = 0;
  
}

function draw() {
  
  drawSprites();
  
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 300) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     if(mousePressedOver(restart)) {
      reset();
    }
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  


  
}

function reset(){
  score = 0;
  gameState = PLAY;
  restart.visible = false;
  gameOver.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation ("running",trex_running)
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,350,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

