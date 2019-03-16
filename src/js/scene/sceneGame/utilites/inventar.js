class Inventar {
    constructor(scene){
        this.scene = scene;
        this.inventarIco = this.scene.add.image(WIDTH - 100, 500, 'inventarIco').setScrollFactor(0).setInteractive();
        this.emptySlots = this.scene.add.text(WIDTH - 100, 529, 'error').setScrollFactor(0).setOrigin(0.5, 0.5);
        this.emptySlots.setFontSize('10px');
        this.emptySlots.setColor('#000');
        this.inventar = this.scene.add.image(50, 130, 'inventar').setScrollFactor(0).setOrigin(0, 0);
        this.inventar.visible = false;
        

        this.scene.input.keyboard.on('keydown_I', function () {
            this.inventar.visible = !this.inventar.visible;
        }, this);

        this.inventarIco.on('pointerup', function(pointer){  
            if (pointer.buttons == 1){
                this.inventar.visible = !this.inventar.visible;
            }
        },this);

        this.inventarIco.on('pointerover', function(pointer){  
            this.inventarIco.setTint(0xB6B8B7);
        },this);

        this.inventarIco.on('pointerout', function(pointer){  
            this.inventarIco.clearTint();
        },this);
        
        
        /*
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
        /*/
    
    }

    update(){
        
    }

    // hotBarSetFrame(sprite){
    //     let count = 0;
    //     for ( let pos = 0; pos < this.hotBarItems.length; pos++){
    //         if (sprite == 8){
    //             break;
    //         }

    //         if (this.hotBarItems[pos].frame.name == sprite){
    //             // console.log('Внутри 1');
    //             count = this.hotBarItemsCount[pos]._text;
    //             count++;
    //             this.hotBarItemsCount[pos].setText(count);
    //             break;
    //         } 
            
    //         if (this.hotBarItems[pos].frame.name == '8'){
    //             this.hotBarItems[pos].setTexture('blocks', sprite);
    //             this.hotBarItemsCount[pos].setText('1');
    //             break;
    //         }  
 
    //     }
    //     this.hotBarSetAlpha();
    //     this.hotBarItems[0].alpha = 1;
    // }

    // hotBarSetAlpha(){
    //     for(let indexItem = 0; indexItem < 5; indexItem++){
    //         this.hotBarItems[indexItem].alpha = 0.7;
    //     } 
    // }
}