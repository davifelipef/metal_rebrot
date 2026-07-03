(function() {
    // Adiciona o método drawStrokedText ao protótipo de Bitmap
    Bitmap.prototype.drawStrokedText = function(x, y, maxWidth, lineHeight, text, align = "left") {
        const context = this.context;
        const color = context.fillStyle;
        
        // Define a cor do contorno (preto)
        context.strokeStyle = "rgba(0, 0, 0, 1)"; 
        
        // O MZ não usa os métodos draw_text do VX, 
        // mas sim a função nativa fillText/strokeText do Canvas.
        
        // Configura o contorno do texto, simulando o efeito do VX (4 textos deslocados)
        // Isso é uma simplificação para o efeito de contorno padrão do MZ. 
        // Para uma conversão mais fiel, você pode tentar desenhar o texto 4 vezes:
        
        // 1. Contorno: Desenha o texto 4 vezes deslocado.
        context.save();
        context.fillStyle = "rgba(0, 0, 0, 1)"; // Cor do contorno (preto)
        
        // Definir alinhamento para o Canvas, já que o `align` do VX/RGSS não se aplica diretamente
        const txtWidth = context.measureText(text).width;
        let dx = 0;
        if (align === 1) dx = (maxWidth - txtWidth) / 2; // Center
        if (align === 2) dx = (maxWidth - txtWidth);    // Right
        
        // Simulação do contorno do VX com 4 draw_text:
        context.fillText(text, x + dx + 1, y + lineHeight / 2 + 1); // Direita/Baixo
        context.fillText(text, x + dx - 1, y + lineHeight / 2 + 1); // Esquerda/Baixo
        context.fillText(text, x + dx + 1, y + lineHeight / 2 - 1); // Direita/Cima
        context.fillText(text, x + dx - 1, y + lineHeight / 2 - 1); // Esquerda/Cima
        
        context.restore();

        // 2. Texto principal: Desenha o texto principal.
        context.fillStyle = color; // Cor original
        context.fillText(text, x + dx, y + lineHeight / 2); // Posição centralizada
    };
})();