# http-bench

PoC examples for my talk @ ForwardJS Ottawa 2019.

Slides: https://slides.com/karimalibhai/js-perf-2019

## Usage

### Source files

The source code for the example is in the following files:

- pure express code: [benchmarks/express.js](benchmarks/express.js)
- express-like code with macros: [src/express.js](src/express.js)
- node bare http code: [benchmarks/bare.js](benchmarks/bare.js)

### Building the rest

There are two examples that get compiled:

- `express-macros`: this example uses `babel-plugin-macros` to show an express-like API that gets compiled into bare node http code.
- `express-minified`: this example is just a bundled + minified copy of the express example.

To build these examples, simply run `npm run build`.

### Scripts

- `./scripts/bench-boot`: takes a number & a command as a string - will execute the command that many times and display the average command startup time.
- `./scripts/bench`: takes a number & a space-separated list of benchmark names. Runs benchmarks for those examples via the fastify benchmarks toolset & displays the results.
- `./scripts/_bench`: same args as `./scripts/bench` but will not display the results.
- `./scripts/display`: takes a space-separated list of benchmarks names & only displays the results (does not run the benchmarks).

## License

Licensed under MIT license.

Repository is forked from [fastify benchmarks](https://github.com/fastify/benchmarks) (also under MIT license).
