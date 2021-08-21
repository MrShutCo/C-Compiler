import { describe, expect, it } from "@jest/globals";
import { genFunction, genReturn } from "../src/generator/generator";
import { ASTNode } from "../src/parser/parser";

describe('generator', () => {

    it('genReturn', () => {
        const actual: string = genReturn(new ASTNode('return', '', new ASTNode('constant', '2')));
        const expected: string = `  movl    $2, %eax\n  ret\n`;
        expect(actual).toEqual(expected);
    });

    it('genFunction', () => {
        const actual: string = genFunction(
            new ASTNode('function', 'main', 
            new ASTNode('return', '', 
            new ASTNode('constant', '2')))
        )
        const expected: string = '.globl main\nmain:\n  movl    $2, %eax\n  ret\n';
        expect(actual).toEqual(expected);
    });

});