var fs = require('fs');

function FclParserGenerator() {
    var self = this;

    self.generate = function(filename) {
        try {
            var Parser = require("jison").Parser;
        } catch (err) {
            console.log("Jison is missing.");
            return;
        }

        var parser = new Parser(grammar);
        var parserSource = parser.generate();

        fs.writeFile(filename, parserSource, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("Parser has been created!");
            }
        });
    }
}

module.exports = function() {
    return new FclParserGenerator();
};


