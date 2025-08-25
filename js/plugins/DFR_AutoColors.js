/*:
 * @target MZ
 * @plugindesc Auto color the registered words
 * @author Davi Felipe
 *
 * @help
 * - Adicione palavras (sem limite) nas listas abaixo; todas as ocorrências
 *   serão coloridas automaticamente, sem precisar usar \C[n] no texto.
 * - Case-insensitive, acentos preservados.
 * - Funciona em qualquer Window_Base.
 *
 * @param C0
 * @text Branco
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de branco (C[0]).
 *
 * @param C1
 * @text Azul
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de azul (C[1]).
 *
 * @param C2
 * @text Laranja
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de laranja (C[2]).
 *
 * @param C3
 * @text Verde
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de verde (C[3]).
 *
 * @param C4
 * @text Azul Claro
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de azul claro (C[4]).
 *
 * @param C5
 * @text Roxo Claro
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de roxo claro (C[5]).
 *
 * @param C6
 * @text Amarelo Claro
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de amarelo claro (C[6]).
 *
 * @param C7
 * @text Cinza Escuro
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de cinza escuro (C[7]).
 *
 * @param C8
 * @text Azul Claro
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de azul claro (C[8]).
 *
 * @param C9
 * @text Azul
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de azul (C[9]).
 *
 * @param C10
 * @text Vermelho
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de vermelho (C[10]).
 *
 * @param C11
 * @text Verde
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de verde (C[11]).
 *
 * @param C12
 * @text Azul Claro
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de azul claro (C[12]).
 *
 * @param C13
 * @text Roxo Claro
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de roxo claro (C[13]).
 *
 * @param C14
 * @text Amarelo
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de amarelo (C[14]).
 *
 * @param C15
 * @text Preto
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de preto (C[15]).
 *
 * @param C16
 * @text Azul
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de azul (C[16]).
 *
 * @param C17
 * @text Amarelo
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de amarelo (C[17]).
 *
 * @param C18
 * @text Vermelho
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de vermelho (C[18]).
 *
 * @param C19
 * @text Roxo Escuro
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de roxo escuro (C[19]).
 *
 * @param C20
 * @text Laranja
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de laranja (C[20]).
 *
 * @param C21
 * @text Amarelo Escuro
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de amarelo escuro (C[21]).
 *
 * @param C22
 * @text Azul
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de azul (C[22]).
 *
 * @param C23
 * @text Azul Claro
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de azul claro (C[23]).
 *
 * @param C24
 * @text Verde
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de verde (C[24]).
 *
 * @param C25
 * @text Marrom
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de marrom (C[25]).
 *
 * @param C26
 * @text Roxo Claro
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de roxo claro (C[26]).
 *
 * @param C27
 * @text Rosa
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de rosa (C[27]).
 *
 * @param C28
 * @text Verde
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de verde (C[28]).
 *
 * @param C29
 * @text Verde Claro
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de verde claro (C[29]).
 *
 * @param C30
 * @text Roxo Claro
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de roxo claro (C[30]).
 *
 * @param C31
 * @text Roxo Claro
 * @type string[]
 * @default []
 * @desc Palavras que serão coloridas de roxo claro (C[31]).
 */

(() => {
    "use strict";
    const detected = (document.currentScript && (document.currentScript.src.match(/([^/]+)\.js$/) || [])[1]) || "AutoColorWordsMZ";
    const params = PluginManager.parameters(detected);
    const wordToColor = new Map();

    for (let i = 0; i <= 31; i++) {
        const key = "C" + i;
        const list = params[key] ? JSON.parse(params[key]) : [];
        if (Array.isArray(list)) {
            for (const raw of list) {
                const w = String(raw || "").trim().toLowerCase();
                if (w) wordToColor.set(w, i);
            }
        }
    }

    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const _orig_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        text = _orig_convertEscapeCharacters.call(this, text);
        // Para cada palavra registrada, aplica cor usando o escape real
        wordToColor.forEach((colorIndex, word) => {
            const re = new RegExp(`\\b(${escapeRegExp(word)})\\b`, "gi");
            text = text.replace(re, (match) => `\x1bC[${colorIndex}]${match}\x1bC[0]`);
        });
        return text;
    };
})();
