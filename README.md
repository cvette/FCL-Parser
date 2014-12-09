FCL - Parser
--------
A parser for the Fuzzy Control Language (FCL) standardized by IEC 61131-7. FCL is a domain-specific programming language for fuzzy logic.

###TODO
* Testing


###Install
There is no official release, yet. You can install it via this git repository for now:

```
npm install git+http://github.com/cvette/FCL-Parser.git
```

###Usage
The parser can either be used directly in JavaScript or via the command line interface.

####JavaScript
Parses the specified input and creates an abstract syntax tree (AST).
```javascript
var fcl = require("fcl-parser").Parser();
var result = fcl.parse("<FCL DEFINITION>");
```

####Command Line Interface
Parses the input and writes the AST to a JSON file.
```
Usage: fcl-parser [options] <filename>

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -o, --outputFile [value]  JSON output file
    -d, --debug               debug messages
```
