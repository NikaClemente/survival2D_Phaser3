class FPSCounter {
    constructor(scene){
        this.scene = scene;
        // console.log('1');
        this.startTime = this.scene.time.now;
        this.endTime;
        this.fps = 0;
        this.fpsText = this.scene.add.text(20,20).setScrollFactor(0);
        // console.log(this.fpsText);
    }


    update(time, delta) {
        //console.log(this.fps);
        this.endTime = (time/1000).toFixed();
        this.fps++;
        if (this.endTime - (this.startTime/1000).toFixed() == 1){
            // console.log(this.fps);
            this.fpsText.setText('FPS: ' + this.fps);
            this.startTime = this.scene.time.now;
            this.fps = 0;
        }
    }
}