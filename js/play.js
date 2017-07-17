var playState = {

   oldPos: {x: 0,y: 0},
   dashDir: {x: 0,y: 0},
   dashing: false,
   lastDashTime: 0,
   dashCooldown: 250,
   lastSlashTime: 0,
   slashCooldown: 300,
   enemies: null,
   bigDoges: null,
   redTintTween: null,
   anim: null,
   score: 0,
   spawnPoints: null,
   bigDogFrequency: 15,
   dogsSinceStart: 0,

   create: function (){
      game.score = 0;
      game.angryDogesKilled = 0;
      game.bigDogesKilled = 0;
      game.add.tileSprite(0,0, 1920, 1920, 'background');
      game.world.setBounds(0, 0, 1920, 1920);
      this.keyboard = game.input.keyboard;
      this.spawnPoints = [
         {x: 0, y: 0},
         {x: game.world.width/2, y: 0},
         {x: game.world.width, y: 0},
         {x: game.world.width, y: game.world.height/2},
         {x: game.world.width, y: game.world.height},
         {x: game.world.width/2, y: game.world.height},
         {x: 0, y: game.world.height/2},
         {x: 0, y: game.world.height}
      ];

      this.bigDoges = game.add.group();
      this.bigDoges.enableBody = true;
      this.bigDoges.physicsBodyType = Phaser.Physics.ARCADE;

      this.enemies = game.add.group();
      this.enemies.enableBody = true;
      this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
      for (var i = 0; i < 1; i++){
         var c = this.enemies.create(game.world.randomX,game.world.randomY , 'angryDog');
         c.anchor.setTo(0.5,0.5);
         c.frame = 0;
         c.name = 'angryDoge';
         c.health = 3;
         c.immortal = false;
         c.animations.add('walkDown',[0,1,2,3], 10, true);
         c.animations.add('walkLeft',[4,5,6,7], 10, true);
         c.animations.add('walkRight',[8,9,10,11], 10, true);
         c.animations.add('walkUp',[12,13,14,15], 10, true);
      }

      this.player = game.add.sprite(game.world.width/2, game.world.height/2, 'playerSheet');
      game.physics.enable(this.player, Phaser.Physics.ARCADE);
      this.player.body.collideWorldBounds =true;
      this.player.anchor.setTo(0.5,0.5);
      this.player.frame = 0;
      this.player.health = 10;
      this.player.immortal = false;
      this.player.animations.add('walkDown',[0,1,2,3], 10, true);
      this.player.animations.add('walkLeft',[4,5,6,7], 10, true);
      this.player.animations.add('walkRight',[8,9,10,11], 10, true);
      this.player.animations.add('walkUp',[12,13,14,15], 10, true);

      this.slashLeft = game.add.sprite(0, 0, 'slashSheetLeft');
      game.physics.enable(this.slashLeft, Phaser.Physics.ARCADE);
      this.slashLeft.anchor.setTo(0.5,0.5);
      this.slashLeft.animations.add('slashLeft',[0,1,2], 10, false);
      this.slashLeft.kill();

      this.slashUp = game.add.sprite(0, 0, 'slashSheetUp');
      game.physics.enable(this.slashUp, Phaser.Physics.ARCADE);
      this.slashUp.anchor.setTo(0.5,0.5);
      this.slashUp.animations.add('slashUp',[0,1,2], 10, false);
      this.slashUp.kill();

      game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

      //healthBar
      var barConfig = {
         x: 100, y: game.height-30,
         width: 160, height: 40
      };
      this.myHealthBar = new HealthBar(this.game, barConfig);
      this.myHealthBar.setBarColor('#4CFF4C');
      this.myHealthBar.setFixedToCamera(true);

      this.slashSound = game.add.audio('slashSound', 0.1);

      //setInterval(this.spawnEnemy(), 1000);
      game.time.events.loop(Phaser.Timer.SECOND, this.spawnEnemy, this);

      game.endTime = Date.now();

   },

   update: function(){
      this.handleInput();
      this.dash();
      game.physics.arcade.overlap(this.slashLeft, this.enemies, this.slashCollisionHandler, null, this);
      game.physics.arcade.overlap(this.slashUp, this.enemies, this.slashCollisionHandler, null, this);
      game.physics.arcade.overlap(this.slashLeft, this.bigDoges, this.slashCollisionHandler, null, this);
      game.physics.arcade.overlap(this.slashUp, this.bigDoges, this.slashCollisionHandler, null, this);
      game.physics.arcade.overlap(this.player, this.enemies, this.playerCollisionHandler, null, this);
      game.physics.arcade.overlap(this.player, this.bigDoges, this.playerCollisionHandler, null, this);

      this.enemies.forEachAlive(game.physics.arcade.moveToObject, this, this.player, 200);
      this.bigDoges.forEachAlive(game.physics.arcade.moveToObject, this, this.player, 160);
      this.enemies.forEachAlive(this.determineAnimationForAngryDog,this );
   },
   handleInput: function(){

      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;
      var a = 0;
      var b = 0;
      if (this.keyboard.isDown(Phaser.Keyboard.A)){
         a += -1;
      }
      if (this.keyboard.isDown(Phaser.Keyboard.D)){
         a += 1;
      }
      if (this.keyboard.isDown(Phaser.Keyboard.W)){
         b += -1;
      }
      if (this.keyboard.isDown(Phaser.Keyboard.S)){
         b += 1;
      }
      if (b === 1){
         this.player.animations.play('walkDown');
      }
      else if (b === -1){
         this.player.animations.play('walkUp');
      }
      else if (a === 1){
         this.player.animations.play('walkRight');
      }
      else if (a === -1){
         this.player.animations.play('walkLeft');
      }

      if (a === 0 && b === 0){
         this.player.animations.stop();
         this.player.frame = 0;
      }

      if (a === 0 || b === 0){
         this.player.body.velocity.x = a*175;
         this.player.body.velocity.y = b*175;
      }
      else {
         this.player.body.velocity.x = a*123;
         this.player.body.velocity.y = b*124;
      }

      if (this.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.canDash()){
         this.dashing = true;
         this.oldPos.x = this.player.body.x;
         this.oldPos.y = this.player.body.y;
         this.dashDir.x = Math.sign(this.player.body.velocity.x);
         this.dashDir.y = Math.sign(this.player.body.velocity.y);
      }

      //attack
      if (this.player.alive && (this.lastSlashTime + this.slashCooldown <= Date.now())){
         if (this.keyboard.isDown(Phaser.Keyboard.LEFT)){
            this.slashLeft.x = this.player.x-Math.floor(this.player.width/2 + this.slashLeft.width/2);
            this.slashLeft.y = this.player.y;
            this.slashLeft.angle = 0;
            this.slashLeft.revive();
            this.slashLeft.animations.play('slashLeft',15,false,true);
            this.lastSlashTime = Date.now();
            this.slashSound.play();
            this.slashLeft.x = this.player.x-Math.floor(this.player.width/2 + this.slashLeft.width/2);
            this.slashLeft.y = this.player.y;
         }
         else if (this.keyboard.isDown(Phaser.Keyboard.UP)){
            this.slashUp.x = this.player.x;
            this.slashUp.y = this.player.y-Math.floor(this.player.height/2 + this.slashUp.height/2);
            this.slashUp.angle = 0;
            this.slashUp.revive();
            this.slashUp.animations.play('slashUp',15,false,true);
            this.lastSlashTime = Date.now();
            this.slashSound.play();
         }
         else if (this.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            this.slashLeft.x = this.player.x+Math.floor(this.player.width/2 + this.slashLeft.width/2);
            this.slashLeft.y = this.player.y;
            this.slashLeft.angle = 180;
            this.slashLeft.revive();
            this.slashLeft.animations.play('slashLeft',15,false,true);
            this.lastSlashTime = Date.now();
            this.slashSound.play();
         }
         else if (this.keyboard.isDown(Phaser.Keyboard.DOWN)){
            this.slashUp.x = this.player.x;
            this.slashUp.y = this.player.y+Math.floor(this.player.height/2 + this.slashUp.height/2);
            this.slashUp.angle = 180;
            this.slashUp.revive();
            this.slashUp.animations.play('slashUp',15,false,true);
            this.lastSlashTime = Date.now();
            this.slashSound.play();
         }
      }

   },

   win: function(){
      game.state.start('win');
   },
   canDash: function(){
      if (this.lastDashTime + this.dashCooldown <= Date.now() ){
         return true;
      }
      return false;
   },
   dash: function(){
      if (this.dashing && this.distance(this.player.body.x, this.player.body.y, this.oldPos.x, this.oldPos.y) < 100 ){
         var a = this.dashDir.x;
         var b = this.dashDir.y;
         if (a === 0 && b === 0){
            this.dashing = false;
            return;
         }
         if (a === 0 || b === 0){
            this.player.body.velocity.x += a*700;
            this.player.body.velocity.y += b*700;
         }
         else {
            this.player.body.velocity.x += a*495;
            this.player.body.velocity.y += b*495;
         }
         this.lastDashTime = Date.now();
      }
      else {
         this.dashing = false;
      }
   },
   distance: function(a,b,x,y){
      return Math.floor( Math.sqrt( (a-x)**2 + (b-y)**2 ) );
   },
   slashCollisionHandler: function(slash, enemy){
      if (enemy.immortal === false){
         enemy.damage(1);
         if (enemy.alive === false){
            if ( enemy.name === "bigDoge"){
               game.bigDogesKilled++;
               game.score+=100;
               this.player.health += 5;
            }
            else {
               game.angryDogesKilled++;
               game.score+=10;
               this.player.health += 0.5;
            }
            if (this.player.health > 10){
               this.player.health = 10;
            }
            this.myHealthBar.setPercent(this.player.health*10);
         }
         enemy.immortal = true;
         var tween = game.add.tween(enemy);
         enemy.tint = 0xFF0000;
         tween.to( { tint: 0xFFFFFF }, 200, "Linear", true);
         setTimeout(function(){
            enemy.immortal = false;
         },300 );

      }

   },
   playerCollisionHandler: function(player, enemy){
      if (player.immortal === false){
         this.dmgFlash();
         player.damage(1);
         this.myHealthBar.setPercent(this.player.health*10);
         player.immortal = true;
         setTimeout(function (){
            player.immortal = false;
         }, 500);
         var alreadyWinning = false;
         if (player.alive === false && !alreadyWinning){
            alreadyWinning = true;
            game.endTime = Date.now() - game.endTime;
            setTimeout(this.win, 3000);
         }
      }
   },
   dmgFlash: function(){
      game.camera.flash(0xff0000, 500);
   },
   // play animation based on body.velocity
   determineAnimationForAngryDog(angryDog){
      if (Math.abs(angryDog.body.velocity.x) >= Math.abs(angryDog.body.velocity.y)){
         if (angryDog.body.velocity.x < 0){
            angryDog.animations.play('walkLeft');
         }
         else {
            angryDog.animations.play('walkRight');
         }
      }
      else {
         if (angryDog.body.velocity.y < 0) {
            angryDog.animations.play('walkUp');
         }
         else {
            angryDog.animations.play('walkDown');
         }
      }
   },
   spawnEnemy: function(){
      console.log("spawned enemy");
      this.dogsSinceStart++;
      var pos = this.spawnPoints[Math.floor(Math.random()*8)];
      var image;

      if ( this.dogsSinceStart % this.bigDogFrequency === 0){
         sprite = this.bigDoges.getFirstDead(false);
         if ( sprite === null) {
            sprite = this.bigDoges.create(pos.x, pos.y, "bigDoge");
            sprite.anchor.setTo(0.5,0.5);
            sprite.health = 20;
            sprite.immortal = false;
            sprite.name = "bigDoge";
         }
         else {
            sprite.reset(pos.x, pos.y, 20);
         }
      }
      else {
         image = "angryDog";
         var sprite = this.enemies.getFirstDead(false);

         if (sprite === null){
            sprite = this.enemies.create(pos.x, pos.y, image);
            sprite.anchor.setTo(0.5,0.5);
            sprite.frame = 0;
            sprite.name = 'angryDog';
            sprite.health = 3;
            sprite.immortal = false;
            sprite.animations.add('walkDown',[0,1,2,3], 10, true);
            sprite.animations.add('walkLeft',[4,5,6,7], 10, true);
            sprite.animations.add('walkRight',[8,9,10,11], 10, true);
            sprite.animations.add('walkUp',[12,13,14,15], 10, true);
         }
         else {
            sprite.reset(pos.x, pos.y, 3);
         }
      }
   },

   render: function(){
      //game.debug.body(this.slashLeft);
   },
};
