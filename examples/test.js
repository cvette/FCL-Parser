var fs = require("fs");
var Parser = require("../lib/fcl_parser");
var fcl = Parser();

fs.readFile("./examples/test.fcl", "utf-8", function (err, data) {
    if(err) return console.log(err);

    var result = fcl.parse(data);
    return console.log(result);
});