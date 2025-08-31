(() => {
  const _DFR_WMN_initialize = Window_MapName.prototype.initialize;

  WINDOW_WIDTH = 100;
  WINDOW_OPACITY = 0;
  WINDOW_HEIGHT = 2;
  WINDOW_X = 20;
  WINDOW_Y = 0;
  WINDOW_DISPLAY_SECONDS = 5; // tempo em segundos
  const WINDOW_DISPLAY_TIME = WINDOW_DISPLAY_SECONDS * 60; // converte para frames

  Window_MapName.prototype.initialize = function(rect) {
    rect = this.mapNameWindowRect();
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = WINDOW_OPACITY; 
    this._showCount = 0;
    this.visible = false;
  };

  Window_MapName.prototype.mapNameWindowRect = function() {
    const width = Graphics.width - WINDOW_WIDTH; 
    const height = this.fittingHeight(WINDOW_HEIGHT); 
    const x = WINDOW_X; 
    const y = WINDOW_Y;
    return new Rectangle(x, y, width, height);
  };

  const _DFR_WMN_refresh = Window_MapName.prototype.refresh;
  Window_MapName.prototype.refresh = function() {
    const name = $gameMap.displayName();
    this.contents.clear();
    this.contentsBack.clear();
    if (!name) {
      this.visible = false;
      return;
    }
    this.visible = true;
    this._showCount = WINDOW_DISPLAY_TIME;

    const width = this.contentsWidth();
    const height = this.contentsHeight();
    const border = 4;

    // fundo azul opaco
    this.contentsBack.fillRect(0, 0, width, height, "rgba(0,0,128,0.7)");
    // contorno branco externo
    this.contentsBack.fillRect(0, 0, width, border, "#FFFFFF"); // topo
    this.contentsBack.fillRect(0, height-border, width, border, "#FFFFFF"); // baixo
    this.contentsBack.fillRect(0, 0, border, height, "#FFFFFF"); // esquerda
    this.contentsBack.fillRect(width-border, 0, border, height, "#FFFFFF"); // direita

    // texto centralizado vertical e horizontalmente
    this.contents.fontSize = 24;
    this.resetTextColor();
    this.changeTextColor("#FFFFFF");
    const textY = (height - this.lineHeight()) / 2; // centraliza vertical
    this.drawText(name, 0, textY, width, "center");
  };

  // Substituímos completamente o update para controlar apenas o tempo de exibição
  Window_MapName.prototype.update = function() {
    Window_Base.prototype.update.call(this); // mantém update base
    if (this._showCount > 0) {
      this._showCount--;
    } else if (this.visible) {
      this.visible = false;
    }
  };
})();
