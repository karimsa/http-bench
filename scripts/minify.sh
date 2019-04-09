#!/bin/bash -e

export PATH="$PATH:./node_modules/.bin"

## Bundle up (& use prettier for spacing, not babel - to ensure fairness between the benchmarks)
rollup -c
prettier --write benchmarks/express-minified.js
bundleSize="$[0+$(cat benchmarks/express-minified.js | tr -d '[:space:]' | wc -c)]"
echo "Bundled size: $bundleSize bytes, $[0+$(cat benchmarks/express-minified.js | wc -l)] LOC"
cp benchmarks/express-minified.js benchmarks/express-minified.bundle.js

## Compile with babel for minification
terser \
	--compress pure_getters=true \
	--mangle \
	--beautify \
	--toplevel \
	--module \
	benchmarks/express-minified.js > benchmarks/express-minified.js.2
mv benchmarks/express-minified.js.2 benchmarks/express-minified.js

## Prettify for debugging
prettier --write benchmarks/express-minified.js
minSize="$[0+$(cat benchmarks/express-minified.js | tr -d '[:space:]' | wc -c)]"
echo "Minified (with spaces): $minSize bytes ($[$bundleSize-$minSize]), $[0+$(cat benchmarks/express-minified.js | wc -l)] LOC"
