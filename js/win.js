var winState = {

   preload: function(){

      var loadingLabel = game.add.text(80, 80, "Stats:",
         {font: '50px Arial', fill: '#ffffff'});

      var loadingLabel = game.add.text(80, 130, "You lasted " + Math.floor(game.endTime/1000) + " seconds.",
         {font: '25px Arial', fill: '#ffffff'});

      var loadingLabel = game.add.text(80, 180, "You killed " + game.angryDogesKilled + " angry doges.",
         {font: '25px Arial', fill: '#ffffff'});

      var loadingLabel = game.add.text(80, 230, "You killed " + game.bigDogesKilled + " Big doges.",
         {font: '25px Arial', fill: '#ffffff'});

      var loadingLabel = game.add.text(80, 280, "Final Score:  " + (game.score + Math.floor(game.endTime/1000)*10),
         {font: '25px Arial', fill: '#ffffff'});

      var loadingLabel = game.add.text(80, game.height-180, "Press W to try for a better score.",
         {font: '25px Arial', fill: '#ffffff'});

      var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

      wKey.onDown.addOnce(this.start, this);
   },

   start: function(){
      game.state.start('menu');
   }
};
