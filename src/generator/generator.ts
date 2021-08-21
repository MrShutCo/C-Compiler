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

function genExpression(node: ASTNode): string {
    if (node.nodeType === 'unary-op') {
        switch(node.value) {
            case '~':
                return genExpression(node.childNodes[0]) + genLine(genCommand('not', '%eax'), 1);
            case '!':
                return genExpression(node.childNodes[0]) 
                + genLine(genCommand('cmpl', '$0', '%eax'), 1) 
                + genLine(genCommand('movl', '$0', '%eax'), 1)
                + genLine(genCommand('sete', '%al'), 1)
                break;
            case '-':
                return genExpression(node.childNodes[0]) + genLine(genCommand('neg', '%eax'), 1);
        }
    }
    if (node.nodeType === 'constant') {
        return genLine(genCommand('movl', `$${node.value}`, '%eax'), 1);
    }
}

function genReturn(node: ASTNode): string {
    if (node.nodeType !== 'return') throw new Error('invalid');

    return genExpression(node.childNodes[0])
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

export { generate, genFunction, genReturn, genExpression }