import { Hello } from './hello';
import { expect } from 'chai';
import 'mocha';

describe('Hello function', () => {
    it('should return hello world', () => {
        const hello = new Hello();
        const result = hello.log();
        expect(result).to.equal('Hello World!');
    });
});