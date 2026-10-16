class VisionVisualizer {
    static initialize() {
        this._graphicsMap = new Map();
        this._visionLayer = null;
    }

    static removeFromParentSafely(displayObject) {
        if (!displayObject) {
            return;
        }

        const parent = displayObject.parent;

        // Uma cena anterior pode já ter destruído o contêiner.
        if (!parent || !Array.isArray(parent.children)) {
            return;
        }

        if (parent.children.includes(displayObject)) {
            try {
                parent.removeChild(displayObject);
            } catch (error) {
                // A limpeza não deve interromper a troca de cena.
            }
        }
    }

    static destroyGraphicsSafely(graphics) {
        if (!graphics) {
            return;
        }

        // Evita destruir novamente um PIXI.Graphics cujo
        // recurso interno já tenha sido destruído.
        if (!graphics.geometry || graphics._destroyed) {
            return;
        }

        this.removeFromParentSafely(graphics);

        try {
            graphics.destroy();
        } catch (error) {
            // O recurso pode ter sido destruído pela cena
            // durante a transição para outra tela.
        }
    }

    static clear() {
        if (!this._graphicsMap) {
            this.initialize();
            return;
        }

        for (const graphics of this._graphicsMap.values()) {
            this.destroyGraphicsSafely(graphics);
        }

        this._graphicsMap.clear();

        // Remove a camada antiga da cena, se ela ainda existir.
        if (this._visionLayer) {
            this.removeFromParentSafely(this._visionLayer);
        }

        // A próxima chamada de draw() criará uma nova camada
        // vinculada ao spriteset atual.
        this._visionLayer = null;
    }

    static ensureVisionLayer(spriteset) {
        if (!spriteset) {
            return;
        }

        const layerIsUsable =
            this._visionLayer &&
            !this._visionLayer._destroyed &&
            this._visionLayer.parent === spriteset;

        if (!layerIsUsable) {
            this._visionLayer = new Sprite();
            this._visionLayer.z = 1;
            spriteset.addChild(this._visionLayer);
        }
    }

    static draw(event, cone, spriteset) {
        if (!spriteset || !cone) {
            return;
        }

        this.ensureVisionLayer(spriteset);

        let graphics = this._graphicsMap.get(event);

        // Não reutiliza objetos gráficos destruídos.
        if (
            graphics &&
            (!graphics.geometry || graphics._destroyed)
        ) {
            this._graphicsMap.delete(event);
            graphics = null;
        }

        if (!graphics) {
            graphics = new PIXI.Graphics();
            graphics._event = event;

            this._visionLayer.addChild(graphics);
            this._graphicsMap.set(event, graphics);
        } else if (graphics.parent !== this._visionLayer) {
            this._visionLayer.addChild(graphics);
        }

        graphics._cone = cone;

        this.redrawCone(graphics);
        this.updateGraphicsPosition(graphics);
    }

    static redrawCone(graphics) {
        if (!graphics || !graphics.geometry || !graphics._cone) {
            return;
        }

        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        const tiles = graphics._cone.tiles();

        // Limpa os desenhos anteriores sem recriar o objeto.
        graphics.clear();
        graphics.beginFill(0xFF0000, 0.35);

        for (const tile of tiles) {
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
        if (
            !graphics ||
            !graphics.geometry ||
            !graphics._event
        ) {
            return;
        }

        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        const event = graphics._event;

        graphics.x = $gameMap.adjustX(event.x) * tileWidth;
        graphics.y = $gameMap.adjustY(event.y) * tileHeight;
    }

    static refresh(event, cone, spriteset) {
        const graphics = this._graphicsMap.get(event);

        if (
            graphics &&
            graphics.geometry &&
            !graphics._destroyed &&
            graphics.parent === this._visionLayer
        ) {
            graphics._cone = cone;

            this.redrawCone(graphics);
            this.updateGraphicsPosition(graphics);
        } else {
            this.draw(event, cone, spriteset);
        }
    }

    static update() {
        if (!this._visionLayer || this._visionLayer._destroyed) {
            return;
        }

        for (const graphics of this._graphicsMap.values()) {
            this.updateGraphicsPosition(graphics);
        }
    }
}

VisionVisualizer.initialize();