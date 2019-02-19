
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    scene: [ SceneGame ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: true
        }
    }
};

var game = new Phaser.Game(config);

var WIDTH = this.config.width;
var HEIGHT = this.config.height;