class Game{
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      home = new Home();
      home.display();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
    }

    player1 = createSprite(100, 100);
    player1.addImage("Not", NonHittingPlayerImage);
    player1.addImage("Is", HittingPlayerImage);
    player1.scale = 0.17;
    player1.depth = -10;
    player2 = createSprite(displayWidth-100, 100);
    player2.addImage("Not", NonHittingPlayerImage);
    player2.addImage("Is", HittingPlayerImage);
    player2.scale = 0.17;
    player2.depth = -10;
    player3 = createSprite(100, displayHeight-100);
    player3.addImage("Not", NonHittingPlayerImage);
    player3.addImage("Is", HittingPlayerImage);
    player3.scale = 0.17;
    player3.depth = -10;
    player4 = createSprite(displayWidth-100, displayHeight-100);
    player4.addImage("Not", NonHittingPlayerImage);
    player4.addImage("Is", HittingPlayerImage);
    player4.scale = 0.17;
    player4.depth = -10;

    players.push(player1, player2, player3, player4);
  }

  play(){
    Player.getPlayerInfo();
    home.hideForGame();
    
    if(allPlayers !== undefined){
      background("#C68767");
      image(battlegroundImage, 0, 0, windowWidth, windowHeight);

      var index = 0;

      for(var plr in allPlayers){
        index = index + 1;

        var x = allPlayers[plr].x
        var y = allPlayers[plr].y
        
        players[index-1].x = x
        players[index-1].y = y

        players[index-1].x += 300;

        if (index === player.index){
          push();
          textSize(25);
          textAlign(CENTER);
          strokeWeight(2);
          stroke("black");
          fill("white");
          text("You", players[index-1].x, players[index-1].y-40);
          text("HP:"+ player.health, camera.position.x+displayWidth/2, camera.position.y-displayHeight/2);
          text("Damage:"+player.damage, camera.position.x+displayWidth/2, camera.position.y-displayHeight/2+30);
          text("Kills:"+player.kills, camera.position.x+displayWidth/2, camera.position.y-displayHeight/2+60);
          pop();
          camera.position.x = players[index-1].x;
          camera.position.y = players[index-1].y;
          if(player.isHitting === 1){
            players[index-1].changeImage("Is");
            if(player.index === 1){
              this.onImpactTo(players[index-1], player2, "player2", player3, "player3", player4, "player4");
            } else if(player.index === 2){
              this.onImpactTo(players[index-1], player3, "player3", player1, "player1", player4, "player4");
            } else if(player.index === 3){
              this.onImpactTo(players[index-1], player2, "player2", player1, "player1", player4, "player4");
            } else if(player.index === 4){
              this.onImpactTo(players[index-1], player2, "player2", player3, "player3", player1, "player1");
            }
          } else if(player.isHitting === 0){
            players[index-1].changeImage("Not");
          }
          if(player.index === 1){
            player.health = hitRef1
          }else if(player.index === 2){
            player.health = hitRef2
          }else if(player.index === 3){
            player.health = hitRef3
          }else if(player.index === 4){
            player.health = hitRef4
          }
        } else{
          push();
          textSize(25);
          strokeWeight(2);
          stroke("black");
          fill("white");
          textAlign(CENTER);
          text(allPlayers[plr].name, players[index-1].x, players[index-1].y-40);
          pop();

          database.ref("players/player1/health").on("value", (data)=>{
            hitRef1 = data.val();
          })
          if(IH === "player1"){
            database.ref("players/player1").update({
              health:hitRef1-dhRef
            });
            IH = "";
            player.update();
          }
          database.ref("players/player2/health").on("value", (data)=>{
            hitRef2 = data.val();
          })
          if(IH === "player2"){
            database.ref("players/player2").update({
              health:hitRef2-dhRef
            });
            IH = "";
            player.update();
          }
          database.ref("players/player3/health").on("value", (data)=>{
            hitRef3 = data.val();
          })
          if(IH === "player3"){
            database.ref("players/player3").update({
              health:hitRef3-dhRef
            });
            IH = "";
            player.update();
          }
          database.ref("players/player4/health").on("value", (data)=>{
            hitRef4 = data.val();
          })
          if(IH === "player4"){
            database.ref("players/player4").update({
              health:hitRef4-dhRef
            });
            IH = "";
            player.update();
          }
        }
      }

      if(keyWentDown("space")){
        player.isHitting = 1;
        player.update();
      } else{
        player.isHitting = 0;
        player.update();
      }

      if(keyDown(UP_ARROW) && player.index !== null){
        player.y -= 10;
        player.update();
      }

      if(keyDown(DOWN_ARROW) && player.index !== null){
        player.y += 10;
        player.update();
      }

      if(keyDown(UP_ARROW) && player.index !== null && player.character === "Akio"){
        player.y -= 11;
        player.update();
      }

      if(keyDown(DOWN_ARROW) && player.index !== null && player.character === "Akio"){
        player.y += 11;
        player.update();
      }

      if(keyDown(RIGHT_ARROW) && player.index !== null){
        player.x += 10;
        player.update();
      }

      if(keyDown(LEFT_ARROW) && player.index !== null){
        player.x -= 10;
        player.update();
      }

      if(keyDown(RIGHT_ARROW) && player.index !== null && player.character === "Akio"){
        player.x += 11;
        player.update();
      }

      if(keyDown(LEFT_ARROW) && player.index !== null && player.character === "Akio"){
        player.x -= 11;
        player.update();
      }
    }
    drawSprites();
  }

  endEverything(){
    database.ref("players").remove();
    player.updateCount(0);
    this.update(0);
    window.location.reload(true);
  }

  onImpactTo(Ofplayer, one, o, two, t, three, t2){
    if(Ofplayer.isTouching(one)){
      dhRef = Math.round(Math.abs((Ofplayer.x-one.x)+(Ofplayer.y-one.y)));
      player.damage += dhRef;
      IH = "" + o;
      player.update();
    } else if(Ofplayer.isTouching(two)){
      dhRef = Math.round(Math.abs((Ofplayer.x-two.x)+(Ofplayer.y-two.y)));
      player.damage += dhRef;
      IH = "" + t;
      player.update();
    } else if(Ofplayer.isTouching(three)){
      dhRef = Math.round(Math.abs((Ofplayer.x-three.x)+(Ofplayer.y-three.y)));
      player.damage += dhRef;
      IH = "" + t2;
      player.update();
    }
  }
}
