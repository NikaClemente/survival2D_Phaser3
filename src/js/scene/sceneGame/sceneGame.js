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
        this.load.image('inventarIco','src/img/inventarIco.png')
        this.load.image('inventar','src/img/inventar.png');
    }

    create() { 
        let row = 25;
        let column = 60;
        
        this.startMatrixCoordinateX = -100;
        this.startMatrixCoordinateY = 400;

        this.add.image(this.startMatrixCoordinateX, -200, 'backgroundGame').setOrigin(0,0).setScale(5,1);
        this.add.image( this.startMatrixCoordinateX, this.startMatrixCoordinateY, 'fonBackWhite').setOrigin(0, 0).setScale(5,3);
        let fonBackDirt = this.add.image( this.startMatrixCoordinateX, this.startMatrixCoordinateY, 'fonBackDirt').setOrigin(0, 0);
        fonBackDirt.alpha = 0.5;

        this.playerController = new PlayerController(this);

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
                            this.blocks[i][j] = this.physics.add.staticImage(j*this.blockSize*this.blockScale + this.startMatrixCoordinateX, i*this.blockSize*this.blockScale + this.startMatrixCoordinateY, 'blocks', this.getRandomArbitrary(1, this.blocksKoll-2)).setOrigin(0,0).setScale(this.blockScale);  
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

        this.fpsCounter = new FPSCounter(this);
        this.hotBar = new HotBar(this);
        this.inventar = new Inventar(this);
        this.minimap = new MinimapCreate(this, row, column, this.fpsCounter, this.hotBar, this.inventar);
        // this.minimap = new MinimapCreate(this, row, column);
        


        this.physics.world.setBounds((this.blocks[0][0].x), -200, (this.blocks[0][column-1].x + this.blockSize*this.blockScale * 2 + 37), (this.blocks[row-1][0].y + this.blockSize*this.blockScale * 4 + 5));
        this.cameras.main.setBounds((this.blocks[0][0].x), -200, (this.blocks[0][column-1].x + this.blockSize*this.blockScale * 2 + 37), (this.blocks[row-1][0].y + this.blockSize*this.blockScale * 4 + 5)).setName('main');

        this.cameras.main.startFollow(this.playerController.player, true);    // Главная камера закреплена за персонажем
    }

    update(time, delta) {
        this.fpsCounter.update(time, delta);
        this.playerController.update();
    }

    blockSetOptions(i, j){
        this.blocks[i][j].setInteractive();
        this.physics.add.collider(this.playerController.player, this.blocks[i][j]);
        this.blocks[i][j].refreshBody();
    }

    blockDestroy(i, j, sprite){
        this.blocks[i][j].setFrame(8);
        this.blocks[i][j].disableBody(false);
        this.hotBar.hotBarSetFrame(sprite);
    }

    blockNew(i, j){
        let count = 0;
        // console.log('Блок ', this.blocks[i][j]);
        if ((this.blocks[i][j].frame.name == 8) && (this.hotBar.hotBarItems[this.hotBar.hotBarEnabledKey-1].frame.name != 8)){
            this.blocks[i][j].setFrame(this.hotBar.hotBarItems[this.hotBar.hotBarEnabledKey-1].frame.name);
            this.physics.add.existing(this.blocks[i][j]);
            // console.log(this.hotBarItemsCount[this.hotBarEnabledKey-1]._text);
            count = this.hotBar.hotBarItemsCount[this.hotBar.hotBarEnabledKey-1]._text;
            count--;
            if (count > 0){
                this.hotBar.hotBarItemsCount[this.hotBar.hotBarEnabledKey-1].setText(count);
            } else {
                this.hotBar.hotBarItems[this.hotBar.hotBarEnabledKey-1].setFrame(8);
                this.hotBar.hotBarItemsCount[this.hotBar.hotBarEnabledKey-1].setText('');
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