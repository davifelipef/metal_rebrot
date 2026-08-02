/*:
 * @target MZ
 * @plugindesc ABS Core
 * @author Davi Felipe
 */


(() => {


    console.log("ABS Core loaded");


    const _Scene_Map_start =
        Scene_Map.prototype.start;


    Scene_Map.prototype.start = function() {

        _Scene_Map_start.call(this);


        ABS_Core.scanEnemies();

    };


    const _Scene_Map_update =
        Scene_Map.prototype.update;


    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        ABS_Core.update();
        VisionVisualizer.update(); // Mantém os visuais alinhados caso os inimigos se movam
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
                        isChasing: false // Estado de alerta do inimigo
                    });

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
                const cone = new VisionCone(enemy.config.vision, event.direction());

                // 1. Calcula a distância relativa entre o Jogador e o Inimigo
                const relX = $gamePlayer.x - event.x;
                const relY = $gamePlayer.y - event.y;

                // 2. Verifica se o jogador está dentro dos tiles do cone de visão
                const canSeePlayer = cone.contains(relX, relY);

                if (canSeePlayer) {
                    console.log("Chasing the player");
                    enemy.isChasing = true;
                }

                // 3. Comportamento de Perseguição
                if (enemy.isChasing) {
                    // Move o inimigo na direção do jogador usando o pathfind nativo do RPG Maker
                    event.moveTowardPlayer();

                    // Se o jogador se afastar demais (ex: distância > visão + 2), o inimigo desiste
                    const dist = Math.abs(relX) + Math.abs(relY);
                    if (dist > enemy.config.vision + 2) {
                        enemy.isChasing = false;
                    }
                }

                // 4. Atualiza o visual do cone se o inimigo se moveu ou mudou de direção
                if (
                    enemy.x !== event.x ||
                    enemy.y !== event.y ||
                    enemy.direction !== event.direction()
                ) {
                    enemy.x = event.x;
                    enemy.y = event.y;
                    enemy.direction = event.direction();

                    VisionVisualizer.refresh(
                        event,
                        cone,
                        SceneManager._scene._spriteset
                    );
                }
            }
        }
    };


})();