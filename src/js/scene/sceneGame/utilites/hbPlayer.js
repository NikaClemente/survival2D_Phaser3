class HBPlayer {
    constructor(scene){
        this.scene = scene;
        // console.log('1');
        this.HB = this.scene.add.image(150, 410,"HpHbExMoney", 5).setScrollFactor(0).setInteractive();

        this.startTime = this.scene.time.now;
        this.endTime;

        this.HBCounter = 5;

    }


    update(time) {
        this.endTime = (time/1000).toFixed();
        
        if (this.endTime - (this.startTime/1000).toFixed() == 5){
            if (this.HBCounter < 9){
                this.HBCounter++;
                this.HB.setTexture('HpHbExMoney', this.HBCounter);
                this.startTime = this.scene.time.now;
            }
        }
    }
}