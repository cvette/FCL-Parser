var chai = require('chai');
var should = chai.should();
var fs = require('fs');
var parser = require('../lib/fcl');
var ast = require('../lib/fcl_ast').AST();

describe('Valid Data', function () {
    var data, res, json;

    before(function (done) {
        data = fs.readFileSync('./test/data/valid/test1.fcl', "utf8");
        json = fs.readFileSync('./test/data/valid/test1.json', "utf8");
        done();
    });

    it('parse() should not throw any error', function () {

        var parse = function () {
            res = parser.parse(data);
            res = JSON.stringify(res);
        };

        parse.should.not.throw(Error);

        res.should.equal(json);
    });
});
