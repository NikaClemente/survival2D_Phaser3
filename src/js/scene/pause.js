class Pause extends Phaser.Scene {

    constructor()
    {
        super({ key: 'scenePause' });
    }

    preload() {
        this.load.image('fonPause', '/src/img/fonPause.png');
        this.load.image('play', '/src/img/play.png');
    }

    create() {
        this.add.image(0,0, 'fonPause').setOrigin(0, 0);
        this.add.image(WIDTH/2, HEIGHT/2, 'play').setInteractive();

        play.on('pointerup', function () {
            this.scene.resume('sceneGameLVL1');
            this.scene.stop();
        }, this);
    }

}