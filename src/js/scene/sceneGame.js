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
                                    game.blockDestroy(i, j, this.frame.name);
                                }
                                if (pointer.buttons == 2){
                                    game.blockNew(i, j);
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
                                game.blockNew(i, j);
                            }
                        },this.blocks[i][j]);
                    }
                    
                } 
                
            } 
        }

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.setBounds((this.blocks[0][0].x), -200, (this.blocks[0][column-1].x + this.blockSize*this.blockScale * 2 + 37), (this.blocks[row-1][0].y + this.blockSize*this.blockScale * 4 + 5));
        this.cameras.main.setBounds((this.blocks[0][0].x), -200, (this.blocks[0][column-1].x + this.blockSize*this.blockScale * 2 + 37), (this.blocks[row-1][0].y + this.blockSize*this.blockScale * 4 + 5)).setName('main');

        this.cameras.main.startFollow(this.player, true);    // Главная камера закреплена за персонажем

        { // Mini map
            this.minimap = this.cameras.add(WIDTH-200, 10, 150, 100).setZoom(0.1).setName('mini');
            this.minimap.inputEnabled = false;
            //this.minimap.startFollow(this.player, true);    // Камера закреплена за персонажем
            this.minimap.setBounds((this.blocks[0][0].x), -200, (this.blocks[0][column-1].x + this.blockSize*this.blockScale * 2 + 37), (this.blocks[row-1][0].y + this.blockSize*this.blockScale * 4 + 5));
            // console.log(this.minimap);
            this.input.keyboard.on('keydown_NUMPAD_FOUR', function () {
                // console.log('NumPad 4');
                this.minimap.scrollX -= 150;
            }, this);

            this.input.keyboard.on('keydown_NUMPAD_SIX', function () {
                // console.log('NumPad 6');
                this.minimap.scrollX += 150;
            }, this);

        }
        
        
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
        

        { // hotBar
            let hotBar = this.add.image(HEIGHT/2 + 100, 500, 'hotBar').setScrollFactor(0);
            hotBar.visible = false;
            

            this.input.keyboard.on('keydown_NUMPAD_ZERO', function () {
                //console.log('NumPad 0');  // на ней будет хотбар персонажа (для начала :) )
                //console.log(hotBar);
                hotBar.visible = !hotBar.visible;

                for(let indexItem = 0; indexItem < 5; indexItem++){
                    this.hotBarItems[indexItem].visible = !this.hotBarItems[indexItem].visible;
                    this.hotBarItemsCount[indexItem].visible = !this.hotBarItemsCount[indexItem].visible;
                }

            }, this);

            this.hotBarItems = [5];
            this.hotBarItemsCount = [5];
            this.hotBarEnabledKey = 1;

            this.hotBarItems[0] = this.add.image(hotBar.x - 120, hotBar.y + 22, 'blocks', 8);
            this.hotBarItemsCount[0] = this.add.text(hotBar.x - 120, hotBar.y + 18);
            
            this.hotBarItems[1] = this.add.image(hotBar.x - 60, hotBar.y + 22, 'blocks', 8);
            this.hotBarItemsCount[1] = this.add.text(hotBar.x - 60, hotBar.y + 18);

            this.hotBarItems[2] = this.add.image(hotBar.x - 0, hotBar.y + 22, 'blocks', 8);
            this.hotBarItemsCount[2] = this.add.text(hotBar.x - 0, hotBar.y + 18);

            this.hotBarItems[3] = this.add.image(hotBar.x + 60, hotBar.y + 22, 'blocks', 8);
            this.hotBarItemsCount[3] = this.add.text(hotBar.x + 60, hotBar.y + 18);

            this.hotBarItems[4] = this.add.image(hotBar.x + 120, hotBar.y + 22, 'blocks', 8);
            this.hotBarItemsCount[4] = this.add.text(hotBar.x + 120, hotBar.y + 18);

            for(let indexItem = 0; indexItem < 5; indexItem++){
                this.hotBarItems[indexItem].setOrigin(0.5,1);
                this.hotBarItems[indexItem].setScale(0.65);
                this.hotBarItems[indexItem].setScrollFactor(0);
                this.hotBarItemsCount[indexItem].setScrollFactor(0);
                this.hotBarItemsCount[indexItem].setOrigin(0.5,1);
                this.hotBarItemsCount[indexItem].setColor('#000000').setFontStyle('bold');
                this.hotBarItems[indexItem].visible = false;
                this.hotBarItemsCount[indexItem].visible = false;
            }

            this.input.keyboard.on('keydown_ONE', function () {
                // console.log('1'); 
                this.hotBarEnabledKey = 1;
                this.hotBarSelect(this.hotBarEnabledKey);
            }, this);

            this.input.keyboard.on('keydown_TWO', function () {
                // console.log('2'); 
                this.hotBarEnabledKey = 2;
                this.hotBarSelect(this.hotBarEnabledKey);
            }, this);

            this.input.keyboard.on('keydown_THREE', function () {
                // console.log('3'); 
                this.hotBarEnabledKey = 3;
                this.hotBarSelect(this.hotBarEnabledKey);
            }, this);

            this.input.keyboard.on('keydown_FOUR', function () {
                // console.log('4');
                this.hotBarEnabledKey = 4; 
                this.hotBarSelect(this.hotBarEnabledKey);
            }, this);

            this.input.keyboard.on('keydown_FIVE', function () {
                // console.log('5'); 
                this.hotBarEnabledKey = 5;
                this.hotBarSelect(this.hotBarEnabledKey);
            }, this);
        }

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // console.log(Phaser.Input.Keyboard.KeyCodes);  // Все коды клавиатуры
        
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

    blockSetOptions(i, j){
        this.blocks[i][j].setInteractive();
        this.physics.add.collider(this.player, this.blocks[i][j]);
        this.blocks[i][j].refreshBody();
    }

    blockDestroy(i, j, sprite){
        this.blocks[i][j].setFrame(8);
        this.blocks[i][j].disableBody(false);
        this.hotBarSetFrame(sprite);
    }

    blockNew(i, j){
        let count = 0;
        // console.log('Блок ', this.blocks[i][j]);
        if ((this.blocks[i][j].frame.name == 8) && (this.hotBarItems[this.hotBarEnabledKey-1].frame.name != 8)){
            this.blocks[i][j].setFrame(this.hotBarItems[this.hotBarEnabledKey-1].frame.name);
            this.physics.add.existing(this.blocks[i][j]);
            // console.log(this.hotBarItemsCount[this.hotBarEnabledKey-1]._text);
            count = this.hotBarItemsCount[this.hotBarEnabledKey-1]._text;
            count--;
            if (count > 0){
                this.hotBarItemsCount[this.hotBarEnabledKey-1].setText(count);
            } else {
                this.hotBarItems[this.hotBarEnabledKey-1].setFrame(8);
                this.hotBarItemsCount[this.hotBarEnabledKey-1].setText('');
            }
            
            // console.log('Мы в функции 3 ',i, ' ', j, ' ', 5);
        }
        // console.log('Мы в функции 2 ',i, ' ', j, ' ', 5);
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

    hotBarSelect(selectedKey){
        this.hotBarSetAlpha();
                
        this.hotBarItems[selectedKey-1].alpha = 1;
        console.log('Sprite (', this.spriteName(this.hotBarItems[selectedKey-1].frame.name),') = ', this.hotBarItemsCount[selectedKey-1]._text); 
    }

    hotBarSetFrame(sprite){
        let count = 0;
        for ( let pos = 0; pos < this.hotBarItems.length; pos++){
            if (sprite == 8){
                break;
            }

            if (this.hotBarItems[pos].frame.name == sprite){
                // console.log('Внутри 1');
                count = this.hotBarItemsCount[pos]._text;
                count++;
                this.hotBarItemsCount[pos].setText(count);
                break;
            } 
            
            if (this.hotBarItems[pos].frame.name == '8'){
                this.hotBarItems[pos].setTexture('blocks', sprite);
                this.hotBarItemsCount[pos].setText('1');
                break;
            }  
 
        }
        this.hotBarSetAlpha();
        this.hotBarItems[0].alpha = 1;
    }

    hotBarSetAlpha(){
        for(let indexItem = 0; indexItem < 5; indexItem++){
            this.hotBarItems[indexItem].alpha = 0.7;
        } 
    }

    spriteName(sprite){
        switch (sprite) {
            case 0:
                return "Трава";
            case 1:
                return "Земля";
            case 2:
                return "Камень";
            case 3:
                return "Железо";
            case 4:
                return "Золото";
            case 5:
                return "Прочный камень";
            case 6:
                return "Алмаз";
            default:
                break;
        }
    }

}