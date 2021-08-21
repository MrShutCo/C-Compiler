import { Token, Tokenizer } from "../lexer/tokens";
import { ASTree, ASTNode, Parser } from "../parser/parser";

function generate(programTree: ASTree): string {
    return genFunction(programTree.root);
}

function genFunction(node: ASTNode): string {
    return genLine(`.globl ${node.value}`, 0) 
    + genLine(`${node.value}:`, 0)
    + genReturn(node.childNodes[0]);
}

function genReturn(node: ASTNode): string {
    if (node.nodeType !== 'return') throw new Error('invalid');

    return genLine(genCommand('movl', `$${node.childNodes[0].value}`, '%eax'), 1)
    + genLine('ret', 1);
}

function genLine(command: string, indents: number): string {
    let spaces: string = "";
    for (let i = 0; i < indents; i++) {
        spaces += "  ";
    }
    return spaces + command + "\n";
}

function genCommand(command: string, arg1: string, arg2: string = '', arg3: string = ''): string {
    let gen = command + '    ' + arg1;
    if (arg2 !== '') gen += ', ' + arg2;
    if (arg3 !== '') gen += ', ' + arg3;
    return gen;
}

export { generate, genFunction, genReturn }