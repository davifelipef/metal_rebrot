class VisionCone {

    constructor(range, direction) {

        this.range = range;
        this.direction = direction;

    }


    tiles() {

        const tiles = [];


        for (let row = 1; row <= this.range; row++) {

            const width = row * 2 + 1;

            const startX =
                -Math.floor(width / 2);


            for (let column = 0; column < width; column++) {

                const tile =
                    this.rotate(
                        startX + column,
                        row
                    );

                tiles.push(tile);

            }

        }


        return tiles;

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

    contains(relativeX, relativeY) {
        return this.tiles().some(tile => tile.x === relativeX && tile.y === relativeY);
    }

}