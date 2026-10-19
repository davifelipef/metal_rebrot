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
                const page = event.event().pages[event._pageIndex];

                if (!page) {
                    return;
                }

                const comments = page.list
                    .filter(cmd => cmd.code === 108 || cmd.code === 408)
                    .map(cmd => cmd.parameters[0]);

                const config = EnemyConfig.fromComments(comments);

                if (!config.isEnemy) {
                    return;
                }

                const cone = new VisionCone(
                    config.vision,
                    event.direction(),
                    event
                );

                this._enemies.push({
                    event: event,
                    config: config,
                    hp: config.hp,
                    x: event.x,
                    y: event.y,
                    direction: event.direction(),
                    isChasing: false
                });

                if (window.ABS_DEBUG_VISION) {
                    VisionVisualizer.draw(
                        event,
                        cone,
                        SceneManager._scene._spriteset
                    );
                }
            });
        },

        update() {
            for (const enemy of this._enemies) {
                const event = enemy.event;

                // Atualiza a recarga do ataque.
                const isOnCooldown = EnemyAttack.update(enemy);

                const cone = new VisionCone(
                    enemy.config.vision,
                    event.direction(),
                    event
                );

                const relX = $gamePlayer.x - event.x;
                const relY = $gamePlayer.y - event.y;

                // O jogador só é detectado se estiver no cone
                // e houver linha de visão desobstruída.
                const canSeePlayer = cone.contains(relX, relY);

                if (canSeePlayer) {
                    enemy.isChasing = true;
                }

                const dx = Math.abs(relX);
                const dy = Math.abs(relY);

                const dist = dx + dy;
                const isAdjacent = Math.max(dx, dy) === 1;

                if (enemy.isChasing && !isOnCooldown) {
                    if (isAdjacent) {
                        // O módulo de ataque também valida a distância
                        // e a linha de visão antes de aplicar dano.
                        EnemyAttack.tryAttack(enemy, $gamePlayer);
                    } else {
                        event.moveTowardPlayer();
                    }

                    if (dist > enemy.config.vision + 2) {
                        enemy.isChasing = false;
                    }
                }

                const positionChanged =
                    enemy.x !== event.x ||
                    enemy.y !== event.y;

                const directionChanged =
                    enemy.direction !== event.direction();

                if (positionChanged || directionChanged) {
                    enemy.x = event.x;
                    enemy.y = event.y;
                    enemy.direction = event.direction();

                    if (window.ABS_DEBUG_VISION) {
                        const updatedCone = new VisionCone(
                            enemy.config.vision,
                            event.direction(),
                            event
                        );

                        VisionVisualizer.refresh(
                            event,
                            updatedCone,
                            SceneManager._scene._spriteset
                        );
                    }
                }
            }
        }
    };
})();