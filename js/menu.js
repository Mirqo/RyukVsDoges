var menuState = {

   ryukMenu: null,

   create: function(){

      var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
      wKey.onDown.addOnce(this.start, this);

      var white = "#ffffff";
      game.add.tileSprite(0,0,game.width, game.height, 'clouds');
      this.ryukMenu = game.add.sprite(game.width,game.height,'ryukMenu');
      this.ryukMenu.anchor.setTo(1,1);
      game.add.sprite(190, game.height/2 - 150, "bigDoge").scale.setTo(0.5,0.5);
      var dog = game.add.sprite(50, game.height/2, "angryDog");
      dog.frame = 0;
      dog.scale.setTo(2,2);

      var loadingLabel = game.add.text(80, 80, "RYUK VS DOGES", {font: '50px Arial', fill: white});
      var loadingLabel = game.add.text(game.width-30, 150, "Use WASD to move", {font: '35px Arial', fill: white});
      loadingLabel.anchor.x = 1;
      var loadingLabel = game.add.text(game.width-30, 190, "arrow keys to attack", {font: '35px Arial', fill: white});
      loadingLabel.anchor.x = 1;
      var loadingLabel = game.add.text(game.width-30, 230, "and space to dash.", {font: '35px Arial', fill: white});
      loadingLabel.anchor.x = 1;
      var loadingLabel = game.add.text(80, game.world.height-80, "Press W to start",
         {font: '25px Arial', fill: white});
   },

   start: function(){
      game.state.start('play');
   }
};
