/*:
 * @target MZ
 * @plugindesc ABS Core
 * @author Davi Felipe
 *
 * @param debugVision
 * @text Mostrar Cone de Visão
 * @type boolean
 * @default true
 * @desc Exibe as caixas vermelhas do cone de visão para testes/desenvolvimento.
 */

// Flag global configurável diretamente no código ou via parâmetros do plugin
window.ABS_DEBUG_VISION = true; 

(() => {
    console.log("ABS Core loaded");

    const pluginName = "ABS_Core";
    const parameters = PluginManager.parameters(pluginName);
    if (parameters["debugVision"] !== undefined) {
        window.ABS_DEBUG_VISION = parameters["debugVision"] === "true";
    }

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        ABS_Core.scanEnemies();
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        ABS_Core.update();
        if (window.ABS_DEBUG_VISION) {
            VisionVisualizer.update();
        }
    };

    window.ABS_Core = {
        _enemies: [],

        scanEnemies() {
            VisionVisualizer.clear();
            this._enemies = [];

            $gameMap.events().forEach(event => {
                const comments = event.event().pages[0].list
                    .filter(cmd => cmd.code === 108 || cmd.code === 408)
                    .map(cmd => cmd.parameters[0]);

                const config = EnemyConfig.fromComments(comments);

                if (config.isEnemy) {
                    const cone = new VisionCone(config.vision, event.direction());

                    this._enemies.push({
                        event: event,
                        config: config,
                        x: event.x,
                        y: event.y,
                        direction: event.direction(),
                        isChasing: false
                    });

                    // Desenha o visual apenas se a flag estiver ligada
                    if (window.ABS_DEBUG_VISION) {
                        VisionVisualizer.draw(
                            event,
                            cone,
                            SceneManager._scene._spriteset
                        );
                    }
                }
            });
        },

        update() {
            for (const enemy of this._enemies) {
                const event = enemy.event;
                const cone = new VisionCone(enemy.config.vision, event.direction());

                const relX = $gamePlayer.x - event.x;
                const relY = $gamePlayer.y - event.y;

                // A detecção matemática funciona INDEPENDENTE da camada visual!
                const canSeePlayer = cone.contains(relX, relY);

                if (canSeePlayer) {
                    enemy.isChasing = true;
                }

                if (enemy.isChasing) {
                    event.moveTowardPlayer();

                    const dist = Math.abs(relX) + Math.abs(relY);
                    if (dist > enemy.config.vision + 2) {
                        enemy.isChasing = false;
                    }
                }

                if (
                    enemy.x !== event.x ||
                    enemy.y !== event.y ||
                    enemy.direction !== event.direction()
                ) {
                    enemy.x = event.x;
                    enemy.y = event.y;
                    enemy.direction = event.direction();

                    if (window.ABS_DEBUG_VISION) {
                        VisionVisualizer.refresh(
                            event,
                            cone,
                            SceneManager._scene._spriteset
                        );
                    }
                }
            }
        }
    };
})();