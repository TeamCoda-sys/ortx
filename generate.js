const fs = require("mz/fs");

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("ERROR ! Your file is not a Ortix Data (*.ortxd) file !");
        return;
    }

    const astJSON = (await fs.readFile(filename)).toString();
    const statements = JSON.parse(astJSON);
    const jsCode = generateJsForStatements(statements);
    const outputFilename = filename.replace(".ortxd", ".js")
    await fs.writeFile(outputFilename, jsCode);
    console.log(`Ortix File has bein created : ${outputFilename}`);

}

function generateJsForStatements(statements) {
    const lines = [];
    for (let statement of statements) {
        const line = generateJsForStatementsOrExpr(statement);
        lines.push(line);
    }
    return lines.join("\n")
}

function generateJsForStatementsOrExpr(node) {
    if (node.type === "var_assign") {
        const varName = node.var_name.value;
        const jsExpr = node.value.value;
        const js = `var ${varName} = ${jsExpr};`
        return js;
    }
}

main().catch(err => console.log(err.stack));