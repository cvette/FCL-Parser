var fs = require("fs");
var fcl = require("../lib/fcl_parser").Parser();

fs.readFile("./examples/test.fcl", "utf-8", function (err, data) {
    "use strict";

    if (err) {
        return console.log(err);
    }

    return;

});