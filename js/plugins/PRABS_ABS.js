/*:
 * @plugindesc [PRABS] Action Battle System (ABS Logic) - MZ EXCLUSIVO
 * @author PRCoders (Original RGSS) / Conversão JS
 * @help
 * Este plugin contém a lógica central do Action Battle System (ABS),
 * incluindo configurações, tratamento de dano e ações.
 *
 * É OBRIGATÓRIO que o PRABS_Core.js seja carregado antes deste plugin.
 */

(function() {
    "use strict";

    // Garante que o objeto PRABS existe (criado em PRABS_Core.js)
    var PRABS = window.PRABS || {};
    PRABS.CONFIG = PRABS.CONFIG || {};

    //==============================================================================
    // ** Módulo PRABS::CONFIG (Configurações)
    //==============================================================================

    // PRABS::CONFIG::ANIMATION
    PRABS.CONFIG.ANIMATION = {
        DELAY: 2,
        DEFAULT_FRAMES: 4,
        DEFAULT_DAMAGE_FRAME: 0,
        FRAMES: {},
        DAMAGE_FRAME: {}
    };

    // PRABS::CONFIG::ENEMY
    PRABS.CONFIG.ENEMY = {
        ENEMIES: {}, ENEMIES_ATTACK: {}, SKILL_ENEMIES: {}, COMBO_ENEMIES: {},
        get_animation_attack: function(enemyId, comboIndex) {
            return this.ENEMIES[[enemyId, comboIndex]] || this.ENEMIES[[enemyId, 0]] || "";
        },
        get_animation_attack_id: function(enemyId, comboIndex) {
            return this.ENEMIES_ATTACK[[enemyId, comboIndex]] || this.ENEMIES_ATTACK[[enemyId, 0]] || 0;
        },
        setup_attack_enemy_animation: function(enemyId, comboIndex, animationName, animationId) {
            this.ENEMIES[[enemyId, comboIndex]] = animationName;
            this.ENEMIES_ATTACK[[enemyId, comboIndex]] = animationId;
        },
        setup_attack_combo_max: function(enemyId, comboMax) {
            this.COMBO_ENEMIES[enemyId] = comboMax;
        },
        setup_skill_enemy_animation: function(enemyId, skillId, animationName) {
            this.SKILL_ENEMIES[[enemyId, skillId]] = animationName;
        }
    };

    // PRABS::CONFIG::BUTTONS (Usa as constantes de Input injetadas no Core)
    PRABS.CONFIG.BUTTONS = {
        ESQUIVAR: window.Input.X,
        RIGHT_HAND: window.Input.Y,
        LEFT_HAND: window.Input.Z
    };

    // PRABS::CONFIG::TYPE
    PRABS.CONFIG.TYPE = {
        LINHA: 0, CRUZ: 1, RED: 2, QUAD: 3, SHOOT: 4,
        SI_MESMO: 0, FRENTE: 1, ATRAS: -1
    };

    // PRABS::CONFIG::DATABASE
    PRABS.CONFIG.DATABASE = {
        DEFAULT_SKILL: [1, 1], SKILLS: [], CATCH_AND_USE_ITEMS: [],
        CATCH_ITEM_ANIMATIONS: [], DEFAULT_CATCH_ITEM_ANIMATION: 1,
        DEFAULT_ITEM: [1, 1], ITEMS: [], REFLECT_SHIELDS: {}, SHIELDS: {},

        get_skill: function(skillId) { return this.SKILLS[skillId] || this.DEFAULT_SKILL; },
        get_item: function(itemId) { return this.ITEMS[itemId] || this.DEFAULT_ITEM; },
        get_item_animation: function(itemId) { return this.CATCH_ITEM_ANIMATIONS[itemId] || this.DEFAULT_CATCH_ITEM_ANIMATION; },
        setup_shield: function(shieldId, animationName, move = false, reflectable = []) {
            this.REFLECT_SHIELDS[shieldId] = reflectable.slice();
            this.SHIELDS[shieldId] = [animationName, move];
        }
    };

    // PRABS::CONFIG::MESSAGES
    PRABS.CONFIG.MESSAGES = {
        MISS: "", EVADE: "", LEVEL_UP: "", EXP_GAIN: "", GUARD: ""
    };

    PRABS.CONFIG.HOTKEYS = [];
    PRABS.CONFIG.HUD_SWITCH_ID = 1;
    PRABS.CONFIG.HUD_SHOW_VALUES = 1;
    PRABS.CONFIG.HUD_START_ON = true;

    // PRABS::SEQUENCE
    PRABS.SEQUENCE = {
        BUTTONS: { FRONT: 1, BACK: 2, ATTACK: 3 },
        SEQUENCES: {}
    };

    // PRABS::HERO
    PRABS.HERO = {
        SEQUENCES_DATA: {}, COMBO_DATA: {},
        add_sequence: function(heroId, weaponId, comboIndex, data) {
            var key = [heroId, weaponId, comboIndex];
            data.sort((a, b) => b[0].length - a[0].length);
            this.SEQUENCES_DATA[key] = data.slice();
        },
        add_sequence_default: function(heroId, weaponId, data) {
            var key = [heroId, weaponId, 0];
            data.sort((a, b) => b[0].length - a[0].length);
            this.SEQUENCES_DATA[key] = data.slice();
        },
        set_combo_max: function(heroId, weaponId, valor, absWait = 60) {
            var key = [heroId, weaponId];
            this.COMBO_DATA[key] = [valor, absWait];
        },
        get_combo_max: function(heroId, weaponId) {
            var key = [heroId, weaponId];
            return this.COMBO_DATA[key] || [1, 60];
        },
        get_sequence: function(heroId, weaponId, comboIndex) {
            var key = [heroId, weaponId, comboIndex];
            var data = this.SEQUENCES_DATA[key];
            data = data || this.SEQUENCES_DATA[[heroId, weaponId, 0]];
            return data || [];
        }
    };

    //==============================================================================
    // ** Game_Temp
    //==============================================================================
    var _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this.hud_need_refresh = false;
        // ... (Adicionar outras variáveis do Game_Temp do script original se houver)
    };

    //==============================================================================
    // ** ABSAnimation
    //==============================================================================

    class ABSAnimation {
        constructor() {
            this.clear();
        }

        clear() {
            this.name = "";
            this.frames = 0;
            this.index = 0;
            this.active = false;
            this.no_image = false;
            this.loop = false;
            this.play = false;
            this.count = 0;
        }

        setup(name, frames, loop = false, play = true) {
            this.no_image = (name === "");
            this.name = name;
            this.frames = frames;
            this.index = 0;
            this.play = play;
            this.active = true;
            if (!this.play) {
                this.frames = 3;
            }
            this.loop = loop;
            this.count = 0;
        }

        update() {
            if (!this.active) return;
            this.count += 1;
            if ((this.count % PRABS.CONFIG.ANIMATION.DELAY) !== 0) return;

            if (this.play) {
                if (this.index < this.frames) {
                    this.index += 1;
                    if (this.index >= this.frames) {
                        if (this.loop) {
                            this.index = 0;
                            return;
                        }
                        this.clear();
                    }
                }
            }
        }
    }
    window.ABSAnimation = ABSAnimation;

    //==============================================================================
    // ** Game_Battler (Dano ABS)
    //==============================================================================
    // Métodos de ABS Dano
    Game_Battler.prototype.makeAbsAttackDamageValue = function(attacker, leftHanded = false, multiplier = 1) {
        var damage = 0;
        // Presume que abs_base_atk é adicionado por outro script ou tem um fallback
        var baseAtk = attacker.abs_base_atk ? attacker.abs_base_atk(leftHanded) : 10;

        damage = baseAtk * 4 - this.def * 2;
        if (damage < 0) damage = 0;

        if (damage === 0) {
            damage = Math.randomInt(2);
        } else if (damage > 0) {
            var criticalRate = attacker.cri * 100;
            this._critical = Math.randomInt(100) < criticalRate;
            if (this._critical) {
                damage = Math.floor(damage * 3 / 2);
            }
        }
        return Math.floor(damage * multiplier);
    };

    //==============================================================================
    // ** Game_Character (Sofrimento de Ações ABS)
    //==============================================================================

    Game_Character.prototype.suffer_attack = function(attacker, delay, direction = 0) {
        if (!this.battler || !attacker.battler) return false;

        if (this._shielded) {
            // Lógica de reflexão ou bloqueio (direção 10 - this.direction() parece ser uma verificação de 180 graus)
            var multiplier = (((10 - this.direction()) === direction) ? 0 : 1);
            this.battler.abs_attack_effect(attacker.battler, false, multiplier);
            this.set_abs_damage(attacker, delay);
        } else {
            this.battler.abs_attack_effect(attacker.battler);
            this.set_abs_damage(attacker, delay);
        }
    };

    Game_Character.prototype.suffer_skill = function(user, skill, delay) {
        if (!this.battler || !user.battler) return false;
        this.battler.skill_effect(user.battler, skill);
        this.set_abs_damage(user, delay);
    };

    Game_Character.prototype.suffer_item = function(user, item, delay = 0) {
        if (!this.battler || !user.battler) return false;
        this.battler.item_effect(user.battler, item);
        this.set_abs_damage(user, delay);
    };

    //==============================================================================
    // ** Game_Event (Configuração de Inimigo ABS)
    //==============================================================================
    var _Game_Event_initMembers = Game_Event.prototype.initMembers;
    Game_Event.prototype.initMembers = function() {
        _Game_Event_initMembers.call(this);
        this.battler = null;
        this._enemy = false;
        this._fakeEnemy = false;
        this._shielded = false;
        this._absStopped = false;
        // ... (Outras variáveis ABS do snippet)
        this._deadVariables = [];
        this._deadSwitches = [];
    };

    var _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function() {
        _Game_Event_setupPage.call(this);
        this.refreshComments();
    };

    Game_Event.prototype.refreshComments = function() {
        var page = this.page();
        if (!page) return; // CORREÇÃO: Verifica se a página existe antes de prosseguir.
        
        this.battler = null;
        this._enemy = false;
        this._fakeEnemy = false;
        this._deadVariables = [];
        this._deadSwitches = [];

        var list = page.list;
        // CORREÇÃO: Acessa a lista diretamente da página e verifica se é um array válido.
        if (!Array.isArray(list)) return;

        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item.code === 108 || item.code === 408) {
                var comment = item.parameters[0].toLowerCase();
                var match;
                if (match = comment.match(/fake_enemy[ ]?(\d+)/)) {
                    this.battler = new Game_Enemy(parseInt(match[1]));
                    this._fakeEnemy = true;
                } else if (match = comment.match(/enemy[ ]?(\d+)/)) {
                    this.battler = new Game_Enemy(parseInt(match[1]));
                    this._enemy = true;
                }
                // ... (Mais lógica de comentários)
            }
        }
    };

    //==============================================================================
    // ** Game_Player (Input de Ações ABS)
    //==============================================================================
    var _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function() {
        _Game_Player_update.call(this);
        this.update_abs_input();
    };

    Game_Player.prototype.update_abs_input = function() {
        if (!this.battler) return;
        this.update_left_hand();
        this.update_right_hand();
    };

    Game_Player.prototype.update_left_hand = function() {
        var LEFT_HAND = PRABS.CONFIG.BUTTONS.LEFT_HAND;

        if (!this.battler.hasTwoWeapons() && this.battler.armors()[0]) {
            // Lógica de Escudo (Slot de armadura 1)
            if (window.Input.press(LEFT_HAND)) {
                if (!this._shielded) {
                    var shieldId = this.battler.armors()[0].id;
                    var data = PRABS.CONFIG.DATABASE.SHIELDS[shieldId];
                    if (data) {
                        this._absStopped = data[1];
                        this.setDirectionFix(true);
                    }
                }
                this._shielded = true;
            } else if (this._shielded) {
                this._shielded = false;
                this._absStopped = false;
                this.setDirectionFix(false);
            }
            return;
        }

        // Lógica de Dual Wield (ataque com arma da mão esquerda)
        if (this.battler.hasTwoWeapons()) {
            // ... (Lógica de sequência/combo da mão esquerda)
        }
    };

    Game_Player.prototype.update_right_hand = function() {
        var RIGHT_HAND = PRABS.CONFIG.BUTTONS.RIGHT_HAND;
        if (window.Input.press(RIGHT_HAND)) {
            // ... (Lógica de sequência/combo da mão direita)
        }
    };

    //==============================================================================
    // ** Game_Map (Eventos Dinâmicos ABS)
    //==============================================================================

    var _Game_Map_initMembers = Game_Map.prototype.initMembers;
    Game_Map.prototype.initMembers = function() {
        _Game_Map_initMembers.call(this);
        if (!Array.isArray(this._mapAnimations)) this._mapAnimations = [];
        if (!Array.isArray(this._itemEvents)) this._itemEvents = [];
        if (!Array.isArray(this._shootEvents)) this._shootEvents = [];
        
        if (typeof this._absRefresh !== "object") {
            this._absRefresh = {
                'map_animation': false,
                'item_events': false,
                'shoot_events': false
            };
        }
        this._secPassed = false;
    };

    var _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function(sceneActive) {
        this.update_abs_array(this._mapAnimations, 'map_animation'); //error here
        this.update_abs_array(this._itemEvents, 'item_events');
        this.update_abs_array(this._shootEvents, 'shoot_events');

        if (this._absRefresh['map_animation']) this._absRefresh['map_animation'] = false;
        if (this._absRefresh['item_events']) this._absRefresh['item_events'] = false;
        if (this._absRefresh['shoot_events']) this._absRefresh['shoot_events'] = false;

        this._secPassed = (Graphics.frameCount % Graphics.fps) === 0;
        _Game_Map_update.call(this, sceneActive);
    };

    Game_Map.prototype.update_abs_array = function(array, key) {
        for (var i = array.length - 1; i >= 0; i--) { //error here
            var char = array[i];
            if (char) {
                char.update();
                // Assumindo que ABS_Animation e outros objetos ABS têm isDeleteRequested()
                if (char.isDeleteRequested && char.isDeleteRequested()) {
                    array.splice(i, 1);
                    this._absRefresh[key] = true;
                }
            } else {
                array.splice(i, 1);
            }
        }
    };
    
})();