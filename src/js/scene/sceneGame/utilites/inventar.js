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
        let inventarButtonsKol = 6;
        this.inventarButtons = [inventarButtonsKol];

        this.scene.input.keyboard.on('keydown_I', function () {
            this.inventar.visible = !this.inventar.visible;
            this.inventarItemsVisible();
            this.inventarButtonsVisible(inventarButtonsKol);
        }, this);

        this.inventarIco.on('pointerup', function(pointer){  
            if (pointer.buttons == 1){
                this.inventar.visible = !this.inventar.visible;
                this.inventarItemsVisible();
                this.inventarButtonsVisible(inventarButtonsKol);
            }
        },this);

        this.inventarIco.on('pointerover', function(pointer){  
            this.inventarIco.setTint(0xB6B8B7);
        },this);

        this.inventarIco.on('pointerout', function(pointer){  
            this.inventarIco.clearTint();
        },this);
        

        this.inventarItems = this.scene.matrixArray(this.inventarRows, this.inventarCols);
        this.inventarItemsCount = this.scene.matrixArray(this.inventarRows, this.inventarCols);

        let x = this.inventar.x + 35;
        let y = this.inventar.y;
        this.buttonSelect = 1;

        for (let inventarRow = 0; inventarRow < this.inventarRows; inventarRow++) {
            for (let inventarCol = 0; inventarCol < this.inventarCols; inventarCol++) {

                if (this.inventarRowIdent(inventarRow) == 1){
                    y = this.inventar.y + 35;
                    this.inventarItemsSetFrame(inventarRow, inventarCol, x, y)
                }

                if (this.inventarRowIdent(inventarRow) == 2){
                    y = this.inventar.y + 95;
                    this.inventarItemsSetFrame(inventarRow, inventarCol, x, y)
                }

                if (this.inventarRowIdent(inventarRow) == 3){
                    y = this.inventar.y + 155;
                    this.inventarItemsSetFrame(inventarRow, inventarCol, x, y)
                }

                this.inventarItems[inventarRow][inventarCol].on('pointerover', function(pointer){  
                    this.setTint(0xB6B8B7);
                    // console.log(inventarRow+1, ' - ', inventarCol+1);
                },this.inventarItems[inventarRow][inventarCol]);

                this.inventarItems[inventarRow][inventarCol].on('pointerout', function(pointer){  
                    this.clearTint();
                },this.inventarItems[inventarRow][inventarCol]);

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

        this.inventarItemsDis();

        for (let inventarButton = 0; inventarButton < inventarButtonsKol; inventarButton++) {
            x = this.inventar.x + 15;
            y = this.inventar.y + 205;
            
            // console.log(inventarButton);
            this.inventarButtonsSetFrame(inventarButton, x, y);
            
            this.inventarButtons[inventarButton].on('pointerover', function(pointer){  
                this.setTint(0xB6B8B7);
                // console.log(inventarButton+1);
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


    inventarButtonsVisible(inventarButtonsKol){
        for (let inventarButton = 0; inventarButton < inventarButtonsKol; inventarButton++) {
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
    

    inventarItemsSetFrame(inventarRow, inventarCol, x, y){
        if (inventarCol == 1){ x += 60; }
        if (inventarCol == 2){ x += 120; }
        this.inventarItems[inventarRow][inventarCol] = this.scene.add.image(x , y, 'blocks', 8).setOrigin(0.5, 0.5);
        this.inventarItems[inventarRow][inventarCol].setScale(0.65).setInteractive();
        this.inventarItems[inventarRow][inventarCol].setScrollFactor(0);
        this.inventarItems[inventarRow][inventarCol].visible = false;
        
        this.inventarItemsCount[inventarRow][inventarCol] = this.scene.add.text(x, y+10).setOrigin(0.5, 0.5);
        // this.inventarItemsCount[inventarRow][inventarCol].setScale(0.65);
        this.inventarItemsCount[inventarRow][inventarCol].setScrollFactor(0);
        this.inventarItemsCount[inventarRow][inventarCol].setColor('#000000').setFontStyle('bold');
        this.inventarItemsCount[inventarRow][inventarCol].visible = false;
    }

    inventarRowIdent(row){
        switch (row+1) {
            case 1:
                return 1;
            case 2:
                return 2;
            case 3:
                return 3;
            /////////////
            case 4:
                return 1;
            case 5:
                return 2;
            case 6:
                return 3;
            /////////////
            case 7:
                return 1;
            case 8:
                return 2;
            case 9:
                return 3;
            /////////////
            case 10:
                return 1;
            case 11:
                return 2;
            case 12:
                return 3;
            /////////////
            case 13:
                return 1;
            case 14:
                return 2;
            case 15:
                return 3;
            /////////////
            default:
                break;
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

    inventarItemsDis(){
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