"use strict";
require("angular2-universal-polyfills");
require("zone.js/dist/zone-node.js");
require("reflect-metadata");
require("./__workaround.browser.ts");
var window = global;
global.window = window;
var fs = require("fs");
var core_1 = require("@angular/core");
var compiler_1 = require("@angular/compiler");
var node_1 = require("angular2-universal/node");
var app_universal_1 = require("./src/app-universal");
var FileResourceLoader = (function () {
    function FileResourceLoader() {
    }
    FileResourceLoader.prototype.get = function (path) {
        return new Promise(function (resolve, reject) {
            fs.exists(path, function (exists) {
                if (!exists) {
                    return reject(new Error("Compilation failed. Resource file not found: " + path));
                }
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) {
                        return reject(new Error("Compilation failed. Read error for file: " + path + ": " + err));
                    }
                    return resolve(data);
                });
            });
        });
    };
    return FileResourceLoader;
}());
exports.FileResourceLoader = FileResourceLoader;
var document = fs.readFileSync('index.html').toString();
Zone.current.fork({
    name: 'universal',
    properties: { document: document }
}).run(function () {
    node_1.platformUniversalDynamic([{
            provide: core_1.COMPILER_OPTIONS,
            useValue: {
                providers: [{ provide: compiler_1.ResourceLoader, useValue: new FileResourceLoader() }],
            },
            multi: true,
        }])
        .serializeModule(app_universal_1.AppUniversalModule, {
        preboot: false
    })
        .then(function (html) {
        try {
            fs.mkdirSync('tmp/app-shell');
        }
        catch (e) { }
        fs.writeFileSync('tmp/app-shell/index.html', html, { encoding: 'utf8' });
    });
});
