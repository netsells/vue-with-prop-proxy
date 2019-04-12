[![npm version](https://badge.fury.io/js/%40netsells%2Fvue-with-prop-proxy.svg)](https://badge.fury.io/js/%40netsells%2Fvue-with-prop-proxy)
[![Build Status](https://travis-ci.com/netsells/vue-with-prop-proxy.svg?branch=master)](https://travis-ci.com/netsells/vue-with-prop-proxy)
[![codecov](https://codecov.io/gh/netsells/vue-with-prop-proxy/branch/master/graph/badge.svg)](https://codecov.io/gh/netsells/vue-with-prop-proxy)
[![Mutation testing badge](https://badge.stryker-mutator.io/github.com/netsells/vue-with-prop-proxy/master)](https://stryker-mutator.github.io)

# Vue With Prop Proxy

A mixin to make it easy to bind prop values to models or synced props on child
components

## Usage

You can pass a string, an object, or an array of either to configure your
proxies. The second argument is the options and lets you change the suffix
for proxies if just passed a string.

```javascript
import withPropProxy from '@netsells/vue-with-prop-proxy';

export default {
    mixins: [withPropProxy('value')],

    props: ['value'],

    template: `<input v-model="valueProxy" />`
}
```

### Changing the suffix

```javascript
import withPropProxy from '@netsells/vue-with-prop-proxy';

export default {
    mixins: [withPropProxy('value', { suffix: 'Model' })],

    props: ['value'],

    template: `<input v-model="valueModel" />`
}
```

### Using multiple props

```javascript
import withPropProxy from '@netsells/vue-with-prop-proxy';

export default {
    mixins: [withPropProxy(['value', 'name'])],

    props: ['value', 'name'],

    template: `
        <div>
            <input v-model="valueProxy" />
            <input v-model="nameProxy" />
        </div>
    `
}
```

### Using an object

```javascript
import withPropProxy from '@netsells/vue-with-prop-proxy';

export default {
    mixins: [withPropProxy({ prop: 'value', via: 'model' })],

    props: ['value'],

    template: `<input v-model="model" />`
}
```
