var fs = require("fs");
var fcl = require("../lib/fcl");

fs.readFile("./examples/test.fcl", "utf8", function (err, data) {
    "use strict";

    if (err) {
        return console.log(err);
    }

    return fcl.parse(data);

});