/**
 * ==============================================================================
 * PRCoders - Objeto Global
 * ------------------------------------------------------------------------------
 * Objeto global necessário para gerenciar scripts da PRCoders no RPG Maker MZ.
 * ==============================================================================
 */
var PRCoders = PRCoders || {};

(function() {
    PRCoders.SCRIPTS = {};
    PRCoders.LOADED_SCRIPTS = {};
    PRCoders.AUTHORS = {};
    PRCoders._scriptsCounter = 0;
    PRCoders._loadedScriptsCounter = 0;

    // --------------------------------------------------------------------------
    // Adiciona o script na lista dos scripts
    // --------------------------------------------------------------------------
    PRCoders.logScript = function(scriptName, version = 1.0, author = "PRCoders") {
        const key = `${scriptName}_${version}`;
        PRCoders.SCRIPTS[key] = true;
        
        const genericKey = `${scriptName}_null`;
        if (!PRCoders.SCRIPTS[genericKey]) {
            PRCoders.SCRIPTS[genericKey] = true;
            PRCoders._scriptsCounter++;
        }
        
        if (!author) return;

        if (!PRCoders.AUTHORS[scriptName]) {
            PRCoders.AUTHORS[scriptName] = [];
        }
        if (!PRCoders.AUTHORS[scriptName].includes(author)) {
            PRCoders.AUTHORS[scriptName].push(author);
        }
    };

    // --------------------------------------------------------------------------
    // Adiciona o script na lista dos scripts carregados
    // --------------------------------------------------------------------------
    PRCoders.loadScript = function(scriptName, version = 1.0, author = "PRCoders") {
        const key = `${scriptName}_${version}`;
        if (!PRCoders.SCRIPTS[key]) {
            const message = `Nao foi encontrado o seguinte script: \nNome: ${scriptName} \nVersao: ${version}`;
            
            // Substitui a chamada Win32API.MessageBoxEx por console.error e um alerta no jogo
            console.error(message);
            alert(message);
            
            throw new Error("Script PRCoders não encontrado.");
        }
        
        PRCoders.LOADED_SCRIPTS[key] = true;
        
        const genericKey = `${scriptName}_null`;
        if (!PRCoders.LOADED_SCRIPTS[genericKey]) {
            PRCoders.LOADED_SCRIPTS[genericKey] = true;
            PRCoders._loadedScriptsCounter++;
        }
    };

    // --------------------------------------------------------------------------
    // Verifica se pode carregar o script (logado e não carregado)
    // --------------------------------------------------------------------------
    PRCoders.checkEnabled = function(scriptName, version = null) {
        return (this.loggedScript(scriptName, version) && (!this.loadedScript(scriptName, version)));
    };

    // --------------------------------------------------------------------------
    // Verifica se está carregado e adicionado na lista
    // --------------------------------------------------------------------------
    PRCoders.loggedAndLoaded = function(scriptName, version = null) {
        return (this.loggedScript(scriptName, version) && this.loadedScript(scriptName, version));
    };

    // --------------------------------------------------------------------------
    // Verifica se está carregado
    // --------------------------------------------------------------------------
    PRCoders.loadedScript = function(scriptName, version = null) {
        const key = `${scriptName}_${version}`;
        return PRCoders.LOADED_SCRIPTS[key];
    };

    // --------------------------------------------------------------------------
    // Verifica se está adicionado na lista
    // --------------------------------------------------------------------------
    PRCoders.loggedScript = function(scriptName, version = null) {
        const key = `${scriptName}_${version}`;
        return PRCoders.SCRIPTS[key];
    };
    
    // --------------------------------------------------------------------------
    // Funções removidas/simplificadas:
    // - game_name, game_dll, game_rtp, handel, call_message, data_folder, data_filename: 
    //   Dependem de Win32API ou da estrutura de arquivos do VX. Não são mais necessárias no MZ.
    // --------------------------------------------------------------------------

    // --------------------------------------------------------------------------
    // Cria os créditos (Lógica mantida, mas a forma de escrever o arquivo 
    // será simplificada/simulada, pois manipulação de I/O em JS é limitada 
    // no ambiente do MZ/browser)
    // --------------------------------------------------------------------------
    PRCoders.createCredits = function(filename = "PRScripts.txt") {
        let message = "============================================\r\n";
        message += " Scripts utilizando o módulo PRCoders\r\n";
        message += ` Total:       ${PRCoders._scriptsCounter}\r\n`;
        message += ` Utilizados: ${PRCoders._loadedScriptsCounter}\r\n`;
        message += "============================================\r\n";

        let counter = 0;
        const writed = [];

        for (const key in PRCoders.SCRIPTS) {
            if (PRCoders.SCRIPTS.hasOwnProperty(key)) {
                const parts = key.split('_');
                const scriptName = parts[0];
                const version = parts[1];

                if (version === 'null') continue; // Ignora chaves genéricas
                
                if (writed.includes(key)) continue;

                writed.push(key);
                counter++;

                message += "============================================\r\n";
                message += ` - Script ${counter}\r\n`;
                message += "--------------------------------------------\r\n";
                message += `Nome: ${scriptName}\r\n`;
                message += `Versão: ${version}\r\n`;

                let authors = PRCoders.AUTHORS[scriptName] || ["PRCoders"];
                
                // Adaptação da lógica de substituição de autores para JS
                authors = authors.map(author => 
                    author.replace(/[Pp][Rr][Cc][Oo][Dd][Ee][Rr][Ss]/g, "PRCoders")
                );

                if (authors.length === 1) {
                    message += `Criador: ${authors[0]}\r\n`;
                } else {
                    message += "Criadores: ";
                    authors.forEach(author => {
                        message += `${author}\r\n            `;
                    });
                }
            }
        }
        
        // No MZ, você não pode criar arquivos diretamente como no VX/Ruby.
        // A melhor alternativa é exibir o conteúdo no console/log.
        console.log(`\n--- Conteúdo para ${filename} ---\n`);
        console.log(message);
        console.log("\n--------------------------------------\n");

        // Se você estiver usando um plugin de I/O específico, 
        // a chamada para salvar o arquivo (File.open/write) seria feita aqui.
    };

    // Define uma constante booleana de controle
    PRCoders.PRCODERS_MODULE = true;

})();

// PRCoders.logScript("Core Engine", 1.0); 
// PRCoders.loadScript("Core Engine", 1.0);