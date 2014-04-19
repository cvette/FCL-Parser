var ParserGenerator = require("./fcl_parser_generator");

function FclParser() {
    var self = this;
    var parserGenerator;
    var parserPath = "./fcl_generated_parser.js";

    self.generator = function () {
        if(parserGenerator === undefined) parserGenerator = ParserGenerator();

        return parserGenerator;
    };

    self.parse = function (input) {
        var parser = require(parserPath).parser;
        parser.yy = require("./fcl_ast");

        return parser.parse(input);
    };
}

module.exports = function() {
    return new FclParser();
};