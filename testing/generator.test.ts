import { describe, expect, it } from "@jest/globals";
import { genExpression, genFunction, genReturn } from "../src/generator/generator";
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

    describe('genExpression', () => {

        it('generates negation op', () => {
            const actual: string = genExpression(
                new ASTNode('unary-op', '-', 
                new ASTNode('constant', '10'))
            );
            const expected: string = '  movl    $10, %eax\n  neg    %eax\n';
            expect(actual).toEqual(expected);
        });

        it ('generates logical negation', () => {
            const actual: string = genExpression(
                new ASTNode('unary-op', '!', 
                new ASTNode('constant', '10'))
            );
            const expected: string = '  movl    $10, %eax\n  cmpl    $0, %eax\n  movl    $0, %eax\n  sete    %al\n';
            expect(actual).toEqual(expected);
        });
        
    });

});