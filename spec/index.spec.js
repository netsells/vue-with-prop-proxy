import withPropProxy, { getPropEmitName, generateComputedProxy } from '../src/index';

const commonProxy = {
    get: expect.any(Function),
    set: expect.any(Function),
};

describe('getPropEmitName', () => {
    it('returns `input` when passed `value`', () => {
        expect(getPropEmitName('value')).toBe('input');
    });

    it('returns `update:prop` when passed `prop`', () => {
        expect(getPropEmitName('prop')).toBe('update:prop');
    });
});

describe('generateComputedProxy', () => {
    it('returns getter and setter based on prop', () => {
        expect(generateComputedProxy('prop')).toEqual(commonProxy);
    });
});

describe('withPropProxy', () => {
    describe('with no props', () => {
        it('adds no proxies', () => {
            expect(withPropProxy([]).computed).toEqual({});
        });
    });

    describe('with one prop as string', () => {
        it('adds a proxy', () => {
            expect(withPropProxy('foo').computed).toEqual({
                fooProxy: commonProxy,
            });
        });
    });

    describe('with empty options supplied', () => {
        it('uses the default options', () => {
            expect(withPropProxy('foo', {}).computed).toEqual({
                fooProxy: commonProxy,
            });
        });
    });

    describe('with one prop as an array', () => {
        it('adds a proxy', () => {
            expect(withPropProxy(['bar']).computed).toEqual({
                barProxy: commonProxy,
            });
        });
    });

    describe('with two props as an array', () => {
        it('adds a proxy', () => {
            expect(withPropProxy(['foo', 'bar']).computed).toEqual({
                fooProxy: commonProxy,
                barProxy: commonProxy,
            });
        });
    });

    describe('when suffix changed', () => {
        it('adds a proxy with a different suffix', () => {
            expect(withPropProxy('foo', { suffix: 'Model' }).computed).toEqual({
                fooModel: commonProxy,
            });
        });
    });

    describe('when suffix empty string', () => {
        it('throws an error', () => {
            expect(() => {
                withPropProxy('foo', { suffix: '' });
            }).toThrow(new Error('You must have a suffix for your proxies props'));
        });
    });

    describe('when suffix falsy', () => {
        it('throws an error', () => {
            expect(() => {
                withPropProxy('foo', { suffix: null });
            }).toThrow(new Error('You must have a suffix for your proxies props'));
        });
    });

    describe('when suffix falsy but prop object', () => {
        it('does not throw an error', () => {
            expect(() => {
                withPropProxy({ prop: 'foo', via: 'fooModel' }, { suffix: null });
            }).not.toThrow();
        });
    });

    describe('when suffix falsy, one prop object, one prop string', () => {
        it('throws an error', () => {
            expect(() => {
                withPropProxy(['bar', { prop: 'foo', via: 'fooModel' }], { suffix: null });
            }).toThrow(new Error('You must have a suffix for your proxies props'));
        });
    });

    describe('when object passed', () => {
        it('uses object options instead of suffix', () => {
            expect(withPropProxy({ prop: 'foo', via: 'fooModel' }).computed)
                .toEqual({
                    fooModel: commonProxy,
                });
        });
    });
});
