class Inventar {
    constructor(scene){
        this.scene = scene;
        this.inventarIco = this.scene.add.image(WIDTH - 100, 500, 'inventarIco').setScrollFactor(0).setInteractive();
        this.emptySlots = this.scene.add.text(WIDTH - 100, 529).setScrollFactor(0).setOrigin(0.5, 0.5);
        this.emptySlots.setFontSize('10px');
        this.emptySlots.setColor('#000');
        this.inventar = this.scene.add.image(50, 130, 'inventar').setScrollFactor(0).setOrigin(0, 0);
        this.inventar.visible = false;
        
        this.inventarRows = 15;
        this.inventarCols = 3;
        this.inventarEnabledItems = 6;
        this.inventarButtons = this.scene.commonFunctions.setArray(6);

        let x;
        let y; 

        this.scene.input.keyboard.on('keydown_I', function () {
            this.inventar.visible = !this.inventar.visible;
            this.inventarItemsVisible();
            this.inventarButtonsVisible();
        }, this);

        this.inventarIco.on('pointerup', function(pointer){  
            if (pointer.buttons == 1){
                this.inventar.visible = !this.inventar.visible;
                this.inventarItemsVisible();
                this.inventarButtonsVisible();
            }
        },this);

        this.inventarIco.on('pointerover', function(pointer){  
            this.inventarIco.setTint(0xB6B8B7);
        },this);

        this.inventarIco.on('pointerout', function(pointer){  
            this.inventarIco.clearTint();
        },this);
        

        this.inventarItems = this.scene.commonFunctions.matrixArray(this.inventarRows, this.inventarCols);
        this.inventarItemsCount = this.scene.commonFunctions.matrixArray(this.inventarRows, this.inventarCols);

        this.buttonSelect = 1;

        this.scene.commonFunctions.inventarDisplay( this.inventarRows, 
                                                    this.inventarCols, 
                                                    this.inventar, 
                                                    this.inventarItems, 
                                                    this.inventarItemsCount );

        for (let inventarRow = 0; inventarRow < this.inventarRows; inventarRow++) {
            for (let inventarCol = 0; inventarCol < this.inventarCols; inventarCol++) {
                this.inventarItems[inventarRow][inventarCol].on('pointerdown', function(pointer){  
                    if (this.inventarItems[inventarRow][inventarCol].frame.name < 8){
                       console.log('Sprite (', this.scene.spriteName(this.inventarItems[inventarRow][inventarCol].frame.name),') = ', this.inventarItemsCount[inventarRow][inventarCol]._text);  
                    }
                    if (this.inventarItems[inventarRow][inventarCol].frame.name == 9){
                        this.inventarItems[inventarRow][inventarCol].setTexture('blocks', 8);
                        this.inventarEnabledItems++;
                        this.inventarEmptySlots();
                    }
                },this);
                
                
            }
        }

        this.inventarItemsDisabled();
        
        

        for (let inventarButton = 0; inventarButton < this.inventarButtons.length; inventarButton++) {
            x = this.inventar.x + 15;
            y = this.inventar.y + 205;
          
            this.inventarButtonsSetFrame(inventarButton, x, y);
            
            this.inventarButtons[inventarButton].on('pointerover', function(pointer){  
                this.setTint(0xB6B8B7);
                
                this.alpha = 0.5;
            },this.inventarButtons[inventarButton]);

            this.inventarButtons[inventarButton].on('pointerout', function(pointer){  
                this.inventarButtons[inventarButton].clearTint();
                this.inventarButtons[inventarButton].alpha = 0.1;
                this.inventarButtonsSelected();
            },this);

            this.inventarButtons[inventarButton].on('pointerdown', function(pointer){  
                this.inventarButtons[this.buttonSelect-1].clearTint();
                this.inventarButtons[this.buttonSelect-1].alpha = 0.1;
                this.buttonSelect = inventarButton+1;
                this.inventarButtonsSelected();
                this.inventarItemsVisibleFoButtonSelected();
            },this);
        }

        this.inventarEmptySlots();
    }


    inventarButtonsVisible(){
        for (let inventarButton = 0; inventarButton < this.inventarButtons.length; inventarButton++) {
            this.inventarButtons[inventarButton].visible = !this.inventarButtons[inventarButton].visible;
            this.inventarButtons[inventarButton].clearTint();
            this.inventarButtons[inventarButton].alpha = 0.1;
            this.inventarButtonsSelected();
        }
    }

