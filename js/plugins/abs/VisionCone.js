class VisionCone {
    constructor(range, direction, event = null) {
        this.range = range;
        this.direction = direction;
        this.event = event;
    }

    tiles() {
        const rawTiles = [];

        for (let row = 1; row <= this.range; row++) {
            const width = row * 2 + 1;
            const startX = -Math.floor(width / 2);

            for (let column = 0; column < width; column++) {
                const tile = this.rotate(startX + column, row);
                rawTiles.push(tile);
            }
        }

        if (!this.event) {
            return rawTiles;
        }

        return rawTiles.filter(tile =>
            this.hasLineOfSight(tile.x, tile.y)
        );
    }

    hasLineOfSight(relX, relY) {
        if (!this.event) {
            return true;
        }

        const x0 = this.event.x;
        const y0 = this.event.y;
        const x1 = x0 + relX;
        const y1 = y0 + relY;

        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);

        const sx = Math.sign(x1 - x0);
        const sy = Math.sign(y1 - y0);

        let x = x0;
        let y = y0;

        let ix = 0;
        let iy = 0;

        while (ix < dx || iy < dy) {
            const decision =
                (1 + 2 * ix) * dy -
                (1 + 2 * iy) * dx;

            if (decision === 0) {
                // A linha atravessa exatamente o canto
                // entre quatro células.
                const sideX = x + sx;
                const sideY = y + sy;

                // Se qualquer um dos tiles laterais bloquear
                // a visão, não permitimos enxergar pelo canto.
                if (
                    this.isBlocked(sideX, y) ||
                    this.isBlocked(x, sideY)
                ) {
                    return false;
                }

                x += sx;
                y += sy;

                ix++;
                iy++;
            } else if (decision < 0) {
                x += sx;
                ix++;
            } else {
                y += sy;
                iy++;
            }

            // Não permite que o raio atravesse tiles bloqueados,
            // incluindo o tile de destino.
            if (this.isBlocked(x, y)) {
                return false;
            }
        }

        return true;
    }

    isBlocked(mapX, mapY) {
        if (!$gameMap.isValid(mapX, mapY)) {
            return true;
        }

        // Bits de passagem do RPG Maker MZ:
        // 0x01 = baixo
        // 0x02 = esquerda
        // 0x04 = direita
        // 0x08 = cima
        const directions = [0x01, 0x02, 0x04, 0x08];

        // Considera o tile totalmente bloqueado somente quando
        // nenhuma das quatro direções permite passagem.
        return directions.every(direction =>
            !$gameMap.checkPassage(mapX, mapY, direction)
        );
    }

    rotate(x, y) {
        switch (this.direction) {
            case 2:
                return { x, y };

            case 4:
                return { x: -y, y: x };

            case 6:
                return { x: y, y: -x };

            case 8:
                return { x: -x, y: -y };

            default:
                return { x, y };
        }
    }

    contains(x, y) {
        return this.tiles().some(
            tile => tile.x === x && tile.y === y
        );
    }

    debugPassage(mapX, mapY) {
        const directions = {
            down: 0x01,
            left: 0x02,
            right: 0x04,
            up: 0x08
        };

        const passage = {};

        for (const [name, bit] of Object.entries(directions)) {
            passage[name] = $gameMap.checkPassage(
                mapX,
                mapY,
                bit
            );
        }

        const result = {
            position: { x: mapX, y: mapY },
            valid: $gameMap.isValid(mapX, mapY),
            passage,
            blocked: this.isBlocked(mapX, mapY),
            tiles: $gameMap.allTiles(mapX, mapY).map(tileId => ({
                id: tileId,
                flags: $gameMap.tilesetFlags()[tileId]
            }))
        };

        console.log("[VisionCone] Passage diagnostic:", result);

        return result;
    }
}