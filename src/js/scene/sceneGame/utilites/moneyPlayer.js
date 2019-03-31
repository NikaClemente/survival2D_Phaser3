class MoneyPlayer {
    constructor(scene){
        this.scene = scene;
        // console.log('1');
        this.money = this.scene.add.image(60, 500,"HpHbExMoney", 10).setScrollFactor(0).setInteractive();
        this.moneyCounter = 0;

        this.money.on('pointerup', function(pointer){ 
            this.moneyCounter += 100; 
        },this);

        this.money.on('pointerover', function(pointer){ 
            this.moneyInfo = this.scene.add.text(60, 550, this.moneyCounter).setScrollFactor(0).setOrigin(0.5, 0.5);
            
        },this);

        this.money.on('pointerout', function(pointer){ 
            this.moneyInfo.destroy();
        },this);
    }


    update(time, delta) {
        
    }

}