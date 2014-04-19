var fs = require("fs");
var Parser = require("../lib/fcl_parser");
var parser = Parser();

parser.generator().generate("./lib/fcl_generated_parser.js");

fs.readFile("./examples/test.fcl", "utf-8", function (err, data) {
    if(err) return console.log(err);

    var result = parser.parse(data);
    return console.log(result);
});