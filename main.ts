import { getGeneratedNameForNode } from "typescript";
import { generate } from "./src/generator/generator";
import { Token, Tokenizer } from "./src/lexer/tokens";
import { ASTree, Parser } from "./src/parser/parser";

type typeKeywords = "int";



function compile_program(program: string) : string {
    const tokens: Token[] = new Tokenizer().tokenize(program);
    const tree: ASTree = new Parser().parseProgram(tokens);
    return generate(tree);
}

export { compile_program };