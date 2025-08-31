(() => {
    const fontName = "Coneria Pixel"; // nome exato da TTF na pasta fonts

    const _Window_Base_resetFontSettings = Window_Base.prototype.resetFontSettings;
    Window_Base.prototype.resetFontSettings = function() {
        _Window_Base_resetFontSettings.call(this);
        this.contents.fontFace = fontName;
    };
})();
