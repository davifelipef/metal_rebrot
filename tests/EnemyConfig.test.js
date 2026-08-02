import { describe, expect, it } from "vitest";
import { loadScript } from "./helpers/loadScript.js";

loadScript(
    "js/plugins/abs/EnemyConfig.js"
);

describe("EnemyConfig", () => {


    it("should read enemy vision from comments", () => {

        const comments = [
            "<abs_enemy>",
            "<vision:5>"
        ];


        const config = EnemyConfig.fromComments(comments);


        expect(config.isEnemy)
            .toBe(true);


        expect(config.vision)
            .toBe(5);

    });


});