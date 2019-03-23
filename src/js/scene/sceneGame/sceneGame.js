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
        this.spriteInfo();
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

        let startBlock = 0;
        let endBlock = 0;
        let lvlDirt = 3;
        let lvlRock = ((row-lvlDirt-1) * 0.8).toFixed();
        // console.log(lvlRock);
        this.kolIron = 0;
        this.kolGold = 0;
        this.kolDiamond = 0;
        this.kolBlocks = 0;
        
        { // Генерация и обработка
           let game = this;
            for (let i = 0; i < row; i++) {
                for (let j = 0; j < column; j++) {
                    this.kolBlocks++;
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
                            if (i > 0 && i <= lvlDirt) {startBlock = 1; endBlock = 1;}
                            if (i >= lvlDirt+1 && i < lvlRock) {startBlock = 2; endBlock = 4;}
                            if (i >= lvlRock && i < row) {startBlock = 5; endBlock = 6;}

                            this.blocks[i][j] = this.physics.add.staticImage(j*this.blockSize*this.blockScale + this.startMatrixCoordinateX, i*this.blockSize*this.blockScale + this.startMatrixCoordinateY, 'blocks', this.getRandomArbitrary(startBlock, endBlock)).setOrigin(0,0).setScale(this.blockScale);  
                            // console.log(this.spriteName(this.blocks[i][j].frame.name));
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


        this.gameStatistic(row, column, lvlDirt, lvlRock);    // Вся статистика (пересмотреть результаты... куда-то делись 10 блоков?!! Хм....)
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

    setArray(length){
        let arr = [];
        for(let i = 0; i < length; i++){
            arr[i] = null;
        }
        return arr;
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
        let block;
        let sprite = (Math.random() * (max - min) + min).toFixed();
        for (var key in this.blocksInfo) {
            if (this.blocksInfo[key].ID == sprite){
               block = this.blocksInfo[key];
            //    console.log('-----------------');
            //    console.log(block.Name, ' - ', block.SpawnRate);
            }
           
         }

        let rand;

        // if (block.SpawnRate == 1){
        //     rand = 1;
        // }else{
        //     rand = Math.random();
        // }
        
        // console.log('Значение рандома: ', rand);
        // if ( rand <= block.SpawnRate){
        if ( Math.random() <= block.SpawnRate && block.SpawnRate != 1){    
            if (block.Name == "Железо"){this.kolIron++};
            if (block.Name == "Золото"){this.kolGold++};
            if (block.Name == "Алмаз"){this.kolDiamond++};
            return sprite;
        }
        else{
            return min;
        }
        
    }

    spriteInfo(){
        this.blocksInfo = {
            grass: {
                ID: 0,
                Name: "Трава",
                SpawnRate: 1.0,
            },
            land: {
                ID: 1,
                Name: "Земля",
                SpawnRate: 1.0,
            },
            stone: {
                ID: 2,
                Name: "Камень",
                SpawnRate: 1.0,
            },
            iron: {
                ID: 3,
                Name: "Железо",
                SpawnRate: 0.5,
            },
            gold: {
                ID: 4,
                Name: "Золото",
                SpawnRate: 0.35,
            },
            durableStone: {
                ID: 5,
                Name: "Прочный камень",
                SpawnRate: 1.0,
            },
            diamond: {
                ID: 6,
                Name: "Алмаз",
                SpawnRate: 0.2,
            },
            obsidian: {
                ID: 7,
                Name: "Обсидиан",
                SpawnRate: 1.0,
            }
        } 
    }

    spriteName(sprite){
        for (var key in this.blocksInfo) {
            if (this.blocksInfo[key].ID == sprite){
               return this.blocksInfo[key].Name
            }
           
         }

    }

    gameStatistic(row, column, lvlDirt, lvlRock){
        console.log('======= Статистика по генерации =======');
        console.log('Всего блоков = ', this.kolBlocks);
        console.log('<------ Блоки ------>');
        console.log('Блоков травы ', row);
        console.log('Блоков земли ', (lvlDirt + 1) * column);
        console.log('Блоков камня ', (lvlRock - lvlDirt - 1) * column - (this.kolIron + this.kolGold));
        console.log('Блоков прочного камня ', (row - lvlRock - 1) * column - this.kolDiamond);
        console.log('Блоков супер прочного камня ', row);
        console.log('<------ Руды ------>');
        console.log('Руда железа = ', this.kolIron);
        console.log('Руда золота = ', this.kolGold);
        console.log('Руда алмазов = ', this.kolDiamond);
    }
}