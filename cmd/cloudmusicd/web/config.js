let mapping = {
    'angular2': 'node_modules/angular2',
    'rxjs': 'node_modules/rxjs',
    "big-integer": "node_modules/big-integer/BigInteger",
    "crypto-browserify": "node_modules/crypto-browserify/index",
}

System.config({
    defaultJSExtensions: true,
    map: mapping
});
System.import('src/app');

