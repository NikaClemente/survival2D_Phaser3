class EXPPlayer {
    constructor(scene){
        this.scene = scene;
        // console.log('1');
        this.expICO = this.scene.add.image(150, 500,"HpHbExMoney", 19).setScrollFactor(0).setInteractive();
        this.expLVL = 1;
        this.exp = 0;
        


        this.expICO.on('pointerover', function(pointer){ 
            this.expInfo = this.scene.add.text(150, 550, this.expLVL).setScrollFactor(0).setOrigin(0.5, 0.5);
            // this.expInfo1 = this.scene.add.text(150, 570, this.exp).setScrollFactor(0).setOrigin(0.5, 0.5);
        },this);

        this.expICO.on('pointerout', function(pointer){ 
            this.expInfo.destroy();
            // this.expInfo1.destroy();
        },this);
    }


    update() {
        

        this.expICO.setTexture('HpHbExMoney', this.persent(((this.exp/this.expLVLChange(this.expLVL))*100).toFixed()));

        if (this.exp >= this.expLVLChange(this.expLVL)){
            this.exp = this.exp - this.expLVLChange(this.expLVL);
            this.expLVL++;
            this.expICO.setTexture('HpHbExMoney', 19);
        }
        

    }

    expLVLChange(lvl){
        switch (lvl) {
            case 1:
                return 50;
            case 2:
                return 70;
            case 3:
                return 100;
            case 4:
                return 180;
            case 5:
                return 250;
            case 6:
                return 500;
            case 7:
                return 700;
            case 8:
                return 1000;
            case 9:
                return 1300;
            default:
                return 1500;
        }
    }

    persent(value){
        switch (true) {
            case (value >= 0 && value < 25):
                return 19;
            case (value >= 25 && value < 50):
                return 18;
            case (value >= 50 && value < 75):
                return 17;
            case (value >= 75 && value < 90):
                return 16;
            case (value >= 90 && value <= 100):
                return 15;
        }
    }
}