/*:
 * @target MZ
 * @plugindesc Sistema de ataques dos inimigos do ABS.
 * @author Davi Felipe
 */

// ID do evento comum executado quando o jogador sofre dano fatal.
window.ABS_DEFEAT_COMMON_EVENT_ID = 1;

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

    let defeatEventPending = false;

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

    function triggerDefeatEvent() {
        if (defeatEventPending) {
            return;
        }

        const commonEventId = Number(
            window.ABS_DEFEAT_COMMON_EVENT_ID
        );

        if (
            !Number.isInteger(commonEventId) ||
            commonEventId <= 0 ||
            !$dataCommonEvents[commonEventId]
        ) {
            console.warn(
                "[ABS] Invalid defeat common event ID:",
                commonEventId
            );
            return;
        }

        defeatEventPending = true;

        $gameTemp.reserveCommonEvent(commonEventId);
    }

    function applyDamage(enemy, player) {
        const actor = $gameParty.leader();

        if (!actor || actor.isDead() || defeatEventPending) {
            return;
        }

        const damage = Math.max(
            0,
            Number(enemy.config.damage) || 0
        );

        const isFatal = damage >= actor.hp && damage > 0;

        if (isFatal) {
            // Mantém o jogador vivo para evitar o Game Over.
            actor.gainHp(-(actor.hp - 1));
            actor.startDamagePopup();

            flashPlayer(player);

            // Executa o evento comum de recuperação.
            triggerDefeatEvent();

            return;
        }

        actor.gainHp(-damage);
        actor.startDamagePopup();

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

            // Libera novos ataques após a recuperação do jogador.
            if (defeatEventPending) {
                const actor = $gameParty.leader();

                if (actor && actor.hp > 1) {
                    defeatEventPending = false;
                }
            }

            return state.cooldown > 0 || defeatEventPending;
        },

        tryAttack(enemy, player) {
            const state = getState(enemy);

            if (state.cooldown > 0 || defeatEventPending) {
                return false;
            }

            const dx = Math.abs(player.x - enemy.event.x);
            const dy = Math.abs(player.y - enemy.event.y);

            // Permite ataques em casas adjacentes,
            // incluindo as diagonais.
            if (Math.max(dx, dy) !== 1) {
                return false;
            }

            const cone = new VisionCone(
                enemy.config.vision,
                enemy.event.direction(),
                enemy.event
            );

            if (!cone.hasLineOfSight(
                dx * Math.sign(player.x - enemy.event.x),
                dy * Math.sign(player.y - enemy.event.y)
            )) {
                return false;
            }

            state.cooldown = getAttackCooldown(enemy);

            tryAttackGraphic(enemy, state);
            playAttackAnimation(player);
            applyDamage(enemy, player);

            if (!defeatEventPending) {
                knockbackPlayer(enemy.event, player);
            }

            return true;
        }
    };
})();