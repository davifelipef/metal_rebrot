class VisionVisualizer {
    static initialize() {
        this._sprites = [];
        this._visionLayer = null; // Armazena a camada
    }

    static clear() {
        // Remove apenas os sprites dos cones, não a camada inteira
        for (const sprite of this._sprites) {
            sprite.destroy();
        }
        this._sprites = [];
    }

    static draw(event, cone, spriteset) {
        // 1. Garante que a camada exista e esteja no lugar certo
        this.ensureVisionLayer(spriteset);

        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        const tiles = cone.tiles();

        for (const tile of tiles) {
            const bitmap = new Bitmap(tileWidth, tileHeight);
            // Cor vermelha semi-transparente para o cone
            bitmap.fillRect(0, 0, tileWidth, tileHeight, "rgba(255, 0, 0, 0.35)");

            const sprite = new Sprite(bitmap);
            sprite._event = event;
            sprite._offsetX = tile.x;
            sprite._offsetY = tile.y;

            // Define o ponto de origem no centro do tile para facilitar o posicionamento
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;

            this.updateSpritePosition(sprite);

            this._visionLayer.addChild(sprite);
            this._sprites.push(sprite);
        }
    }

    // Nova função para gerenciar a criação e posicionamento da camada
    static ensureVisionLayer(spriteset) {
        if (!this._visionLayer || !this._visionLayer.parent) {
            this._visionLayer = new Sprite();
            
            // Adiciona ao spriteset (Cenário), não ao tilemap.
            // Isso evita problemas de Z-index complexos do tilemap.
            spriteset.addChild(this._visionLayer);
            
            // Define o Z alto o suficiente para ficar acima dos tiles, 
            // mas o RPG Maker MZ gerencia a ordem dos personagens separadamente.
            // Z=1 geralmente coloca acima da maioria dos tiles de chão/camada baixa.
            this._visionLayer.z = 1; 

            console.log("Vision Layer created and added to Spriteset.");
        }
    }

    static updateSpritePosition(sprite) {
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();

        // Posição no mapa (em tiles)
        const mapX = sprite._event.x + sprite._offsetX;
        const mapY = sprite._event.y + sprite._offsetY;

        // Converte coordenada do mapa para coordenada de tela ajustada (Scroll)
        // Como a camada é filha do Spriteset (que não rola), precisamos ajustar.
        sprite.x = $gameMap.adjustX(mapX) * tileWidth + tileWidth / 2;
        sprite.y = $gameMap.adjustY(mapY) * tileHeight + tileHeight / 2;
        
        // Esconde o sprite se ele estiver fora da tela (otimização)
        sprite.visible = sprite.x >= -tileWidth && sprite.x <= Graphics.width + tileWidth &&
                         sprite.y >= -tileHeight && sprite.y <= Graphics.height + tileHeight;
    }

    static update() {
        if (!this._visionLayer) return;
        for (const sprite of this._sprites) {
            this.updateSpritePosition(sprite);
        }
    }

    static refresh(event, cone, spriteset) {
        // 1. Remove os sprites antigos do inimigo
        this._sprites = this._sprites.filter(sprite => {
            if (sprite._event === event) {
                sprite.parent?.removeChild(sprite);
                sprite.destroy();
                return false; // Remove da lista de sprites
            }
            return true; // Mantém os sprites dos outros inimigos
        });

        // 2. Desenha o novo cone com as coordenadas/direção atualizadas
        this.draw(event, cone, spriteset);
    }
}

VisionVisualizer.initialize();