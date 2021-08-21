import { describe, expect, it } from "@jest/globals";
import { Tokenizer, Token, WordParser, CharType } from "../src/lexer/tokens";

describe('lexer', () => {

    const tokken: Tokenizer = new Tokenizer();

    describe('findNextToken', () => {
        it ('identifies an indentifier match', () => {
            const toBeToken: string = 'hello';
            const actual: WordParser = tokken.findNextToken(toBeToken, 0);
            const expected: WordParser = { token: "hello", index: 5 , type: CharType.letter};
            expect(actual).toEqual(expected);
        })

        it ('identifies a keyword', () => {
            const toBeToken: string = 'main()';
            const actual: WordParser = tokken.findNextToken(toBeToken, 0);
            const expected: WordParser = { token: "main", index: 4, type: CharType.letter};
            expect(actual).toEqual(expected);
        });
    
        it ('identifies a number match', () => {
            const toBeToken: string = '466745';
            const actual: WordParser = tokken.findNextToken(toBeToken, 0);
            const expected: WordParser = { token: "466745", index: 6, type: CharType.number };
            expect(actual).toEqual(expected);
        });
    
        it ('throws an error when it first encounters unknown symbol', () => {
            expect(() => {
                const k: WordParser = tokken.findNextToken('.?>', 0);
            }).toThrow(`Error: character . is not a valid character`)
        });

        it ('parses a special symbol', () => {
            const toBeToken: string = '{hello}';
            const actual: WordParser = tokken.findNextToken(toBeToken, 0);
            const expected: WordParser = { token: "{", index: 1, type: CharType.special };
            expect(actual).toEqual(expected);
        });
    
        it ('identifies first word then stops', () => {
            const toBeToken: string = 'first word';
            const actual: WordParser = tokken.findNextToken(toBeToken, 0);
            const expected: WordParser = { token: "first", index: 5, type: CharType.letter };
            expect(actual).toEqual(expected);
        });
    
    });

    describe('createTokenFromString', () => {
        it('tokenizes an identifier', () => {
            const actual: Token = tokken.createTokenFromString('foobar', CharType.letter);
            const expected: Token = { tokenType: 'identifier', value: 'foobar' }
            expect(actual).toEqual(expected);
        });

        it('tokenizes a keyword', () => {
            const actual: Token = tokken.createTokenFromString('int', CharType.letter);
            const expected: Token = { tokenType: 'keyword', value: 'int' }
            expect(actual).toEqual(expected);
        });

        it ('tokenizes a number', () => {
            const actual: Token = tokken.createTokenFromString('12354', CharType.number);
            const expected: Token = { tokenType: 'numeric', value: '12354' }
            expect(actual).toEqual(expected);
        });

        it ('tokenizes a special character', () => {
            const actual: Token = tokken.createTokenFromString('{', CharType.special);
            const expected: Token = { tokenType: 'special', value: '{' }
            expect(actual).toEqual(expected);
        });

        it ('tokenizes a unary operator', () => {
            const actual: Token = tokken.createTokenFromString('!', CharType.unaryOp);
            const expected: Token = { tokenType: 'unaryOp', value: '!' }
            expect(actual).toEqual(expected);
        });
    });

    describe('eatWhitespace', () => {
        it ('eats whitespace in front of word', () => {
            const actualIndex: number = tokken.eatWhitespace('   \n  hello', 0);
            expect(actualIndex).toEqual(6);
        });
    });
    
    describe('tokenize', () => {
        it('parses basic keywords', () => {
            const program: string = `int main() { \n return 2; \n}`;
            const actual: Token[] = tokken.tokenize(program);
            const expected: Token[] = [
                { tokenType: "keyword", value: "int" },
                { tokenType: "identifier", value: "main" },
                { tokenType: "special", value: "(" },
                { tokenType: "special", value: ")" },
                { tokenType: "special", value: "{" },
                { tokenType: "keyword", value: "return" },
                { tokenType: "numeric", value: "2" },
                { tokenType: "special", value: ";" },
                { tokenType: "special", value: "}" }];
            expect(actual).toEqual(expected);
            
        });
    });

});