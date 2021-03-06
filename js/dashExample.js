var game = new Phaser.Game(1024, 672, Phaser.AUTO, 'gameDiv',
   { preload: preload, create: create, update: update });

function preload() {
   //game.load.image('space', 'assets/space.png');
   game.load.image('ground', 'assets/platform.png');
   game.load.image('player', 'assets/player.png');
}
var platforms;
var player;
var globalGravity = 9;
var dashingRight = false;
var dashingLeft = false;
var oldPos;
function create() {
   game.physics.startSystem(Phaser.Physics.ARCADE);
   game.stage.backgroundColor = '#123456';
   // place stuff
   //game.add.sprite(0, 0, 'space');
   // The platforms group contains the ground
   platforms = game.add.group();
   /// Dont look at this.. totally bad
   var ground = platforms.create(0, game.world.height - 64, 'ground');
   var leftWall = platforms.create(0, 0, 'ground');
   var rightWall = platforms.create(game.world.width - 20, 0, 'ground');
   game.physics.arcade.enable([ground,leftWall,rightWall]);
   ground.scale.setTo(4, 2);
   ground.body.immovable = true;
   leftWall.scale.setTo(0.1, 50);
   leftWall.body.immovable = true;
   rightWall.scale.setTo(0.1, 50);
   rightWall.body.immovable = true;
   // The player and its settings
   player = game.add.sprite(game.world.width/2  , game.world.height -120, 'player');
   game.physics.arcade.enable(player);

   // player physics properties. Give the little guy a slight bounce.
   player.body.gravity.y = globalGravity;
   player.body.collideWorldBounds = true;
   //  Our controls.
   cursors = game.input.keyboard.createCursorKeys();
   spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
   dashE = game.input.keyboard.addKey(Phaser.Keyboard.E);
   dashQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
   dashQ.onDown.add(dashLeft, this);
   dashE.onDown.add(dashRight, this);
}
// create end
function update() {
   player.body.velocity.x = 0;
   //Collision
   /*game.physics.collide(player, platforms);
   if (player.body.touching.left || player.body.touching.right) {
      dashingRight = false ;
      dashingLeft = false ;
   }*/
   // check for key inputs
   inputHandler();
   if ( dashingLeft && (oldPos - player.x < 100)  ) {
      // 100 would be the length of your dash move
      player.body.velocity.x = -500;
      // or something some other dashing speed
   }
   else {
      dashingLeft = false;
   }
   if ( dashingRight && ( oldPos - player.x > -100)  ) {
      // 100 would be the length of your dash move
      player.body.velocity.x = 500;
      // or something some other dashing speed
   }
   else {
      dashingRight = false;
   }
}
// update endfunction
function inputHandler() {
   // Arrow right
   if (cursors.right.isDown) {
      moveRight();
   }
   // Arrow left
   if (cursors.left.isDown) {
      moveLeft();
   }
   // Arrow up
   if ( cursors.up.isDown ) {
      jump();
   }
}
function jump () {
   if (player.body.touching.down) {
      player.body.velocity.y = -300;
   }
}
function moveRight() {
   player.body.velocity.x = 100;
}
function moveLeft() {
   player.body.velocity.x = -100;
}
function dashRight () {
   oldPos = player.x;
   dashingRight = true;
   dashingLeft = false;
}
function dashLeft () {
   oldPos = player.x;
   dashingLeft = true;
   dashingRight = false;
}
