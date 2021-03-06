import { mount } from '@vue/test-utils';

import withPropProxy, { helpers } from '../src/index';

const commonProxy = {
    get: expect.any(Function),
    set: expect.any(Function),
};

describe('withPropProxy', () => {
    let retVal;

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

    describe('with no props', () => {
        beforeEach(() => {
            retVal = withPropProxy([]);
        });

        it('adds no proxies', () => {
            expect(retVal.mixins).toEqual([]);
        });
    });

    describe('with one prop as string', () => {
        beforeEach(() => {
            retVal = withPropProxy('foo');
        });

        it('adds a proxy', () => {
            expect(retVal.mixins[0].computed).toEqual({
                fooProxy: commonProxy,
            });
        });

        it('adds no watchers', () => {
            expect(retVal.mixins[0].watch).toEqual({});
        });
    });

    describe('with empty options supplied', () => {
        it('uses the default options', () => {
            expect(withPropProxy('foo', {}).mixins[0].computed).toEqual({
                fooProxy: commonProxy,
            });
        });
    });

    describe('with one prop as an array', () => {
        it('adds a proxy', () => {
            expect(withPropProxy(['bar']).mixins[0].computed).toEqual({
                barProxy: commonProxy,
            });
        });
    });

    describe('with two props as an array', () => {
        beforeEach(() => {
            retVal = withPropProxy(['foo', 'bar']);
        });

        it('adds 2 mixins', () => {
            expect(retVal.mixins.length).toBe(2);
        });

        it('adds a proxy to both mixins', () => {
            expect(retVal.mixins[0].computed).toEqual({
                fooProxy: commonProxy,
            });

            expect(retVal.mixins[1].computed).toEqual({
                barProxy: commonProxy,
            });
        });
    });

    describe('when suffix changed', () => {
        it('adds a proxy with a different suffix', () => {
            expect(withPropProxy('foo', { suffix: 'Model' }).mixins[0].computed).toEqual({
                fooModel: commonProxy,
            });
        });
    });

    describe('when object passed', () => {
        it('uses object options instead of suffix', () => {
            expect(withPropProxy({ prop: 'foo', via: 'fooModel' }).mixins[0].computed)
                .toEqual({
                    fooModel: commonProxy,
                });
        });
    });
});

describe('with wrapped component', () => {
    const component = {
        template: `
            <div>
                <span class="model">{{ model }}</span>
                <span class="unsettableProxy">{{ unsettableProxy }}</span>
                <span class="itemProxy">{{ itemProxy }}</span>
                <span class="opt1">{{ opt1 }}</span>
                <span class="opt2">{{ opt2 }}</span>
            </div>
        `,

        mixins: [
            withPropProxy([
                { prop: 'value', via: 'model' },
                'unsettable',
                'item',
                { prop: 'optOne', via: 'opt1', optional: true },
                { prop: 'optTwo', via: 'opt2', optional: true },
            ]),
        ],

        props: {
            value: {
                type: String,
                required: true,
            },

            unsettable: {
                type: String,
                default: 'foo',
            },

            item: {
                type: Object,
                required: true,
            },

            optOne: {
                type: Number,
                default: 0,
            },

            optTwo: {
                type: Number,
                default: 0,
            },
        },
    };

    describe('when mounted', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = mount(component, {
                propsData: {
                    value: 'foo',
                    item: { id: 'foo' },
                    optOne: 5,
                },
            });
        });

        it('proxies the props via the getters', () => {
            expect(wrapper.find('.model').text()).toBe('foo');
            expect(wrapper.find('.itemProxy').text()).toBe(JSON.stringify({ id: 'foo' }, null, 2));
            expect(wrapper.find('.opt1').text()).toBe('5');
            expect(wrapper.find('.opt2').text()).toBe('0');
            expect(wrapper.find('.unsettableProxy').text()).toBe('foo');
        });

        it('does not add optional data for non optional props', () => {
            expect(wrapper.vm[helpers.getPropOptionalName('value')]).toBeFalsy();
            expect(wrapper.vm[helpers.getPropOptionalName('item')]).toBeFalsy();
            expect(wrapper.vm[helpers.getPropOptionalName('unsettable')]).toBeFalsy();
        });

        it('adds optional data for optional props', () => {
            expect(wrapper.vm[helpers.getPropOptionalName('optOne')]).toBeTruthy();
            expect(wrapper.vm[helpers.getPropOptionalName('optTwo')]).toBe(0);
        });

        describe('when setting model', () => {
            beforeEach(() => {
                wrapper.vm.model = 'bar';
            });

            it('emits a new value', () => {
                expect(wrapper.emitted().input[0]).toEqual(['bar']);
            });

            it('does not set the optional value', () => {
                const prop = helpers.getPropOptionalName('value');

                expect(wrapper.vm[prop]).toBeFalsy();
            });
        });

        describe('when setting unsettableProxy', () => {
            beforeEach(() => {
                wrapper.vm.unsettableProxy = 'bar';
            });

            it('emits a new value', () => {
                expect(wrapper.emitted()['update:unsettable'][0]).toEqual(['bar']);
            });
        });

        describe('when setting itemProxy', () => {
            beforeEach(() => {
                wrapper.vm.itemProxy = { id: 'bar' };
            });

            it('emits a new value', () => {
                expect(wrapper.emitted()['update:item'][0]).toEqual([{ id: 'bar' }]);
            });
        });

        describe('when setting opt1', () => {
            beforeEach(() => {
                wrapper.vm.opt1 = 8;
            });

            it('emits a new value', () => {
                expect(wrapper.emitted()['update:optOne'][0]).toEqual([8]);
            });

            it('sets the prop to the new value', () => {
                expect(wrapper.vm.opt1).toBe(8);
            });
        });

        describe('when setting opt2', () => {
            beforeEach(() => {
                wrapper.vm.opt2 = 9;
            });

            it('emits a new value', () => {
                expect(wrapper.emitted()['update:optTwo'][0]).toEqual([9]);
            });

            it('changes the proxy because there is no prop to change', () => {
                expect(wrapper.vm.opt2).toBe(9);
            });

            describe('when setting optTwo', () => {
                beforeEach(() => {
                    wrapper.setProps({
                        optTwo: 14,
                    });
                });

                it('changes the proxy to the new prop', () => {
                    expect(wrapper.find('.opt2').text()).toBe('14');
                });
            });
        });
    });
});
