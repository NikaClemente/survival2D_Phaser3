class MinimapCreate {
    constructor(scene, row, column, fpsCounter, hotBar, inventar, hpPlayer, hbPlayer, expPlayer, moneyPlayer){
        this.scene = scene;
        // console.log(this.minimap);
        this.minimap = this.scene.cameras.add(WIDTH-200, 10, 150, 100).setZoom(0.1).setName('mini');
            this.minimap.inputEnabled = false;
            this.minimap.setBounds((this.scene.blocks[0][0].x), -200, (this.scene.blocks[0][column-1].x + this.scene.blockSize*this.scene.blockScale * 2 + 37), (this.scene.blocks[row-1][0].y + this.scene.blockSize*this.scene.blockScale * 4 + 5));
            
            this.scene.input.keyboard.on('keydown_NUMPAD_FOUR', function () {
                this.minimap.scrollX -= 150;
            }, this);

            this.scene.input.keyboard.on('keydown_NUMPAD_SIX', function () {
                this.minimap.scrollX += 150;
            }, this);
            // console.log(fpsCounter.fpsText);
           this.minimap.ignore([
                hotBar.hotBar, 
                hotBar.hotBarItems, 
                hotBar.hotBarItemsCount, 
                fpsCounter.fpsText, 
                inventar.inventar,
                inventar.inventarIco,
                inventar.inventarItems,
                inventar.inventarItemsCount,
                hpPlayer.HP,
                hbPlayer.HB,
                expPlayer.expICO,
                moneyPlayer.money
            ]);
    }
}