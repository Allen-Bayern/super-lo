# Super Lo

A collection of utility functions inspired by Python's built-in functions, designed to make JavaScript/TypeScript development more efficient and Pythonic.

## Features

-   🚀 **Type-Safe**: Full TypeScript support with comprehensive type definitions
-   🛡️ **Safe Operations**: Graceful handling of edge cases and null/undefined values
-   🔄 **Collection Support**: Works with various JavaScript collections (Objects, Arrays, Maps, Sets)
-   📚 **Comprehensive Documentation**: Detailed documentation in both English and Chinese

## Installation

```bash
npm install super-lo
# or
yarn add super-lo
# or
pnpm add super-lo
```

## Available Functions

### `deepFreeze`

Deeply freezes an object and all its nested properties, making them read-only.

```typescript
import { deepFreeze } from 'super-lo';

const obj = {
    name: 'John',
    address: {
        street: '123 Main St',
        city: 'New York',
    },
};

const frozen = deepFreeze(obj);
// frozen.name = 'Jane'; // Error: Cannot assign to read-only property
```

### `divmod`

Calculates both the quotient and remainder of integer division in a single operation.

```typescript
import { divmod } from 'super-lo';

const [quotient, remainder] = divmod(10, 3);
// quotient = 3
// remainder = 1
```

### `getattr`

Safely retrieves property values from objects with default value support.

```typescript
import { getattr } from 'super-lo';

const obj = { name: 'John', age: 30 };
const name = getattr(obj, 'name'); // 'John'
const email = getattr(obj, 'email', 'default@example.com'); // 'default@example.com'
```

### `safeObjectKeys`

Safely retrieves keys from objects, with support for various collection types and optional Symbol key inclusion.

```typescript
import { safeObjectKeys } from 'super-lo';

const obj = { a: 1, b: 2 };
const keys = safeObjectKeys(obj); // ['a', 'b']

const sym = Symbol('key');
const objWithSymbol = { [sym]: 'value', a: 1 };
const keysWithSymbol = safeObjectKeys(objWithSymbol, true); // ['a', sym]
```

## Documentation

For detailed documentation, please visit:

-   [English Documentation](docs/en/)
-   [中文文档](docs/zh-hans/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
