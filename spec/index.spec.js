import withPropProxy from '../src/index';

describe('withPropProxy', () => {
    const commonProxy = {
        get: expect.any(Function),
        set: expect.any(Function),
    };

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
});
