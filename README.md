# kontenbase-data-grid

[![npm-badge]][npm-url]
[![type-badge]][npm-url]
[![size-badge]][size-url]

[npm-badge]: https://img.shields.io/npm/v/kontenbase-data-grid
[npm-url]: https://www.npmjs.com/package/kontenbase-data-grid
[size-badge]: https://img.shields.io/bundlephobia/minzip/kontenbase-data-grid
[size-url]: https://bundlephobia.com/result?p=kontenbase-data-grid
[type-badge]: https://img.shields.io/npm/types/kontenbase-data-grid

## Install

```sh
npm install kontenbase-data-grid
```

kontenbase-data-grid is published as ES2019 modules, you'll probably want to transpile those down to scripts for the browsers you target using [Babel](https://babeljs.io/) and [browserslist](https://github.com/browserslist/browserslist).

<details>
<summary>Example browserslist configuration file</summary>

```
last 2 chrome versions
last 2 edge versions
last 2 firefox versions
last 2 safari versions
```

See [documentation](https://github.com/browserslist/browserslist)

</details>

<details>
<summary>Example babel.config.json file</summary>

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "bugfixes": true,
        "shippedProposals": true,
        "corejs": 3,
        "useBuiltIns": "entry"
      }
    ]
  ]
}
```

See [documentation](https://babeljs.io/docs/en/)

- It's important that the configuration filename be `babel.config.*` instead of `.babelrc.*`, otherwise Babel might not transpile modules under `node_modules`.
- We recommend polyfilling modern JS features with [core-js](https://www.npmjs.com/package/core-js) by adding the following snippet at the top of your bundle's entry file:
  ```js
  import 'core-js/stable';
  ```
  - Babel's `env` preset, if configured correctly, will transform this import so only the necessary polyfills are included in your bundle.
- Polyfilling the [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) API is required for older browsers.
</details>

<details>
<summary>Webpack configuration with babel-loader</summary>

```js
{
  // ...
  module: {
    rules: {
      test: /\.js$/,
      exclude: /node_modules[/\\](?!kontenbase-data-grid[/\\]lib)/,
      use: 'babel-loader'
    }
  }
}
```

See [documentation](https://github.com/babel/babel-loader)

</details>

<details>
<summary>rollup.js configuration with @rollup/plugin-babel</summary>

```js
{
  // ...
  plugins: {
    babel({
      include: ['./src/**/*', './node_modules/kontenbase-data-grid/lib/**/*']
    });
  }
}
```

See [documentation](https://github.com/rollup/plugins/tree/master/packages/babel)

</details>

## Usage

```jsx
import DataGrid from 'kontenbase-data-grid';

const columns = [
  { key: 'id', name: 'ID' },
  { key: 'title', name: 'Title' }
];

const rows = [
  { id: 0, title: 'Example' },
  { id: 1, title: 'Demo' }
];

function App() {
  return <DataGrid columns={columns} rows={rows} />;
}
```

## Documentation

- [Website](https://adazzle.github.io/kontenbase-data-grid/canary/)
  - [Source code](stories)
- [Old website for kontenbase-data-grid v5](https://adazzle.github.io/kontenbase-data-grid/)
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)
