var loadState = {
   preload: function (){

      var loadingLabel = game.add.text(80, 150, 'loading...',
         {font: '30px Courier', fill: '#ffffff'});

      game.load.image('ryukMenu', 'assets/ryukMenu.png');
      game.load.image('clouds', 'assets/clouds.jpg');
      game.load.image('background', 'assets/background.png');
      game.load.image('bigDoge', 'assets/bigDoge.png');

      game.load.spritesheet('angryDog', 'assets/angryDog.png', 126,140,16 );
      game.load.spritesheet('playerSheet', 'assets/ryuk.png',48,64,16);
      game.load.spritesheet('slashSheetLeft', 'assets/slashLeft.png', 38,64,3);
      game.load.spritesheet('slashSheetUp', 'assets/slashUp.png', 64,38,3);
      game.load.image('baddie', 'assets/baddie.png');
      game.load.audio('slashSound', 'assets/slashSound.ogg');
   },

   create: function(){
      game.state.start('menu');
   }
};
