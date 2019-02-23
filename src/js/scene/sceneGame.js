class SceneGame extends Phaser.Scene {

    constructor()
    {
        super({ key: 'sceneGame' });

        this.blockSize = 64;
        this.blocksKoll = 8;
        this.blockScale = 1;

        // this.playerSpeed = 5;

        // console.log(this.blockSize*this.blockScale);
    }

    preload() {
        this.load.image('backgroundGame','src/img/fon.png'); 
        this.load.image('fonBackDirt','src/img/fonBackDirt.jpg'); 
        this.load.image('fonBackWhite','src/img/fonBackWhite.jpg');
        this.load.spritesheet('blocks','src/img/blocks.png', { frameWidth: this.blockSize, frameHeight: this.blockSize });
        this.load.spritesheet('player','src/img/player2.png', { frameWidth: 24, frameHeight: 64 });
        this.load.image('hotBar','src/img/hotBar.png');
    }


    

    create() { 
        let row = 25;
        let column = 60;
        
        this.startMatrixCoordinateX = -100;
        this.startMatrixCoordinateY = 400;

        let BG = this.add.image(this.startMatrixCoordinateX, -200, 'backgroundGame').setOrigin(0,0).setScale(5,1);
        let fonBackWhite = this.add.image( this.startMatrixCoordinateX, this.startMatrixCoordinateY, 'fonBackWhite').setOrigin(0, 0).setScale(5,3);
        let fonBackDirt = this.add.image( this.startMatrixCoordinateX, this.startMatrixCoordinateY, 'fonBackDirt').setOrigin(0, 0);
        fonBackDirt.alpha = 0.5;

        this.player = this.physics.add.sprite(WIDTH/2, 320, 'player', 1).setOrigin(0.5,0.5).setScale(2);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.startTime = this.time.now;
        this.endTime;
        this.fps = 0;
        this.fpsText = this.add.text(20,20).setScrollFactor(0);


        this.blocks = this.matrixArray(row, column);

        { // Генерация и обработка
           let game = this;
            for (let i = 0; i < row; i++) {
                for (let j = 0; j < column; j++) {
                    if (i == 0){
                            this.blocks[i][j] = this.physics.add.staticImage(j*this.blockSize*this.blockScale + this.startMatrixCoordinateX, i*this.blockSize*this.blockScale + this.startMatrixCoordinateY, 'blocks', 0).setOrigin(0,0).setScale(this.blockScale);
                            this.blockSetOptions(i, j);
                            this.blocks[i][j].on('pointerdown', function(pointer){   
                                // console.log(pointer);
                                if (pointer.buttons == 1){
                                    game.blockDestroy(i, j, 0);
                                }
                                if (pointer.buttons == 2){
                                    game.blockNew(i, j, 2);
                                }
                            },this.blocks[i][j]);
                    }
                    else if (i == row-1){
                            this.blocks[i][j] = this.physics.add.staticImage(j*this.blockSize*this.blockScale + this.startMatrixCoordinateX, i*this.blockSize*this.blockScale + this.startMatrixCoordinateY, 'blocks', 7).setOrigin(0,0).setScale(this.blockScale);
                            this.blockSetOptions(i, j);
                            this.blocks[i][j].refreshBody();
                    }
                    else{
                            this.blocks[i][j] = this.physics.add.staticImage(j*this.blockSize*this.blockScale + this.startMatrixCoordinateX, i*this.blockSize*this.blockScale + this.startMatrixCoordinateY, 'blocks', this.getRandomArbitrary(1, this.blocksKoll-1)).setOrigin(0,0).setScale(this.blockScale);  
                            this.blockSetOptions(i, j);
                            this.blocks[i][j].on('pointerdown', function(pointer){
                            if (pointer.buttons == 1){
                                game.blockDestroy(i, j, this.frame.name);
                            }
                            if (pointer.buttons == 2){
                                game.blockNew(i, j, 2);
                            }
                        },this.blocks[i][j]);
                    }
                    
                } 
                
            } 
        }

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.setBounds((this.blocks[0][0].x), -200, (this.blocks[0][column-1].x + this.blockSize*this.blockScale * 2 + 37), (this.blocks[row-1][0].y + this.blockSize*this.blockScale * 4 + 5));
        this.cameras.main.setBounds((this.blocks[0][0].x), -200, (this.blocks[0][column-1].x + this.blockSize*this.blockScale * 2 + 37), (this.blocks[row-1][0].y + this.blockSize*this.blockScale * 4 + 5)).setName('main');

        this.cameras.main.startFollow(this.player, true);    // Камера закреплена за персонажем

        this.minimap = this.cameras.add(WIDTH-200, 10, 150, 100).setZoom(0.1).setName('mini');
        this.minimap.startFollow(this.player, true);    // Камера закреплена за персонажем
        this.minimap.setBounds((this.blocks[0][0].x), -200, (this.blocks[0][column-1].x + this.blockSize*this.blockScale * 2 + 37), (this.blocks[row-1][0].y + this.blockSize*this.blockScale * 4 + 5));

        let controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            // zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            // zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
        };
    
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        { // Анимация
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('player', { start: 2, end: 6 }),
                frameRate: 8,
                repeat: -1
            });

            this.anims.create({
                key: 'stop',
                frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
                frameRate: 1,
                repeat: -1
            }); 
        }
        
        this.hotBar = this.add.image(HEIGHT/2 + 100, 500, 'hotBar').setScrollFactor(0);
        this.hotBar.visible = false;

        this.input.keyboard.on('keydown_NUMPAD_ZERO', function () {
            console.log('NumPad клавиатура');  // на ней будет хотбар персонажа (для начала :) )
            this.hotBar.visible = !this.hotBar.visible;
        }, this);
    }

    update(time, delta) {
        { // FPS
            this.endTime = (time/1000).toFixed();
            this.fps++;
            //console.log(this.counter);
            if (this.endTime - (this.startTime/1000).toFixed() == 1){
                this.fpsText.setText('FPS: ' + this.fps);
                this.startTime = this.time.now;
                this.fps = 0;
            }
        }
        
        
        { // Движения персонажа
            if (this.cursors.left.isDown)
            {
                this.player.anims.play('left', true).setFlipX(true);
                this.player.setVelocityX(-350);
            }
            else if (this.cursors.right.isDown)
            {
                this.player.anims.play('left', true).setFlipX(false);
                this.player.setVelocityX(350);
            }
            else
            {
                this.player.anims.play('stop', true);
                this.player.setVelocityX(0);
            }

            if (this.cursors.up.isDown && this.player.body.touching.down)
            {
                this.player.setVelocityY(-330);
            }
        }

    }

    blockSetOptions(i, j){
        this.blocks[i][j].setInteractive();
        this.physics.add.collider(this.player, this.blocks[i][j]);
        this.blocks[i][j].refreshBody();
    }

    blockDestroy(i, j, sprite){
        // console.log('Блок ', this.blocks[i][j]);
        this.blocks[i][j].destroy();

        this.blocks[i][j] = this.physics.add.staticImage(j*this.blockSize*this.blockScale + this.startMatrixCoordinateX, i*this.blockSize*this.blockScale + this.startMatrixCoordinateY, 'blocks', sprite).setOrigin(0,0).setScale(this.blockScale);
        this.blocks[i][j].alpha = 0.0;
        this.blocks[i][j].refreshBody();

        // this.blocks[i][j] = this.setImage('blocks', 0);
        // console.log('Блок ', this.blocks[i][j]);
        // console.log('Мы в функции 1 ',i, ' ', j, ' ', sprite);
    }

    blockNew(i, j, sprite){
        console.log('Блок ', this.blocks[i][j]);
        if (this.blocks[i][j].alpha == 0.0){
            this.blocks[i][j] = this.physics.add.staticImage(j*this.blockSize*this.blockScale + this.startMatrixCoordinateX, i*this.blockSize*this.blockScale + this.startMatrixCoordinateY, 'blocks', sprite).setOrigin(0,0).setScale(this.blockScale);
            this.blocks[i][j].alpha = 1;
            // this.blocks[i][j].setInteractive();
            // this.physics.add.collider(this.player, this.blocks[i][j]);
            this.blocks[i][j].refreshBody();
            console.log('Мы в функции 3 ',i, ' ', j, ' ', sprite);
        }
        console.log('Мы в функции 2 ',i, ' ', j, ' ', sprite);
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