    inventarButtonsSetFrame(inventarButton, x, y){
        let sprite = 10;
        if (inventarButton != 5){
            this.inventarButtons[inventarButton] = this.scene.add.image(x + 30 * inventarButton +0.5, y+0.5, 'blocks', sprite).setOrigin(0.5, 0.5);
            this.inventarButtons[inventarButton].setScale(0.435);
        }
        else {
            this.inventarButtons[inventarButton] = this.scene.add.image(x + 30 * inventarButton + 5 +0.5, y+0.5, 'blocks', sprite).setOrigin(0.5, 0.5);
            this.inventarButtons[inventarButton].setScale(0.60, 0.435);
        }
        
        this.inventarButtons[inventarButton].setInteractive();
        this.inventarButtons[inventarButton].setScrollFactor(0);
        this.inventarButtons[inventarButton].alpha = 0.1;
        this.inventarButtons[inventarButton].visible = false;
    }

    inventarButtonsSelected(){
        this.inventarButtons[this.buttonSelect-1].setTint(0x00FF2A);
        this.inventarButtons[this.buttonSelect-1].alpha = 0.3;
    }

    inventarItemsVisible(){
        for (let inventarRow = 0; inventarRow < this.inventarRows; inventarRow++) {
            for (let inventarCol = 0; inventarCol < this.inventarCols; inventarCol++) {
                if (this.buttonSelect == 1 && (inventarRow >= 0 && inventarRow < 3)){
                    this.inventarItems[inventarRow][inventarCol].visible = !this.inventarItems[inventarRow][inventarCol].visible;
                }
                this.inventarItemsCount[inventarRow][inventarCol].visible = !this.inventarItemsCount[inventarRow][inventarCol].visible;
                this.inventarEmptySlots();
            }
        }

    }
    
    inventarItemsVisibleFoButtonSelected(){
        for (let inventarRow = 0; inventarRow < this.inventarRows; inventarRow++) {
            for (let inventarCol = 0; inventarCol < this.inventarCols; inventarCol++) {
                if (this.buttonSelect == 1 && (inventarRow >= 0 && inventarRow < 3)){
                    this.inventarItems[inventarRow][inventarCol].visible = true;
                    this.inventarItemsCount[inventarRow][inventarCol].visible = true;
                }
                else if (this.buttonSelect == 2 && (inventarRow >= 3 && inventarRow < 6)){
                    this.inventarItems[inventarRow][inventarCol].visible = true;
                    this.inventarItemsCount[inventarRow][inventarCol].visible = true;
                }
                else if (this.buttonSelect == 3 && (inventarRow >= 6 && inventarRow < 9)){
                    this.inventarItems[inventarRow][inventarCol].visible = true;
                    this.inventarItemsCount[inventarRow][inventarCol].visible = true;
                }
                else if (this.buttonSelect == 4 && (inventarRow >= 9 && inventarRow < 12)){
                    this.inventarItems[inventarRow][inventarCol].visible = true;
                    this.inventarItemsCount[inventarRow][inventarCol].visible = true;
                }
                else if (this.buttonSelect == 5 && (inventarRow >= 12 && inventarRow < 15)){
                    this.inventarItems[inventarRow][inventarCol].visible = true;
                    this.inventarItemsCount[inventarRow][inventarCol].visible = true;
                }
                else {
                    this.inventarItems[inventarRow][inventarCol].visible = false;
                    this.inventarItemsCount[inventarRow][inventarCol].visible = false;
                }
                
            }
        }
    }

    inventarItemsDisabled(){
        let count = 0;
        for (let inventarRow = 0; inventarRow < this.inventarRows; inventarRow++) {
            for (let inventarCol = 0; inventarCol < this.inventarCols; inventarCol++) {
                count++;
                if (count > this.inventarEnabledItems){
                    this.inventarItems[inventarRow][inventarCol].setTexture('blocks', 9);
                }
            }
        }
    }

    inventarAddNewItem(sprite){
        let count = 0;
        for (let inventarRow = 0; inventarRow < this.inventarRows; inventarRow++) {
            for (let inventarCol = 0; inventarCol < this.inventarCols; inventarCol++) {
                    if (this.inventarItems[inventarRow][inventarCol].frame.name == sprite){
                        count = this.inventarItemsCount[inventarRow][inventarCol]._text;
                        count++;
                        this.inventarItemsCount[inventarRow][inventarCol].setText(count);
                        return;
                    } 
                    else if (this.inventarItems[inventarRow][inventarCol].frame.name == '8'){
                        this.inventarItems[inventarRow][inventarCol].setTexture('blocks', sprite);
                        this.inventarItemsCount[inventarRow][inventarCol].setText('1');
                        this.inventarEmptySlots();
                        return;
                    }
                // }
                
            }
        }
 
    }

    inventarEmptySlots(){
        let count = 0;
        for (let inventarRow = 0; inventarRow < this.inventarRows; inventarRow++) {
            for (let inventarCol = 0; inventarCol < this.inventarCols; inventarCol++) {
                if (this.inventarItems[inventarRow][inventarCol].frame.name != '9' && this.inventarItems[inventarRow][inventarCol].frame.name != '8'){
                    count++;
                }
            }
        }


        this.emptySlots.setText(count + '/' + this.inventarEnabledItems);
    }
}