var fs = require("fs");
var fcl = require("../lib/fcl");

fs.readFile("./examples/test.fcl", "utf8", function (err, data) {
    "use strict";

    if (err) {
        return console.log(err);
    }

    var res = fcl.parse(data);
    var json = res.toJSON();

    fs.writeFile("test.json", JSON.stringify(json), function (err) {

    });

    return res;

});