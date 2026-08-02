import fs from "node:fs";
import vm from "node:vm";


export function loadScript(path) {

    const code =
        fs.readFileSync(path, "utf-8");


    vm.runInThisContext(code);

}