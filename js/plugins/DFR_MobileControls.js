(() => {

    const params = PluginManager.parameters("VirtualJoystick");
    const joystickX = Number(params["JoystickX"] || 150);
    const joystickY = Number(params["JoystickY"] || 500);
    const joystickRadius = Number(params["JoystickRadius"] || 60);
    const buttonRadius = Number(params["ButtonRadius"] || 50);

    const buttons = [
        { key: 'ok', x: Number(params["ButtonA_X"] || 900), y: Number(params["ButtonA_Y"] || 450), label: 'A' },
        { key: 'shift', x: Number(params["ButtonB_X"] || 1020), y: Number(params["ButtonB_Y"] || 450), label: 'B' },
        { key: 'cancel', x: Number(params["ButtonC_X"] || 960), y: Number(params["ButtonC_Y"] || 540), label: 'C' },
    ];

    class VirtualJoystick {
        constructor(scene){
            this.scene = scene;
            this.container = new PIXI.Container();
            this.joystickBase = new PIXI.Graphics();
            this.joystickKnob = new PIXI.Graphics();
            this.dragging = false;
            this.knobPos = {x: joystickX, y: joystickY};
            this.keysPressed = {};
            this.deadzone = 0.2; // zona morta

            this.setupJoystick();
            this.setupButtons();

            scene.addChild(this.container);

            this._onPointerDown = this.onPointerDown.bind(this);
            this._onPointerMove = this.onPointerMove.bind(this);
            this._onPointerUp = this.onPointerUp.bind(this);

            scene.interactive = true;
            scene.on('pointerdown', this._onPointerDown);
            scene.on('pointermove', this._onPointerMove);
            scene.on('pointerup', this._onPointerUp);
            scene.on('pointerupoutside', this._onPointerUp);
        }

        setupJoystick(){
            const base = this.joystickBase;
            base.beginFill(0x4444ff,0.3);
            base.drawCircle(0,0,joystickRadius);
            base.endFill();
            base.x = joystickX;
            base.y = joystickY;

            const knob = this.joystickKnob;
            knob.beginFill(0x8888ff,0.5);
            knob.drawCircle(0,0,joystickRadius/2);
            knob.endFill();
            knob.x = joystickX;
            knob.y = joystickY;

            this.container.addChild(base);
            this.container.addChild(knob);
        }

        setupButtons(){
            this.buttonSprites = [];
            buttons.forEach(btn=>{
                const g = new PIXI.Graphics();
                g.beginFill(0xff4444,0.5);
                g.drawCircle(0,0,buttonRadius);
                g.endFill();
                g.x = btn.x;
                g.y = btn.y;
                g.interactive = true;
                g.buttonMode = true;
                g.on('pointerdown', ()=>this.pressKey(btn.key));
                g.on('pointerup', ()=>this.releaseKey(btn.key));
                g.on('pointerupoutside', ()=>this.releaseKey(btn.key));

                const label = new PIXI.Text(btn.label,{fill:'white',fontSize:24});
                label.anchor.set(0.5);
                g.addChild(label);

                this.container.addChild(g);
                this.buttonSprites.push(g);
            });
        }

        pressKey(key){
            Input._currentState[key] = true;
            this.keysPressed[key] = true;
        }

        releaseKey(key){
            Input._currentState[key] = false;
            delete this.keysPressed[key];
        }

        onPointerDown(e){
            const pos = e.data.global;
            const dx = pos.x - joystickX;
            const dy = pos.y - joystickY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if(dist <= joystickRadius){
                this.dragging = true;
                this.updateJoystick(pos.x,pos.y);
            }
        }

        onPointerMove(e){
            if(this.dragging){
                const pos = e.data.global;
                this.updateJoystick(pos.x,pos.y);
            }
        }

        onPointerUp(e){
            if(this.dragging){
                this.dragging = false;
                this.joystickKnob.x = joystickX;
                this.joystickKnob.y = joystickY;
                this.releaseJoystickKeys();
            }
        }

        updateJoystick(x,y){
            let dx = x - joystickX;
            let dy = y - joystickY;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if(dist > joystickRadius){
                dx = dx/dist*joystickRadius;
                dy = dy/dist*joystickRadius;
                dist = joystickRadius;
            }
            this.joystickKnob.x = joystickX + dx;
            this.joystickKnob.y = joystickY + dy;

            // Normaliza para vetor [-1,1]
            const nx = dx/joystickRadius;
            const ny = dy/joystickRadius;

            // Zona morta
            if(Math.abs(nx)<this.deadzone && Math.abs(ny)<this.deadzone){
                this.releaseJoystickKeys();
                return;
            }

            // Atualiza teclas de direção
            this.releaseJoystickKeys();

            if(ny < -this.deadzone) Input._currentState['up'] = true;
            if(ny > this.deadzone) Input._currentState['down'] = true;
            if(nx < -this.deadzone) Input._currentState['left'] = true;
            if(nx > this.deadzone) Input._currentState['right'] = true;
        }

        releaseJoystickKeys(){
            ['up','down','left','right'].forEach(k=>Input._currentState[k]=false);
        }
    }

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function(){
        _Scene_Map_start.call(this);
        this._virtualJoystick = new VirtualJoystick(this);
    };

    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function(){
        if(this._virtualJoystick){
            this.removeChild(this._virtualJoystick.container);
            this._virtualJoystick = null;
        }
        _Scene_Map_terminate.call(this);
    };

    // Desabilita clique direto no mapa
    Game_Player.prototype.triggerAction = function(){
        if(TouchInput.isTriggered()) return;
        return Game_Character.prototype.triggerAction.call(this);
    };

})();
