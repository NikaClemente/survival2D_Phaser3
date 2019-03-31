class HPPlayer {
    constructor(scene){
        this.scene = scene;
        // console.log('1');
        this.HP = this.scene.add.image(60, 410,"HpHbExMoney", 0).setScrollFactor(0).setInteractive();

        this.startTime = this.scene.time.now;
        this.endTime;

        this.HPCounter = 0;

        
    }


    update(time) {      
        this.endTime = (time/1000).toFixed();
        if (this.scene.hbPlayer.HB.frame.name == 9){
            if (this.endTime - (this.startTime/1000).toFixed() == 10){
                // console.log(this.scene.hbPlayer.HB.frame.name);
                if (this.HPCounter < 4){
                    this.HPCounter++;
                    this.HP.setTexture('HpHbExMoney', this.HPCounter);
                    
                }
                this.startTime = this.scene.time.now;
            }
            
        }
        else {
            this.startTime = this.scene.time.now;
        }
    }
}