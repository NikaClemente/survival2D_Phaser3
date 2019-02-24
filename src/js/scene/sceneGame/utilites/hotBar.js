class HotBar {
    constructor(scene){
        this.scene = scene;
        let hotBar = this.scene.add.image(HEIGHT/2 + 100, 500, 'hotBar').setScrollFactor(0);
        hotBar.visible = false;
        

        this.scene.input.keyboard.on('keydown_NUMPAD_ZERO', function () {
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

        this.hotBarItems[0] = this.scene.add.image(hotBar.x - 120, hotBar.y + 22, 'blocks', 8);
        this.hotBarItemsCount[0] = this.scene.add.text(hotBar.x - 120, hotBar.y + 18);
        
        this.hotBarItems[1] = this.scene.add.image(hotBar.x - 60, hotBar.y + 22, 'blocks', 8);
        this.hotBarItemsCount[1] = this.scene.add.text(hotBar.x - 60, hotBar.y + 18);

        this.hotBarItems[2] = this.scene.add.image(hotBar.x - 0, hotBar.y + 22, 'blocks', 8);
        this.hotBarItemsCount[2] = this.scene.add.text(hotBar.x - 0, hotBar.y + 18);

        this.hotBarItems[3] = this.scene.add.image(hotBar.x + 60, hotBar.y + 22, 'blocks', 8);
        this.hotBarItemsCount[3] = this.scene.add.text(hotBar.x + 60, hotBar.y + 18);

        this.hotBarItems[4] = this.scene.add.image(hotBar.x + 120, hotBar.y + 22, 'blocks', 8);
        this.hotBarItemsCount[4] = this.scene.add.text(hotBar.x + 120, hotBar.y + 18);

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

        this.scene.input.keyboard.on('keydown_ONE', function () {
            // console.log('1'); 
            this.hotBarEnabledKey = 1;
            this.hotBarSelect(this.hotBarEnabledKey);
        }, this);

        this.scene.input.keyboard.on('keydown_TWO', function () {
            // console.log('2'); 
            this.hotBarEnabledKey = 2;
            this.hotBarSelect(this.hotBarEnabledKey);
        }, this);

        this.scene.input.keyboard.on('keydown_THREE', function () {
            // console.log('3'); 
            this.hotBarEnabledKey = 3;
            this.hotBarSelect(this.hotBarEnabledKey);
        }, this);

        this.scene.input.keyboard.on('keydown_FOUR', function () {
            // console.log('4');
            this.hotBarEnabledKey = 4; 
            this.hotBarSelect(this.hotBarEnabledKey);
        }, this);

        this.scene.input.keyboard.on('keydown_FIVE', function () {
            // console.log('5'); 
            this.hotBarEnabledKey = 5;
            this.hotBarSelect(this.hotBarEnabledKey);
        }, this);

    
    }

    hotBarSelect(selectedKey){
        this.hotBarSetAlpha();
                
        this.hotBarItems[selectedKey-1].alpha = 1;
        console.log('Sprite (', this.scene.spriteName(this.hotBarItems[selectedKey-1].frame.name),') = ', this.hotBarItemsCount[selectedKey-1]._text); 
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
}