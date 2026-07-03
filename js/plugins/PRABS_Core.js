/*:
 * @plugindesc [PRABS] Core Plugin (Input & AntiLag Culling) - MZ EXCLUSIVO
 * @author PRCoders (Original RGSS) / Conversão JS
 * @help
 * Este plugin contém a re-implementação do módulo Input e o sistema AntiLag
 * (culling de eventos).
 *
 * Foi totalmente otimizado para o RPG Maker MZ, utilizando apenas as APIs
 * de Key Codes (isKeyTriggered, isKeyPressing, etc.).
 */

(function() {
    "use strict";

    //==============================================================================
    // ** Módulo Input (Substituição da DLL e Adaptação MZ)
    //==============================================================================
    
    var Input_PRABS = {};

    // Mapeamento de Key Codes
    Input_PRABS.Mouse_Left = 1;
    Input_PRABS.Mouse_Right = 2;
    Input_PRABS.Mouse_Middle = 4;
    Input_PRABS.Back = 8;
    Input_PRABS.Tab = 9;
    Input_PRABS.Enter = 13;
    Input_PRABS.SHIFT = Input_PRABS.Shift = 16;
    Input_PRABS.CTRL = Input_PRABS.Ctrl = 17;
    Input_PRABS.ALT = Input_PRABS.Alt = 18;
    Input_PRABS.Pause = 0x13;
    Input_PRABS.CAPS = 0x14;
    Input_PRABS.Esc = 0x1B;
    Input_PRABS.LEFT = 0x25;
    Input_PRABS.UP = 0x26;
    Input_PRABS.RIGHT = 0x27;
    Input_PRABS.DOWN = 0x28;
    Input_PRABS.Space = 32;
    Input_PRABS.PageUp = 0x21;
    Input_PRABS.PageDowm = 0x22;
    Input_PRABS.Home = 0x23;
    Input_PRABS.End = 0x24;

    Input_PRABS.Letters = {};
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 0; i < letters.length; i++) {
        Input_PRABS.Letters[letters[i]] = 65 + i;
    }

    Input_PRABS.Fkeys = {};
    for (var i = 1; i <= 12; i++) {
        Input_PRABS['F' + i] = Input_PRABS.Fkeys[i] = 111 + i;
    }

    // Constantes originais (Mapeamento de Ações do Jogo)
    Input_PRABS.A = Input_PRABS.Letters["C"];
    Input_PRABS.B = [Input_PRABS.Letters["X"], Input_PRABS.Esc];
    Input_PRABS.C = [Input_PRABS.Letters["Z"], Input_PRABS.Space, Input_PRABS.Enter];
    Input_PRABS.X = Input_PRABS.Letters["A"];
    Input_PRABS.Y = Input_PRABS.Letters["S"];
    Input_PRABS.Z = Input_PRABS.Letters["D"];
    Input_PRABS.L = Input_PRABS.Letters["Q"];
    Input_PRABS.R = Input_PRABS.Letters["W"];

    // Helper e Métodos (trigger, press, repeat, release)
    Input_PRABS._checkKey = function(key, method) {
        if (Array.isArray(key)) {
            return key.some(k => method(k));
        }
        return method(key);
    };

    Input_PRABS.trigger = Input_PRABS.trigger$ = function(key) {
        return this._checkKey(key, k => window.Input.isKeyTriggered(k));
    };

    Input_PRABS.press = Input_PRABS.press$ = function(key) {
        return this._checkKey(key, k => window.Input.isKeyPressing(k));
    };

    Input_PRABS.repeat = Input_PRABS.repeat$ = function(key) {
        return this._checkKey(key, k => window.Input.isKeyRepeated(k));
    };

    Input_PRABS.release = Input_PRABS.release$ = function(key) {
        return this._checkKey(key, k => window.Input.isKeyReleased(k));
    };
    
    // Mescla as constantes e os métodos no objeto global Input
    Object.assign(window.Input, Input_PRABS);


    //==============================================================================
    // ** Módulo PRABS & AntiLag
    //==============================================================================
    var PRABS = window.PRABS || {};
    PRABS.VERSION = 2.0;
    window.PRABS = PRABS;

    var AntiLag = {};
    AntiLag._highPriority = false;
    AntiLag._event = true;
    AntiLag._cache = {};
    window.AntiLag = AntiLag;

    AntiLag.event$ = function() { return this._event; };
    AntiLag.event = AntiLag.event$;
    AntiLag.setEvent = function(valor) { this._event = !!valor; };
    AntiLag.high_priority$ = function() { return this._highPriority; };
    AntiLag.setHighPriority = function(valor) {
        if (this._highPriority === valor) return;
        this._highPriority = !!valor;
    };

    // Implementação da Lógica de Cache de Bitmap
    AntiLag.bitmap_width = function(characterName) { return this._getBitmapDimensions(characterName)[0]; };
    AntiLag.bitmap_height = function(characterName) { return this._getBitmapDimensions(characterName)[1]; };

    AntiLag._getBitmapDimensions = function(characterName) {
        if (this._cache[characterName]) return this._cache[characterName];

        var bitmap = ImageManager.loadCharacter(characterName);
        if (bitmap.width === 0 || bitmap.height === 0) return [48, 48]; // Fallback

        var sign = characterName.match(/^[\!\$]/);
        var cw, ch;

        if (sign && sign[0].includes('$')) {
            cw = bitmap.width / 3;
            ch = bitmap.height / 4;
        } else {
            cw = bitmap.width / 12;
            ch = bitmap.height / 8;
        }

        this._cache[characterName] = [cw, ch];
        return this._cache[characterName];
    };

    //==============================================================================
    // ** Game_Character (AntiLag / Culling)
    //==============================================================================

    Game_Character.prototype.always_update = function() {
        this.updateAnimation();
        this.updateMove();
        this.updateStop();
    };


    Game_Character.prototype.in_screen_x$ = function(addX = 0) { return $gameMap.in_screen_x$(this._x, addX); };
    Game_Character.prototype.in_screen_y$ = function(addY = 0) { return $gameMap.in_screen_y$(this._y, addY); };
    Game_Character.prototype.in_screen$ = function(addX = 0, addY = 0) {
        if (!this.in_screen_x$(addX)) return false;
        if (!this.in_screen_y$(addY)) return false;
        return true;
    };
    Game_Character.prototype.in_screen = Game_Character.prototype.in_screen$;

    // Sobrescrita de passable? com lógica de colisão AntiLag
    var _Game_Character_passable = Game_Character.prototype.passable;
    Game_Character.prototype.passable = function(x, y, d) {
        x = $gameMap.roundX(x);
        y = $gameMap.roundY(y);

        if (!$gameMap.isValid(x, y)) return false;
        if (this.isThrough() || this.isDebugThrough()) return true;
        if (!$gameMap.isPassable(x, y, d)) return false;

        if ($gameMap.in_screen(x, y)) {
            if (this.collide_with_screen_characters$(x, y)) return false;
        } else {
            if (this.collide_with_characters$(x, y)) return false;
        }
        return true;
    };

    Game_Character.prototype.collide_with_screen_characters$ = function(x, y) {
        var events = $gameMap.screen_events_xy(x, y);
        for (var event of events) {
            if (!event.isThrough()) {
                if (this.isEvent()) return true;
                if (event.isNormalPriority()) return true;
            }
        }
        if (this.isNormalPriority()) {
            if ($gamePlayer.pos(x, y)) return true;
            if ($gameMap.boat().pos(x, y)) return true;
            if ($gameMap.ship().pos(x, y)) return true;
        }
        return false;
    };

    //==============================================================================
    // ** Game_Player (AntiLag Event Triggers)
    //==============================================================================

    Game_Player.prototype.check_event_trigger_here = function(triggers) {
        if ($gameMap.isEventRunning()) return false;
        var events = $gameMap.screen_events_xy(this.x, this.y);
        var result = false;

        for (var event of events) {
            if (window.PRABS && event.battler) continue;
            if (triggers.includes(event.trigger()) && event.priorityType() !== 1) {
                event.start();
                if (event.isStarting()) result = true;
            }
        }
        return result;
    };

    Game_Player.prototype.check_event_trigger_there = function(triggers) {
        if ($gameMap.isEventRunning()) return false;
        var result = false;
        var frontX = $gameMap.xWithDirection(this.x, this.direction());
        var frontY = $gameMap.yWithDirection(this.y, this.direction());
        
        var events = $gameMap.screen_events_xy(frontX, frontY);
        
        for (var event of events) {
            if (window.PRABS && event.battler) continue;
            if (triggers.includes(event.trigger()) && event.priorityType() === 1) {
                event.start();
                result = true;
            }
        }

        if (result === false && $gameMap.isCounter(frontX, frontY)) {
            frontX = $gameMap.xWithDirection(frontX, this.direction());
            frontY = $gameMap.yWithDirection(frontY, this.direction());
            events = $gameMap.screen_events_xy(frontX, frontY);
            for (var event of events) {
                if (window.PRABS && event.battler) continue;
                if (triggers.includes(event.trigger()) && event.priorityType() === 1) {
                    event.start();
                    result = true;
                }
            }
        }
        return result;
    };

    Game_Player.prototype.check_event_trigger_touch = function(x, y) {
        if ($gameMap.isEventRunning()) return false;
        var result = false;
        var events = $gameMap.inScreen(x, y) ? $gameMap.screen_events_xy(x, y) : $gameMap.eventsXy(x, y);

        for (var event of events) {
            if (window.PRABS && event.battler) continue;
            if ([1, 2].includes(event.trigger()) && event.priorityType() === 1) {
                event.start();
                result = true;
            }
        }
        return result;
    };

    //==============================================================================
    // ** Game_Event (AntiLag Config & Culling)
    //==============================================================================
    var _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function() {
        _Game_Event_setupPage.call(this);

        this._largeBitmap = false;
        this._antilagAlwaysUpdate = false;
        this._antilagAlwaysUpdate = !AntiLag.event;

        var page = this.page();
        
        // CORREÇÃO: Verifica se a página existe antes de tentar acessar suas propriedades
        if (page) {
            if ([3, 4].includes(page.trigger)) { // 3: Autorun, 4: Parallel Process
                this._antilagAlwaysUpdate = true;
            }

            var list = page.list;
            // Verifica se a lista é um array antes de iterar e acessar length
            if (Array.isArray(list)) {
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    if (item.code === 108 || item.code === 408) {
                        var comment = item.parameters[0].toLowerCase().trim();
                        if (comment === "always_update") this._antilagAlwaysUpdate = true;
                        if (comment === "large_bitmap") this._largeBitmap = true;
                    }
                }
            }
        }
    };

    var _Game_Event_inScreen = Game_Event.prototype.inScreen;
    Game_Event.prototype.inScreen = function() {
        if (this._antilagAlwaysUpdate) return true;
        if (this._largeBitmap) {
            var addX = AntiLag.bitmap_width(this.characterName());
            var addY = AntiLag.bitmap_height(this.characterName());
            return Game_Character.prototype.in_screen$.call(this, addX, addY);
        }
        return _Game_Event_inScreen.call(this);
    };

    //==============================================================================
    // ** Game_Map (AntiLag Core)
    //==============================================================================
    var _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function() {
        this._screenEvents = {};
        _Game_Map_setupEvents.call(this);
    };

    Game_Map.prototype.screen_events_xy = function(x, y) {
        var result = [];
        for (var eventId in this._screenEvents) {
            if (this._screenEvents[eventId].pos(x, y)) {
                result.push(this._screenEvents[eventId]);
            }
        }
        return result;
    };

    Game_Map.prototype.updateEvents = function() {
        this._screenEvents = {};
        for (var eventId in this._events) {
            var event = this._events[eventId];
            event.always_update(); 
            
            if (event.inScreen()) {
                this._screenEvents[eventId] = event;
                event.update();
            }
        }
        for (var commonEventId in this._commonEvents) {
            this._commonEvents[commonEventId].update();
        }
    };

    Game_Map.prototype.updateVehicles = function() {
        for (var vehicle of this._vehicles) {
            if (vehicle.inScreen()) {
                vehicle.update();
            }
        }
    };

    // Lógica de in_screen_x/y adaptada do RGSS para simular culling com base em 256 sub-tiles
    Game_Map.prototype.in_screen_x$ = function(px, addX = 0) {
        var ax = px * 256;
        var minAx = ax;
        var maxAx = ax;
        if (addX > 0) {
            minAx = ax - Math.floor(addX / 2) * 256;
            maxAx = ax + Math.floor(addX / 2) * 256;
        }

        var displayX = this._displayX * 256;
        var minLimit = displayX - 2 * 256;
        var maxLimit = displayX + 19 * 256;

        if (this.isLoopHorizontal()) {
            var mapWidth = this.width() * 256;
            if (displayX > (this.width() - 17) * 256) {
                var minX = (displayX - 2 * 256) % mapWidth;
                var maxX = (displayX + 19 * 256) % mapWidth;
                if (maxX === 0) maxX = mapWidth;
                if ((minAx >= minX && minAx < mapWidth) || (minAx < maxX) || (maxAx > minX && maxAx <= mapWidth)) return true;
                return false;
            }
        }
        if (minAx < minLimit) return false;
        if (maxAx > maxLimit) return false;
        return true;
    };

    Game_Map.prototype.in_screen_y$ = function(py, addY = 0) {
        var ay = py * 256;
        var minAy = ay;
        var maxAy = ay;
        if (addY > 0) {
            minAy = ay - addY * 256;
        }

        var displayY = this._displayY * 256;
        var minLimit = displayY - 2 * 256;
        var maxLimit = displayY + 15 * 256;

        if (this.isLoopVertical()) {
            var mapHeight = this.height() * 256;
            if (displayY > (this.height() - 13) * 256) {
                var minY = (displayY - 2 * 256) % mapHeight;
                var maxY = (displayY + 15 * 256) % mapHeight;
                if (maxY === 0) maxY = mapHeight;
                if ((minAy >= minY && minAy < mapHeight) || (minAy < maxY) || (maxAy > minY && maxAy <= mapHeight)) return true;
                return false;
            }
        }
        if (minAy < minLimit) return false;
        if (maxAy > maxLimit) return false;
        return true;
    };

    Game_Map.prototype.in_screen$ = function(x, y, addX = 0, addY = 0) {
        if (!this.in_screen_x$(x, addX)) return false;
        if (!this.in_screen_y$(y, addY)) return false;
        return true;
    };
    Game_Map.prototype.in_screen = Game_Map.prototype.in_screen$;

    Game_Map.prototype.eventsXy = function(x, y) {
        var result = [];
        if (this.in_screen(x, y)) {
            for (var event of this.screen_events_xy(x, y)) {
                result.push(event);
            }
        } else {
            for (var eventId in this._events) {
                if (this._events[eventId].pos(x, y)) {
                    result.push(this._events[eventId]);
                }
            }
        }
        return result;
    };


    //==============================================================================
    // ** Spriteset_Map (AntiLag Culling)
    //==============================================================================

    Spriteset_Map.prototype.updateCharacters = function() {
        for (var sprite of this._characterSprites) {
            if (sprite.character && sprite.character.inScreen()) {
                sprite.update();
            }
        }
    };

})();