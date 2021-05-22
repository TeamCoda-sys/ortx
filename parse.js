const nearley = require("nearley");
const grammar = require("./ortx.js");
const fs = require("mz/fs");

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("ERROR ! Your file is not a Ortix (*.ortx) file !");
        return;
    }

    const code = (await fs.readFile(filename)).toString();
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(code)
    if (parser.results.length > 1) {
        console.log("ERROR ! Ambigous Grammar Detected !")
    } else if (parser.results.length == 1) {
        const ast = parser.results[0];
        const outputFilename = filename.replace(".ortx", ".ortxd");
        await fs.writeFile(outputFilename, JSON.stringify(ast, null, "  "));
        console.log(`Ortix Data has bein created : ${outputFilename}.`);
    } else {
        console.log("ERROR ! No Parse Found - FATAL ERROR")
    }
}

main().catch(err => console.log(err.stack));