import { describe, expect, it } from "@jest/globals";
import { compile_program } from "../main";
import * as fs from 'fs'

describe('compile_program', () => {
    it ('compiles the basic function', () => {
        testIO('test1');
    });
});

function testIO(file: string) {
    const actual: string = compile_program(fs.readFileSync(`./testing/inputs/${file}.c`).toString());
        expect(actual).toEqual(fs.readFileSync(`./testing/outputs/${file}.s`).toString())
}