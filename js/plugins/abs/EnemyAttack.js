/*:
 * @target MZ
 * @plugindesc Sistema de ataques dos inimigos do ABS.
 * @author Davi Felipe
 */

(() => {
    "use strict";

    const ATTACK_ANIMATION_ID = 1;
    const ATTACK_GRAPHIC_DURATION = 24;
    const WHITE_FLASH_DURATION = 12;
    const DEFAULT_ATTACK_COOLDOWN = 3;
    const DEFAULT_FRAME_RATE = 60;

    const attackStates = new WeakMap();
    const unavailableGraphics = new Set();

    let playerFlashDuration = 0;
    let playerFlashSprite = null;
    let playerFlashLastUpdatedFrame = -1;

    function getState(enemy) {
        if (!attackStates.has(enemy)) {
            attackStates.set(enemy, {
                cooldown: 0,
                graphicDuration: 0,
                originalGraphic: null,
                attackGraphic: null,
                attackGraphicToken: 0,
                usingAttackGraphic: false
            });
        }

        return attackStates.get(enemy);
    }

    function getFrameRate() {
        const frameRate = Number(Graphics.frameRate);

        return Number.isFinite(frameRate) && frameRate > 0
            ? frameRate
            : DEFAULT_FRAME_RATE;
    }

    function getAttackCooldown(enemy) {
        const configuredCooldown = Number(
            enemy.config.attackCooldown
        );

        // Usa três segundos quando a configuração estiver ausente,
        // inválida ou for zero, evitando ataques contínuos.
        const cooldownSeconds =
            Number.isFinite(configuredCooldown) &&
            configuredCooldown > 0
                ? configuredCooldown
                : DEFAULT_ATTACK_COOLDOWN;

        return Math.max(
            1,
            Math.round(cooldownSeconds * getFrameRate())
        );
    }

    function getPlayerSprite(player) {
        const scene = SceneManager._scene;
        const spriteset = scene && scene._spriteset;
        const sprites = spriteset && spriteset._characterSprites;

        if (!sprites) {
            return null;
        }

        return sprites.find(
            sprite => sprite._character === player
        ) || null;
    }

    function flashPlayer(player) {
        const sprite = getPlayerSprite(player);

        if (!sprite) {
            return;
        }

        playerFlashSprite = sprite;
        playerFlashDuration = WHITE_FLASH_DURATION;
        playerFlashLastUpdatedFrame = Graphics.frameCount;

        sprite.setBlendColor([255, 255, 255, 255]);
    }

    function updatePlayerFlash() {
        if (playerFlashDuration <= 0) {
            return;
        }

        // Atualiza o temporizador somente uma vez por frame,
        // mesmo quando existem vários inimigos.
        if (playerFlashLastUpdatedFrame === Graphics.frameCount) {
            return;
        }

        playerFlashLastUpdatedFrame = Graphics.frameCount;
        playerFlashDuration--;

        if (playerFlashDuration === 0) {
            if (playerFlashSprite) {
                playerFlashSprite.setBlendColor([0, 0, 0, 0]);
            }

            playerFlashSprite = null;
        }
    }

    function clearAttackGraphicState(state) {
        state.graphicDuration = 0;
        state.originalGraphic = null;
        state.attackGraphic = null;
        state.usingAttackGraphic = false;
    }

    function attackGraphicExists(filename) {
        if (unavailableGraphics.has(filename)) {
            return false;
        }

        // O acesso ao sistema de arquivos só é possível no
        // ambiente local do RPG Maker MZ baseado em NW.js.
        if (!Utils.isNwjs()) {
            return true;
        }

        try {
            const fs = require("fs");
            const path = require("path");

            const fileName = `${filename}.png`;
            const roots = [
                process.cwd(),
                path.dirname(process.mainModule.filename)
            ];

            const candidates = new Set();

            for (const root of roots) {
                candidates.add(
                    path.join(root, "img", "characters", fileName)
                );

                candidates.add(
                    path.join(root, "www", "img", "characters", fileName)
                );

                candidates.add(
                    path.join(root, "..", "img", "characters", fileName)
                );
            }

            for (const candidate of candidates) {
                if (fs.existsSync(candidate)) {
                    return true;
                }
            }

            unavailableGraphics.add(filename);
            return false;
        } catch (error) {
            // Se não for possível verificar o arquivo, não
            // tenta carregar um recurso opcional às cegas.
            unavailableGraphics.add(filename);
            return false;
        }
    }

    function tryAttackGraphic(enemy, state) {
        const event = enemy.event;
        const originalName = event.characterName();
        const originalIndex = event.characterIndex();

        if (!originalName || originalName.endsWith("_atk")) {
            return;
        }

        const attackName = `${originalName}_atk`;

        // Verifica a existência antes de solicitar o carregamento.
        // Assim, um gráfico opcional ausente não interrompe o jogo.
        if (!attackGraphicExists(attackName)) {
            return;
        }

        const token = ++state.attackGraphicToken;

        state.originalGraphic = {
            name: originalName,
            index: originalIndex
        };

        state.attackGraphic = attackName;
        state.graphicDuration = ATTACK_GRAPHIC_DURATION;

        const bitmap = ImageManager.loadCharacter(attackName);

        bitmap.addLoadListener(() => {
            if (token !== state.attackGraphicToken) {
                return;
            }

            if (bitmap.isError()) {
                unavailableGraphics.add(attackName);
                clearAttackGraphicState(state);
                return;
            }

            if (
                state.graphicDuration <= 0 ||
                event.characterName() !== originalName ||
                event.characterIndex() !== originalIndex
            ) {
                clearAttackGraphicState(state);
                return;
            }

            event.setImage(attackName, originalIndex);
            state.usingAttackGraphic = true;
        });
    }

    function restoreAttackGraphic(enemy, state) {
        if (state.usingAttackGraphic && state.originalGraphic) {
            enemy.event.setImage(
                state.originalGraphic.name,
                state.originalGraphic.index
            );
        }

        clearAttackGraphicState(state);
    }

    function getKnockbackDirection(enemyEvent, player) {
        const dx = player.x - enemyEvent.x;
        const dy = player.y - enemyEvent.y;

        if (Math.abs(dx) >= Math.abs(dy)) {
            return dx >= 0 ? 6 : 4;
        }

        return dy >= 0 ? 2 : 8;
    }

    function knockbackPlayer(enemyEvent, player) {
        const direction = getKnockbackDirection(enemyEvent, player);

        if (player.canPass(player.x, player.y, direction)) {
            player.moveStraight(direction);
        }
    }

    function applyDamage(enemy, player) {
        const actor = $gameParty.leader();

        if (!actor || actor.isDead()) {
            return;
        }

        const damage = Math.max(
            0,
            Number(enemy.config.damage) || 0
        );
        
        // Debug
        console.log("[ABS] DANO APLICADO:", {
            enemyX: enemy.event.x,
            enemyY: enemy.event.y,
            playerX: player.x,
            playerY: player.y,
            dx: Math.abs(player.x - enemy.event.x),
            dy: Math.abs(player.y - enemy.event.y),
            damage
        });

        actor.gainHp(-damage);
        actor.startDamagePopup();

        if (actor.isDead()) {
            actor.performCollapse();
        }

        flashPlayer(player);
    }

    function playAttackAnimation(player) {
        if (ATTACK_ANIMATION_ID > 0) {
            $gameTemp.requestAnimation(
                [player],
                ATTACK_ANIMATION_ID
            );
        }
    }

    window.EnemyAttack = {
        update(enemy) {
            const state = getState(enemy);

            if (state.cooldown > 0) {
                state.cooldown--;
            }

            updatePlayerFlash();

            if (state.graphicDuration > 0) {
                state.graphicDuration--;

                if (state.graphicDuration === 0) {
                    restoreAttackGraphic(enemy, state);
                }
            }

            return state.cooldown > 0;
        },

        tryAttack(enemy, player) {
            const state = getState(enemy);

            if (state.cooldown > 0) {
                return false;
            }

            const dx = Math.abs(player.x - enemy.event.x);
            const dy = Math.abs(player.y - enemy.event.y);

            // O jogador precisa estar em uma casa adjacente,
            // incluindo as quatro posições diagonais.
            if (Math.max(dx, dy) !== 1) {
                return false;
            }

            // Impede ataques através de paredes ou outros obstáculos.
            const cone = new VisionCone(
                enemy.config.vision,
                enemy.event.direction(),
                enemy.event
            );

            if (!cone.hasLineOfSight(dx * Math.sign(player.x - enemy.event.x),
                                    dy * Math.sign(player.y - enemy.event.y))) {
                return false;
            }

            // Registra a recarga antes de executar o ataque.
            state.cooldown = getAttackCooldown(enemy);

            //Debug
            console.log("[ABS] ATAQUE EXECUTADO:", {
                enemyX: enemy.event.x,
                enemyY: enemy.event.y,
                playerX: player.x,
                playerY: player.y,
                dx,
                dy,
                cooldown: state.cooldown
            });

            tryAttackGraphic(enemy, state);
            playAttackAnimation(player);
            applyDamage(enemy, player);
            knockbackPlayer(enemy.event, player);

            return true;
        }
    };
})();