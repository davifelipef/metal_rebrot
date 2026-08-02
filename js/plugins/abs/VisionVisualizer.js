class VisionVisualizer {
    static initialize() {
        this._graphicsMap = new Map(); // Associa cada Evento a 1 PIXI.Graphics
        this._visionLayer = null;
    }

    static clear() {
        for (const [event, graphics] of this._graphicsMap.entries()) {
            graphics.destroy();
        }
        this._graphicsMap.clear();
    }

    static ensureVisionLayer(spriteset) {
        if (!this._visionLayer || !this._visionLayer.parent) {
            this._visionLayer = new Sprite();
            spriteset.addChild(this._visionLayer);
            this._visionLayer.z = 1;
        }
    }

    static draw(event, cone, spriteset) {
        this.ensureVisionLayer(spriteset);

        let graphics = this._graphicsMap.get(event);
        if (!graphics) {
            graphics = new PIXI.Graphics();
            graphics._event = event;
            this._visionLayer.addChild(graphics);
            this._graphicsMap.set(event, graphics);
        }

        graphics._cone = cone;
        this.redrawCone(graphics);
        this.updateGraphicsPosition(graphics);
    }

    static redrawCone(graphics) {
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        const tiles = graphics._cone.tiles();

        // Limpa desenhos anteriores sem recriar objetos na memória
        graphics.clear();
        graphics.beginFill(0xFF0000, 0.35); // Vermelho com 35% de opacidade

        for (const tile of tiles) {
            // Desenha os retângulos relativos ao ponto de origem do evento (0,0)
            graphics.drawRect(
                tile.x * tileWidth,
                tile.y * tileHeight,
                tileWidth,
                tileHeight
            );
        }

        graphics.endFill();
    }

    static updateGraphicsPosition(graphics) {
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        const event = graphics._event;

        // Posição base do evento ajustada para a tela
        graphics.x = $gameMap.adjustX(event.x) * tileWidth;
        graphics.y = $gameMap.adjustY(event.y) * tileHeight;
    }

    static refresh(event, cone, spriteset) {
        const graphics = this._graphicsMap.get(event);
        if (graphics) {
            graphics._cone = cone;
            this.redrawCone(graphics);
            this.updateGraphicsPosition(graphics);
        } else {
            this.draw(event, cone, spriteset);
        }
    }

    static update() {
        if (!this._visionLayer) return;
        for (const graphics of this._graphicsMap.values()) {
            this.updateGraphicsPosition(graphics);
        }
    }
}

VisionVisualizer.initialize();