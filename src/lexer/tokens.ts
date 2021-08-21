import { is } from "@babel/types";

type Token = {
    tokenType: TokenTypes,
    value: string
};

type WordParser = {
    token: string,
    index: number,
    type: CharType
};

enum CharType {
    'letter',
    'number',
    'special',
    'unaryOp',
    'unknown'
};

type TokenTypes = "identifier" | "numeric" | "special" | "keyword" | "unaryOp";

type IdentifierMatch = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' |
    'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' |
    'w' | 'x' | 'y' | 'z';
type IntMatch = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';
type BraceMatch = '{' | '}' | '(' | ')';

const unaryOps: string[] = '!~-'.split('');
const singleTokens: string[] = '{}();'.split('');
const letters: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
const numbers: string[] = '1234567890'.split('');
const keywords: string[] = ['int', 'return'];

//type Match = IdentifierMatch | IntMatch | BraceMatch;

class Tokenizer {

    constructor() {}

    public tokenize(program: string): Token[] {

        let tokens: Token[] = [];
        let index: number = 0;

        while (index < program.length) {
            index = this.eatWhitespace(program, index);
            const retVal: WordParser = this.findNextToken(program, index);
            index = retVal.index;
            tokens.push(this.createTokenFromString(retVal.token, retVal.type));
        }
        return tokens;
    }

    public findNextToken(program: string, index: number): WordParser {
        let token: string = '';
        let currChar: string = program[index];
        let currMatch: CharType = this.getTypeOfChar(currChar);

        // We have special symbol, so don't process any further
        if (currMatch === CharType.special) {
            return { index: index + 1, token: currChar, type: CharType.special };
        }

        if (currMatch === CharType.unaryOp) {
            return { index: index + 1, token: currChar, type: CharType.unaryOp };
        }

        if (currMatch === CharType.unknown) {
            throw new Error(`Error: character ${currChar} is not a valid character`);
        }

        while (this.getTypeOfChar(program[index]) === currMatch) {
            token += program[index];
            index++;
        }
        return { index: index, token: token, type: currMatch };
    }

    public createTokenFromString(token: string, charType: CharType): Token {
        let tokenType: TokenTypes = 'numeric';
        if (charType === CharType.unaryOp) tokenType = 'unaryOp';
        if (charType === CharType.special) tokenType = 'special';
        if (charType === CharType.number) tokenType = 'numeric';
        if (charType === CharType.letter) {
            if (keywords.includes(token)) tokenType = 'keyword';
            else tokenType = 'identifier';
        }
        return { tokenType: tokenType, value: token };
    }

    public eatWhitespace(program: string, index: number) {
        while (program[index] === ' ' || program[index] === '\n') index++;
        return index;
    }

    public getTypeOfChar(char: string): CharType {
        if (singleTokens.includes(char)) return CharType.special;
        if (letters.includes(char)) return CharType.letter;
        if (numbers.includes(char)) return CharType.number;
        if (unaryOps.includes(char)) return CharType.unaryOp;
        return CharType.unknown;
    }

}

export { Token, Tokenizer, WordParser, IdentifierMatch, IntMatch, BraceMatch, CharType };