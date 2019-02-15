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
    }

    create() {
        let BG = this.add.image(0, 0, 'backgroundGame').setOrigin(0,0);
        
        let row = 6;
        let column = 30;

        this.blocks = this.matrixArray(row, column);
        console.log(this.blocks);

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < column; j++) {
                if (i == 0){
                    this.blocks[0][j] = this.add.sprite(j*this.blockSize*this.blockScale - 100, i*this.blockSize*this.blockScale + 400, 'blocks', 0).setOrigin(0,0).setScale(this.blockScale);  ;
                }
                else{
                    this.blocks[i][j] = this.add.sprite(j*this.blockSize*this.blockScale - 100, i*this.blockSize*this.blockScale + 400, 'blocks', this.getRandomArbitrary(1,13)).setOrigin(0,0).setScale(this.blockScale);  
                }
            } 
            
        }

        // for (let i = 0; i < row; i++) {
        //     for (let j = 0; j < column; j++) {
        //         let sprite = this.add.sprite(j*this.blockSize*this.blockScale - 100, i*this.blockSize*this.blockScale + 400, 'blocks', this.blocks[i][j]).setOrigin(0,0).setScale(this.blockScale);  
        //     } 
        // }

        this.cursors = this.input.keyboard.createCursorKeys();
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });


        this.player = this.add.sprite(50, 400, 'player', 1).setOrigin(0,1).setScale(2);
    
        // this.blocks.on('pointerup', function () {
        //     this.blocks.destroy();
        // }, this);

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

        if (this.player.x > (WIDTH - WIDTH/3)) {

        }
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
