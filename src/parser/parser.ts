import { Token } from "../lexer/tokens";

type ASTree = {
    root: ASTNode
};

class ASTNode {
    public nodeType: string;
    public value: string
    public childNodes: ASTNode[];

    constructor(nodeType: string, value: string = '', ...childNodes: ASTNode[]){ 
        this.nodeType = nodeType;
        this.value = value;
        this.childNodes = childNodes;
    }
};

type Rule = {
    name: string;
    ruleDef: string[];
};

class Grammer {

    rules: Rule[];

    constructor() {
        this.rules = [];
    }

    addRule(ruleName: string, definition: string): void {
        this.rules.push({ name: ruleName, ruleDef: definition.split(' ') });
    }

    checkIsValid(text: Token[]): boolean {
        return true;
    }
}

class Parser {
    parseProgram(tokens: Token[]): ASTree {
        const statement: ASTNode = this.parseFunction(tokens.reverse());
        return { root: statement };
    }

    fail(token: Token) {
        throw new Error(`Error: could not parse token ${JSON.stringify(token)}!`);
    }

    parseFunction(tokens: Token[]): ASTNode {
        let tok: Token = tokens.pop();
        if (tok.tokenType !== 'keyword' && tok.value !== 'int') this.fail(tok);

        tok = tokens.pop();
        if (tok.tokenType !== 'identifier') this.fail(tok);
        const functionName: string = tok.value;

        tok = tokens.pop();
        if (tok.tokenType !== 'special' && tok.value !== '(') this.fail(tok);

        tok = tokens.pop();
        if (tok.tokenType !== 'special' && tok.value !== ')') this.fail(tok);

        tok = tokens.pop();
        if (tok.tokenType !== 'special' && tok.value !== '{') this.fail(tok);

        const statement: ASTNode = this.parseStatement(tokens);

        tok = tokens.pop();
        if (tok.tokenType !== 'special' && tok.value !== ')') this.fail(tok);
        return new ASTNode('function', functionName, statement);
    }

    parseStatement(tokens: Token[]): ASTNode {
        let tok: Token = tokens.pop();
        if (tok.tokenType !== 'keyword' && tok.value !== 'return') this.fail(tok);
        
        const exp: ASTNode = this.parseExp(tokens);

        tok = tokens.pop();
        if (tok.tokenType !== 'special' && tok.value !== ';') this.fail(tok);

        return new ASTNode('return', '', exp);
    }

    parseExp(tokens: Token[]): ASTNode {
        let tok: Token = tokens.pop();
        if (tok.tokenType == 'unaryOp') {
            return new ASTNode('unary-op', tok.value, this.parseUnaryOp(tokens));
        }
        if (tok.tokenType === 'numeric') {
            return new ASTNode('constant', tok.value);
        }
        this.fail(tok);
    }

    parseUnaryOp(tokens: Token[]): ASTNode {
        let tok: Token = tokens.pop();
        if (tok.tokenType !== 'unaryOp') this.fail(tok);
        return new ASTNode('unary-op', tok.value, this.parseExp(tokens));
    }
}

// You're not quite ready for this... but your kids are gonna love it!
// const basicGrammer = new Grammer();
// basicGrammer.addRule('<program>', '<function>');
// basicGrammer.addRule('<function>', '"int" <id> "(" ")" "{" <statement> "}"');
// basicGrammer.addRule('<statement>', '"return" <exp> ";"');
// basicGrammer.addRule('<exp>', '<int>');
// // TODO: not quite that great
// basicGrammer.addRule('<int>', '"1"');
// type Gprogram = Gfunction;
// type Gfunction = 'int' & IdentifierMatch[] & '(' & ')' & '&' & Gstatement; 
// type Gstatement = 'return' & GExp & ';';
// type GExp = IntMatch[];

// console.log('123543' )

export { Grammer, Parser, ASTNode, ASTree }