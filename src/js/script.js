game = new Phaser.Game({
    width: 400,                 // Ширина
    height: 300,                // Высота
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
});

function preload() {
    this.load.image('ball','src/img/ball.png'); 
    this.load.image('star','src/img/star.png'); 
    this.load.image('background','src/img/space.jpg');  
    
    OBJECT_SIZE = 10;   // Размер объекта 
    WIDTH = this.cameras.main.width;
    HEIGHT = this.cameras.main.height;
}

function create() {
    BG = this.add.image(70, 70, 'background');
    // BALL = this.add.image(WIDTH/2, -10, 'ball');

    randX = OBJECT_SIZE + Math.random() * (WIDTH - OBJECT_SIZE * 2);
    randY = OBJECT_SIZE + Math.random() * (HEIGHT - OBJECT_SIZE * 2);
    
    STAR = this.add.image(randX, randY, 'star');

    // TX = 200;
    // TY = 150;

    SEC = 10;
    gameOver = false;

    // this.input.on('pointermove', function(pointer){
    //     TX = pointer.x;
    //     TY = pointer.y;
    // });
    
    game = this;
    timer = SEC;
    counter = 0;


    this.input.on('pointerdown', function(pointer){
        // game.add.image(pointer.x, pointer.y, 'ball');
        if ((pointer.x - randX < OBJECT_SIZE) && (pointer.y - randY < OBJECT_SIZE)) {
            STAR.destroy();
            if (!gameOver){
                counter+=1;

                randX = OBJECT_SIZE + Math.random() * (WIDTH - OBJECT_SIZE * 2);
                randY = OBJECT_SIZE + Math.random() * (HEIGHT - OBJECT_SIZE * 2);
        
                STAR = game.add.image(randX, randY, 'star');
            }  
        } 
        else if (!gameOver) {
            if (counter > 0) counter--;
        }
    });

    textGlobalScope = this.add.text(10, 10, 'Время:');
    textGlobalScope.setFontFamily('Arial');
    textGlobalScope.setColor('#fff');
    textGlobalScope.setFontSize(14);

    textStarScope = this.add.text(10, 25, 'Звёзды:');
    textStarScope.setFontFamily('Arial');
    textStarScope.setColor('#fff');
    textStarScope.setFontSize(14);
    
    timeText = this.add.text(70, 11, timer);
    timeText.setFontSize(14);

    counterText = this.add.text(70, 26, counter);
    counterText.setFontSize(14);

    resultText = this.add.text(WIDTH/2-140, HEIGHT/2);
    resultText.setFontSize(24);
}

function update(time, delta) {
    // timer = (time/1000).toFixed();
    if (timer > 0){
        timer = SEC;
        timer -= (time/1000).toFixed();
        timeText.destroy();
        timeText = this.add.text(70, 11, timer);

        counterText.destroy();
        counterText = this.add.text(70, 26, counter);  
    }
    else {
        gameOver = true;
        STAR.destroy();
        textGlobalScope.destroy();
        textStarScope.destroy();
        timeText.destroy();
        counterText.destroy();

        resultText.setText('Вы набрали ' + counter + ' звёзд'); 
    }
    
    // BALL.x += (TX - BALL.x) / 20;
    // BALL.y += (TY - BALL.y) / 20;
}


