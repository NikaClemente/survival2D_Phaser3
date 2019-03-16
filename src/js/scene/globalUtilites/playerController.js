class PlayerController {
    constructor(scene){
        this.scene = scene;
        // console.log('1111');
        this.player = this.scene.physics.add.sprite(WIDTH/2, 320, 'player', 1).setOrigin(0.5,0.5).setScale(2);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 2, end: 6 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'stop',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        }); 

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySPACE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // console.log(Phaser.Input.Keyboard.KeyCodes);  // Все коды клавиатуры
    }


    update() {
        if (this.cursors.left.isDown || this.keyA.isDown)
        {
            this.player.anims.play('left', true).setFlipX(true);
            this.player.setVelocityX(-350);
        }
        else if (this.cursors.right.isDown || this.keyD.isDown)
        {
            this.player.anims.play('left', true).setFlipX(false);
            this.player.setVelocityX(350);
        }
        else
        {
            this.player.anims.play('stop', true);
            this.player.setVelocityX(0);
        }

        if ((this.cursors.up.isDown || this.keySPACE.isDown) && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    }
}