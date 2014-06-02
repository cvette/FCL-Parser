#!/usr/bin/env node

var program = require('commander');
var pjson = require('./../package.json');
var fs = require('fs');
var fcl = require('../lib/fcl');
var path = require('path');

program
    .version(pjson.version)
    .usage('[options] <filename>')
    .option('-o, --outputFile [value]', 'JSON output file')
    .option('-d, --debug', 'debug messages')
    .parse(process.argv);

if(program.debug) {
    console.log('debug mode is not implemented yet');
}

if(program.args.length === 0) {
    console.log('you need to specify an input file');
    process.exit(1);
}

var extension = path.extname(program.args[0]);
var basename = path.basename(program.args[0], extension);
var outputFile = basename + '.json';

if(program.outputFile && program.outputFile.length !== 0) {
    outputFile = program.outputFile;
}

fs.readFile(program.args[0], "utf8", function (err, data) {
    "use strict";

    if (err) {
        console.log('could not open input file "' + program.args[0] + '"');
        process.exit(1);
    }

    var res = fcl.parse(data);
    var json = res.toJSON();

    fs.writeFile(outputFile, JSON.stringify(json, undefined, 2), function (err) {
        if(err) {
            console.log('could not write to output file "' + outputFile + '"');
            process.exit(1);
        } else {
            process.exit(0);
        }
    });
});

