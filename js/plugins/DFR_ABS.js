(function() {
    // 1. Definição do nome do plugin e leitura dos parâmetros (Configurabilidade)
    const PLUGIN_NAME = "DFR_ABS"; 
    const params = PluginManager.parameters(PLUGIN_NAME);
    
    // Símbolo do Botão de Ataque
    const ATTACK_KEY_SYMBOL = String(params.AttackKey || 'ok');
    
    // IDs das Animações de Batalha por direção (Configuráveis via Parâmetros)
    const ANIMATION_ID_DOWN = parseInt(params.AnimationIdDown || 1, 10); 
    const ANIMATION_ID_LEFT = parseInt(params.AnimationIdLeft || 2, 10); 
    const ANIMATION_ID_RIGHT = parseInt(params.AnimationIdRight || 3, 10); 
    const ANIMATION_ID_UP = parseInt(params.AnimationIdUp || 4, 10); 

    // *** FUNÇÃO AUXILIAR PARA CRIAR ALVO DE ANIMAÇÃO ***
    /**
     * Retorna um objeto "fake" de Game_Character na posição (x, y) para ser alvo de animação.
     */
    const getAttackTarget = function(x, y) {
        // Objeto mínimo para ser reconhecido pelo Spriteset_Map como um alvo de animação
        const target = {
            _x: x,
            _y: y,
            x: x, // Coordenada X no mapa
            y: y, // Coordenada Y no mapa
            
            // Métodos necessários para o Spriteset_Character reconhecer a posição de tela
            screenX: Game_Character.prototype.screenX,
            screenY: Game_Character.prototype.screenY,
            screenZ: Game_Character.prototype.screenZ,
            
            // Indica que é um Character (não um Tile), simplificando o processo
            isTile: function() { return false; },
            isCharacter: function() { return true; }, 
        };
        return target;
    };
    // ----------------------------------------------------------------------


    // 2. Extensão de Game_Player para gerenciamento de estado e gráficos
    
    const _Game_Player_initMembers = Game_Player.prototype.initMembers;
    Game_Player.prototype.initMembers = function() {
        _Game_Player_initMembers.call(this);
        this._isAttacking = false;
        this._attackDuration = 0;
    };

    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.call(this, sceneActive);
        
        if (this._isAttacking) {
            this._attackDuration--;
            if (this._attackDuration <= 0) {
                this._isAttacking = false;
                this.setImage(this._originalCharName, this._originalCharIndex);
            }
        }
    };

    Game_Player.prototype.getCurrentWeaponAttackData = function() {
        const data = {
            duration: 20,
            charName: '!Actors1_ATK1',
            charIndex: 0,
            animationId: 17
        };
        
        const direction = $gamePlayer.direction();

        switch (direction) {
            case 2: // Baixo
                data.animationId = ANIMATION_ID_DOWN;
                break;
            case 4: // Esquerda
                data.animationId = ANIMATION_ID_LEFT;
                break;
            case 6: // Direita
                data.animationId = ANIMATION_ID_RIGHT;
                break;
            case 8: // Cima
                data.animationId = ANIMATION_ID_UP;
                break;
        }
        
        return data;
    };
    
    Game_Player.prototype.startMeleeAttack = function(durationFrames, attackCharName, attackCharIndex, animationId) {
        if (!this._isAttacking) {
            this._isAttacking = true;
            this._attackDuration = durationFrames;
            
            this._originalCharName = this._characterName;
            this._originalCharIndex = this._characterIndex;
            
            this.setImage(attackCharName, attackCharIndex);
            
            // Reproduz a Animação no tile à frente do jogador
            if (animationId > 0) {
                const direction = $gamePlayer.direction();
                const dx = Game_Character.prototype.deltaXFrom(direction);
                const dy = Game_Character.prototype.deltaYFrom(direction);
                
                const targetX = $gamePlayer.x + dx;
                const targetY = $gamePlayer.y + dy;
                
                // *** USO DA FUNÇÃO AUXILIAR AQUI ***
                const attackTarget = getAttackTarget(targetX, targetY);
                
                // $gameTemp espera um array de Game_Characters como alvos
                $gameTemp.requestAnimation([attackTarget], animationId);
            }
            
            // *** Próxima etapa: iniciar a detecção de colisão aqui ***
        }
    };

    // 3. Altera o loop de input (Scene_Map) para usar o símbolo configurado.
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        
        if (!$gamePlayer.isMoving() && !$gamePlayer._isAttacking && !this._messageWindow.isOpen() && 
            Input.isTriggered(ATTACK_KEY_SYMBOL)) {
            
            const data = $gamePlayer.getCurrentWeaponAttackData();
            $gamePlayer.startMeleeAttack(data.duration, data.charName, data.charIndex, data.animationId); 
        }
    };
})();