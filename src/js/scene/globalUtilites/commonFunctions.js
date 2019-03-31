class CommonFunctions {
    constructor(scene){
        this.scene = scene;
    }

    setArray(length){
        let arr = [];
        for(let i = 0; i < length; i++){
            arr[i] = null;
        }
        return arr;
    }

    matrixArray(rows,columns){
        let arr = [];
        for(let i = 0; i < rows; i++){
            arr[i] = [];
            for(let j = 0; j<columns; j++){
            arr[i][j] = null;
            }
        }
        return arr;
    }

    inventarDisplay(inventarRows, inventarCols, inventar, inventarItems, inventarItemsCount){
        let x = inventar.x + 35;
        let y = inventar.y;

        for (let inventarRow = 0; inventarRow < inventarRows; inventarRow++) {
            for (let inventarCol = 0; inventarCol < inventarCols; inventarCol++) {
                
                if (this.inventarRowIdent(inventarRow) == 1){
                    y = inventar.y + 35;
                    this.inventarItemsSetFrame(inventarItems, inventarItemsCount, inventarRow, inventarCol, x, y)
                }

                if (this.inventarRowIdent(inventarRow) == 2){
                    y = inventar.y + 95;
                    this.inventarItemsSetFrame(inventarItems, inventarItemsCount, inventarRow, inventarCol, x, y)
                }

                if (this.inventarRowIdent(inventarRow) == 3){
                    y = inventar.y + 155;
                    this.inventarItemsSetFrame(inventarItems, inventarItemsCount, inventarRow, inventarCol, x, y)
                }
                // console.log(this.inventarItems[inventarRow][inventarCol]);
                inventarItems[inventarRow][inventarCol].on('pointerover', function(pointer){  
                    this.setTint(0xB6B8B7);
                },inventarItems[inventarRow][inventarCol]);
    
                inventarItems[inventarRow][inventarCol].on('pointerout', function(pointer){  
                    this.clearTint();
                },inventarItems[inventarRow][inventarCol]);
            }
        }


    }

    inventarItemsSetFrame(inventarItems, inventarItemsCount, inventarRow, inventarCol, x, y){
        if (inventarCol == 1){ x += 60; }
        if (inventarCol == 2){ x += 120; }
        inventarItems[inventarRow][inventarCol] = this.scene.add.image(x , y, 'blocks', 11).setOrigin(0.5, 0.5);
        inventarItems[inventarRow][inventarCol].setScale(0.65).setInteractive();
        inventarItems[inventarRow][inventarCol].setScrollFactor(0);
        inventarItems[inventarRow][inventarCol].visible = false;
        
        inventarItemsCount[inventarRow][inventarCol] = this.scene.add.text(x, y+10).setOrigin(0.5, 0.5);
        inventarItemsCount[inventarRow][inventarCol].setScrollFactor(0);
        inventarItemsCount[inventarRow][inventarCol].setColor('#000000').setFontStyle('bold');
        inventarItemsCount[inventarRow][inventarCol].visible = false;
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


}