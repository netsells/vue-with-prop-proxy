import { helpers } from '../src/index';

describe('getPropOptionalName', () => {
    it('gets the optional data property name for a prop', () => {
        expect(helpers.getPropOptionalName('foo')).toBe('fooOptional');
    });
});

describe('getPropEmitName', () => {
    it('returns `input` when passed `value`', () => {
        expect(helpers.getPropEmitName('value')).toBe('input');
    });

    it('returns `update:prop` when passed `prop`', () => {
        expect(helpers.getPropEmitName('prop')).toBe('update:prop');
    });
});
