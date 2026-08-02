import { describe, expect, it } from "vitest";
import { loadScript } from "./helpers/loadScript.js";

loadScript(
    "js/plugins/abs/VisionCone.js"
);

describe("VisionCone", () => {

    it("should create a centered triangular vision area", () => {

        const cone = new VisionCone(5);

        const tiles = cone.tiles();

        expect(tiles).toHaveLength(35);

    });

    it("should create a vision cone facing down", () => {

        const cone = new VisionCone(5, 2);

        expect(cone.direction).toBe(2);

    });

    it("should start centered when facing down", () => {

        const cone = new VisionCone(5, 2);

        expect(cone.tiles()[0]).toEqual({
            x: -1,
            y: 1
        });

    });

    it("should create a centered cone", () => {

        const cone = new VisionCone(5);

        const tiles = cone.tiles();


        expect(tiles.length).toBe(35);


        expect(
            tiles.filter(tile => tile.y === 1)
        ).toEqual([
            { x: -1, y: 1 },
            { x: 0, y: 1 },
            { x: 1, y: 1 }
        ]);


        expect(
            tiles.filter(tile => tile.y === 2)
        ).toEqual([
            { x: -2, y: 2 },
            { x: -1, y: 2 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 }
        ]);

    });

    it("should rotate vision cone when facing up", () => {

        const cone = new VisionCone(5, 8);


        expect(
            cone.tiles()[0]
        ).toEqual({
            x: -1,
            y: -1
        });


    });

    it("should rotate vision cone when facing right", () => {

        const cone = new VisionCone(5, 6);


        expect(
            cone.tiles()[0]
        ).toEqual({
            x: 1,
            y: -1
        });


    });

    it("should rotate vision cone when facing left", () => {

        const cone = new VisionCone(5, 4);


        expect(
            cone.tiles()[0]
        ).toEqual({
            x: -1,
            y: -1
        });


    });

    it("should detect player inside vision cone", () => {

        const cone = new VisionCone(5, 2);

        expect(
            cone.contains(0, 3)
        ).toBe(true);

    });

    it("should not detect player outside vision cone", () => {

        const cone = new VisionCone(5, 2);

        expect(
            cone.contains(10, 10)
        ).toBe(false);

    });

});