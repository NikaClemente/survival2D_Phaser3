class SceneGame extends Phaser.Scene {

    constructor()
    {
        super({ key: 'sceneGame' });

        this.blockSize = 80;
        this.blockScale = 0.5;

        this.playerSpeed = 5;

        console.log(this.blockSize*this.blockScale);
    }

    preload() {
        this.load.image('backgroundGame','src/img/fon.png'); 
        this.load.spritesheet('blocks','src/img/blocks.jpg', { frameWidth: this.blockSize, frameHeight: this.blockSize });
        this.load.spritesheet('player','src/img/player.png', { frameWidth: 50, frameHeight: 45 });
        this.load.image('hotBar','src/img/hotBar.png');
    }


    block(gameObject, sprite){
        gameObject.destroy();
        console.log('Мы в функции 1  ', sprite);
        //gameObject.refreshBody();
    }

    create() {
        let BG = this.add.image(0, 0, 'backgroundGame').setOrigin(0.5,0.5).setScale(10,3);
        this.player = this.physics.add.sprite(WIDTH/2, 200, 'player', 1).setOrigin(1,0).setScale(2);
        // this.player.refreshBody();
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        let row = 50;
        let column = 100;

        this.blocks = this.matrixArray(row, column);

        let game = this;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < column; j++) {
                if (i == 0){
                        this.blocks[0][j] = this.physics.add.staticImage(j*this.blockSize*this.blockScale - 100, i*this.blockSize*this.blockScale + 400, 'blocks', 0).setOrigin(0,0).setScale(this.blockScale);
                        this.blocks[0][j].setInteractive();
                        this.physics.add.collider(this.player, this.blocks[0][j]);
                        this.blocks[0][j].on('pointerdown', function(pointer){   
                        game.block(this, 0);
                    },this.blocks[0][j]);
                }
                else{
                        this.blocks[i][j] = this.physics.add.staticImage(j*this.blockSize*this.blockScale - 100, i*this.blockSize*this.blockScale + 400, 'blocks', this.getRandomArbitrary(1,13)).setOrigin(0,0).setScale(this.blockScale);  
                        this.blocks[i][j].setInteractive();
                        this.physics.add.collider(this.player, this.blocks[i][j]);
                        this.blocks[i][j].on('pointerdown', function(pointer){
                        game.block(this, this.frame.name);
                    },this.blocks[i][j]);
                }
                
            } 
            
        }

        // this.cameras.main.setBounds((this.blocks[0][0].x), -200, (this.blocks[0][column-1].x + 40 + 40 + 40 + 20), 1000);

        this.input.keyboard.on('keydown_NUMPAD_ZERO', function () {
            console.log('NumPad клавиатура');  // на ней будет хотбар персонажа (для начала :) )
        }, this);
        

        // this.input.on('pointerup', function (pointer) {
        
        // }, this);
        

        this.cursors = this.input.keyboard.createCursorKeys();
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });



        let controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            //up: this.cursors.up,
            //down: this.cursors.down,
            acceleration: 0.06,                // Ускорение
            drag: 0.0005,                       // (тянуть 0.0005)
            maxSpeed: 0.25                     // Максимальная скорость
        };
    
        // zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        // zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),


        
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        // this.add.image(HEIGHT/2 + 100, 500, 'hotBar').setScrollFactor(0);
    }

    update(time, delta) {
        if (this.cursors.left.isDown)
        {
            this.player.anims.play('left', true).setFlipX(true);
            this.player.x -= this.playerSpeed;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('left', true).setFlipX(false);
            this.player.x += this.playerSpeed;
        }
        else
        {
            this.player.anims.stop();
        }


        this.controls.update(delta);
    }

    matrixArray(rows,columns){
        let arr = [];
        for(let i = 0; i < rows; i++){
          arr[i] = [];
          for(let j = 0; j<columns; j++){
            arr[i][j] = null;
          }
        }
        return arr;
      }

      getRandomArbitrary(min, max) {
        return (Math.random() * (max - min) + min).toFixed();
      }
}
