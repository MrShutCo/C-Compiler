import { describe, expect, it, beforeEach } from "@jest/globals";
import { Tokenizer, Token, WordParser, CharType } from "../src/lexer/tokens";
import { ASTNode, ASTree, Grammer, Parser } from "../src/parser/parser";

describe('parser', () => {

    let grammer = new Grammer();

    let tp: Token[] = [
        { tokenType: "keyword", value: "int" },
        { tokenType: "identifier", value: "main" },
        { tokenType: "special", value: "(" },
        { tokenType: "special", value: ")" },
        { tokenType: "special", value: "{" },
        { tokenType: "keyword", value: "return" },
        { tokenType: "numeric", value: "2" },
        { tokenType: "special", value: ";" },
        { tokenType: "special", value: "}" }
    ];

    beforeEach(() => {
        grammer = new Grammer();
        tp = [
            { tokenType: "keyword", value: "int" },
            { tokenType: "identifier", value: "main" },
            { tokenType: "special", value: "(" },
            { tokenType: "special", value: ")" },
            { tokenType: "special", value: "{" },
            { tokenType: "keyword", value: "return" },
            { tokenType: "numeric", value: "2" },
            { tokenType: "special", value: ";" },
            { tokenType: "special", value: "}" }
        ];
    });

    it('adds grammers correctly', () => {
        grammer.addRule('<assignment>', '"int" <id> ";"');
        expect(grammer.rules[0]).toEqual({ name: '<assignment>', ruleDef: [ '"int"', '<id>', '";"' ] });
    });

    // describe('checkIsValid', () => {

    //     it ('tests simple statements', () => {
    //         expect(grammer.checkIsValid('a')).toEqual(true);
    //     });
    // });

    describe('parse program', () => {
        const p: Parser = new Parser();

        it ('parses an exression', () => {
            const actual: ASTNode = p.parseExp([tp[6]]);
            const expected: ASTNode = new ASTNode('constant', '2');
            expect(actual).toEqual(expected);
        });

        it ('parses expression with binary ops', () => {
            const actual: ASTNode = p.parseExp([
                { tokenType: 'unaryOp', value: '!' },
                { tokenType: 'unaryOp', value: '~' },
                tp[6] ]
                .reverse() as Token[]);
            const expected: ASTNode = new ASTNode('unary-op', '!', 
                new ASTNode('unary-op', '~', 
                new ASTNode('constant', '2')));
            expect(actual).toEqual(expected);
        });

        it ('parses a statement', () => {
            const actual: ASTNode = p.parseStatement([ tp[5], tp[6], tp[7]].reverse());
            const expected: ASTNode = new ASTNode('return', '', new ASTNode('constant', '2'));
            expect(actual).toEqual(expected);
        });

        it ('parses a function', () => {
            const actual: ASTNode = p.parseFunction(tp.reverse());
            const expected: ASTNode = 
                new ASTNode('function', 'main', 
                new ASTNode('return', '', 
                new ASTNode('constant', '2')));
            expect(actual).toEqual(expected);
        });

        it ('parses a program', () => {
            const actual: ASTree = p.parseProgram(tp);
            const expected: ASTree = { root: 
                new ASTNode('function', 'main', 
                new ASTNode('return', '', 
                new ASTNode('constant', '2')))
            };
            expect(actual).toEqual(expected);
        });
    });

});