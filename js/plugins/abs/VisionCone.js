class VisionCone {
    constructor(range, direction, event = null) {
        this.range = range;
        this.direction = direction;
        this.event = event;
    }

    tiles() {
        const rawTiles = [];

        // 1. Gera os tiles teóricos (relativos ao evento: x, y)
        for (let row = 1; row <= this.range; row++) {
            const width = row * 2 + 1;
            const startX = -Math.floor(width / 2);

            for (let column = 0; column < width; column++) {
                const tile = this.rotate(startX + column, row);
                rawTiles.push(tile);
            }
        }

        // Se não houver evento associado, retorna a geometria pura
        if (!this.event) return rawTiles;

        // 2. Filtra apenas os tiles com linha de visão livre (Line of Sight)
        return rawTiles.filter(tile => this.hasLineOfSight(tile.x, tile.y));
    }

    // Algoritmo DDA para Raycasting preciso no Grid
    hasLineOfSight(relX, relY) {
        // Coordenadas absolutas no mapa
        const x0 = this.event.x;
        const y0 = this.event.y;
        const x1 = x0 + relX;
        const y1 = y0 + relY;

        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);

        let x = x0;
        let y = y0;

        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;

        let err = dx - dy;

        while (true) {
            if (x === x1 && y === y1) {
                return !this.isBlocked(x, y);
            }

            // Pula o teste na posição de origem (onde o próprio inimigo está pisando)
            if (x !== x0 || y !== y0) {
                if (this.isBlocked(x, y)) {
                    return false; // Bloqueia a visão
                }
            }

            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }

            // Teste de segurança no meio do caminho
            if (x !== x1 || y !== y1) {
                if (this.isBlocked(x, y)) {
                    return false;
                }
            }
        }
    }

    // Checa se o tile no mapa (x, y) é impassável no RPG Maker MZ
    isBlocked(mapX, mapY) {
        if (!$gameMap.isValid(mapX, mapY)) {
            return true;
        }

        const flags = $gameMap.tilesetFlags();
        const tileIds = $gameMap.allTiles(mapX, mapY);

        for (const tileId of tileIds) {
            if (tileId === 0) {
                continue;
            }

            const flag = flags[tileId];

            if (flag === undefined) {
                continue;
            }

            // Tiles com a propriedade ★ não determinam a passagem.
            if ((flag & 0x10) !== 0) {
                continue;
            }

            // As quatro direções bloqueadas indicam um tile X.
            if ((flag & 0x0f) === 0x0f) {
                return true;
            }

            // O primeiro tile relevante determina a passagem.
            return false;
        }

        return false;
    }

    rotate(x, y) {
        switch (this.direction) {
            case 2: // Baixo
                return { x, y };
            case 4: // Esquerda
                return { x: -y, y: x };
            case 6: // Direita
                return { x: y, y: -x };
            case 8: // Cima
                return { x: -x, y: -y };
            default:
                return { x, y };
        }
    }

    contains(x, y) {
        return this.tiles().some(tile => tile.x === x && tile.y === y);
    }

    debugPassage(mapX, mapY) {
        const result = {
            position: { x: mapX, y: mapY },
            valid: $gameMap.isValid(mapX, mapY),
            passage: $gameMap.checkPassage(mapX, mapY, 0x0f),
            tiles: $gameMap.allTiles(mapX, mapY).map(tileId => ({
                id: tileId,
                flags: $gameMap.tilesetFlags()[tileId],
                blocked: !$gameMap.checkPassage(mapX, mapY, 0x0f)
            }))
        };

        console.log("[VisionCone] Passage diagnostic:", result);

        return result;
    }
}