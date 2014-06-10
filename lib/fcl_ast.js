"use strict";

function AST() {
    var self = this,
        symbols = {};

    /** basic ast node */
    function AstNode(line, column, properties, children) {
        this.line = line;
        this.column = column;
        this.properties = properties;
        this.children = children;

        this.simplify = function () {

            /** handle all child nodes */
            function handleChildren(children) {
                var objs = [];

                children.forEach(function (child) {
                    if(child === undefined) return;
                    if (typeof child.toJSON === 'function') {
                        objs.push(child.toJSON());
                    } else {
                        objs.push(child);
                    }
                });

                return objs;
            }

            var node = {
                type: this.type,
                line: this.line,
                column: this.column,
                properties: this.properties
            };

            if (this.children !== undefined && this.children.length > 0) {
                node.children = handleChildren(this.children);
            }

            return node;
        };
    }

    var addTerm = function (line, column, symbol, term) {

        if (symbols[self.Scope.FUNCTION_BLOCK][symbol].terms == undefined) {
            symbols[self.Scope.FUNCTION_BLOCK][symbol].terms = [];
        }

        var terms = symbols[self.Scope.FUNCTION_BLOCK][symbol].terms;

        if(terms.indexOf(term) > -1) {
            throw new Error("Term already defined at line " + symbols[self.Scope.FUNCTION_BLOCK][symbol].line  +  ' [' + line  + ':' + column + ']');
        }

        terms.push(term);
    };

    var useTerm = function (line, column, symbol, term) {
        if (symbols[self.Scope.FUNCTION_BLOCK][symbol].terms === undefined
                || symbols[self.Scope.FUNCTION_BLOCK][symbol].terms.indexOf(term) === -1) {
            throw new Error('Term ' + term + ' is not defined for variable ' + symbol);
        }
    };

    var declareSymbol = function (line, column, symbol, typeNode, scope, variableType) {

        // make FunctionBlock default scope
        if (scope === undefined) {
            scope = self.Scope.FUNCTION_BLOCK;
        }

        // init scope property
        if (symbols[scope] === undefined) {
            symbols[scope] = {};
        }

        // check if symbol is already defined within scope
        if(symbols[scope][symbol] !== undefined) {
            throw new Error('Symbol "' + symbol + '" has already been defined on line ' + symbols[scope][symbol].line  +  ' [' + line  + ':' + column + ']');
        }

        var type = typeNode.type;

        if (type === self.NodeTypes.SIMPLE_SPEC_INIT) {
            type = typeNode.properties.type;
        }

        symbols[scope][symbol] = {type: type, line: line, column: column, variableType: variableType, fuzzyfied: false};

        console.log(symbols[scope][symbol]);
    };

    var useSymbol = function (line, column, symbol, scope, usageType) {
        // make global default scope
        if (scope === undefined) {
            scope = self.Scope.FUNCTION_BLOCK;
        }

        if (symbols[scope][symbol] === undefined) {
            throw new ReferenceError(symbol + ' is not defined [' + line  + ':' + column + ']');
        }

        if(symbols[scope][symbol].variableType !== usageType && symbols[scope][symbol].variableType !== self.VariableType.IN_OUT) {
            if(symbols[scope][symbol].variableType === self.VariableType.INPUT) {
                throw new Error(symbol + ' is defined as an input variable but used as output' +  ' [' + line  + ':' + column + ']');
            } else {
                throw new Error(symbol + ' is defined as an output variable but used as input' +  ' [' + line  + ':' + column + ']');
            }

        }
    };

    var clearSymbols = function () {
        symbols = {};
    };

    self.Library = function (line, column, properties, children) {
        this.type = self.NodeTypes.LIBRARY;
        AstNode.call(this, line, column, properties, children);
        clearSymbols();
    };

    self.Library.prototype = Object.create(AstNode.prototype);


    /** Function Block
     *  properties: name
     * */
    self.FunctionBlock = function (line, column, properties, children) {
        this.type = self.NodeTypes.FUNCTION_BLOCK;
        AstNode.call(this, line, column, properties, children);
        declareSymbol(line, column, properties.name, this, self.Scope.LIBRARY);

        //clear function block scope
        symbols[self.Scope.FUNCTION_BLOCK] = {};
    };

    self.FunctionBlock.prototype = Object.create(AstNode.prototype);


    /** InputDeclarations */
    self.InputDeclarations = function (line, column, properties, children) {
        this.type = self.NodeTypes.INPUT_DECLARATIONS;
        AstNode.call(this, line, column, properties, children);
    };

    self.InputDeclarations.prototype = Object.create(AstNode.prototype);

    /**
     * InputDeclaration
     * properties: names
     * */
    self.InputDeclaration = function (line, column, properties, children) {
        this.type = self.NodeTypes.INPUT_DECLARATION;
        AstNode.call(this, line, column, properties, children);

        for(var i=0; i < properties.names.length; i++) {
            declareSymbol(line, column, properties.names[i], children[0], self.Scope.FUNCTION_BLOCK, self.VariableType.INPUT);
        }
    };

    self.InputDeclaration.prototype = Object.create(AstNode.prototype);

    /** OutputDeclarations */
    self.OutputDeclarations = function (line, column, properties, children) {
        this.type = self.NodeTypes.OUTPUT_DECLARATIONS;
        AstNode.call(this, line, column, properties, children);

        for(var i = 0; i < children.length; i++) {
            for(var j = 0; j < children[i].properties.names.length; j++) {
                symbols[self.Scope.FUNCTION_BLOCK][children[i].properties.names[j]].variableType = self.VariableType.OUTPUT;
            }
        }
    };

    self.OutputDeclarations.prototype = Object.create(AstNode.prototype);


    /** InputOutputDeclarations */
    self.InputOutputDeclarations = function (line, column, properties, children) {
        this.type = self.NodeTypes.INPUT_OUTPUT_DECLARATIONS;
        AstNode.call(this, line, column, properties, children);
    };

    self.InputOutputDeclarations.prototype = Object.create(AstNode.prototype);

    /** VarDeclarations */
    self.VarDeclarations = function (line, column, properties, children) {
        this.type = self.NodeTypes.VAR_DECLARATIONS;
        AstNode.call(this, line, column, properties, children);
    };

    self.VarDeclarations.prototype = Object.create(AstNode.prototype);

    /** SimpleSpecInit */
    self.SimpleSpecInit = function (line, column, properties, children) {
        this.type = self.NodeTypes.SIMPLE_SPEC_INIT;
        AstNode.call(this, line, column, properties, children);
    };

    self.SimpleSpecInit.prototype = Object.create(AstNode.prototype);


    /** AccumulationMethod */
    self.AccumulationMethod = function (line, column, properties, children) {
        this.type = self.NodeTypes.ACCUMULATION_METHOD;
        AstNode.call(this, line, column, properties, children);
    };

    self.AccumulationMethod.prototype = Object.create(AstNode.prototype);

    /**
     * Rule Block
     * properties: id
     * */
    self.RuleBlock = function (line, column, properties, children) {
        this.type = self.NodeTypes.RULE_BLOCK;
        AstNode.call(this, line, column, properties, children);
        declareSymbol(line, column, properties.id, this);
    };

    self.RuleBlock.prototype = Object.create(AstNode.prototype);


    /**
     * OperatorDefinition
     * properties: andMethod, orMethod
     */
    self.OperatorDefinition = function (line, column, properties, children) {
        this.type = self.NodeTypes.OPERATOR_DEFINITION;

        console.log(properties);

        if ((properties.andMethod === self.OperatorAlgorithms.MIN && properties.orMethod !== self.OperatorAlgorithms.MAX)
            || (properties.andMethod === self.OperatorAlgorithms.PROD && properties.orMethod !== self.OperatorAlgorithms.ASUM)
            || (properties.andMethod === self.OperatorAlgorithms.BDIF && properties.orMethod !== self.OperatorAlgorithms.BSUM)) {

            console.warn('Line ' + line + ': Operator algorithms should be used pairwise'  +  ' [' + line  + ':' + column + ']');
            console.warn('Use one of these combinations: MIN and MAX, PROD and ASUM, BDIF and BSUM');
        }

        AstNode.call(this, line, column, properties, children);
    };

    self.OperatorDefinition.prototype = Object.create(AstNode.prototype);

    /** Rule */
    self.Rule = function (line, column, properties, children) {
        this.type = self.NodeTypes.RULE;
        AstNode.call(this, line, column, properties, children);
    };

    self.Rule.prototype = Object.create(AstNode.prototype);

    /**
     * WeightingFactor
     * properties: factor
     * */
    self.WeightingFactor = function (line, column, properties, children) {
        this.type = self.NodeTypes.WEIGHTING_FACTOR;
        AstNode.call(this, line, column, properties, children);

        if(typeof properties.factor === 'string') {
            useSymbol(line, column, properties.factor, self.Scope.FUNCTION_BLOCK, self.VariableType.INPUT);
        }
    };

    self.WeightingFactor.prototype = Object.create(AstNode.prototype);

    self.FunctionBlockBody = function (line, column, properties, children) {
        this.type = self.NodeTypes.FUNCTION_BLOCK_BODY;
        AstNode.call(this, line, column, properties, children);
    };

    self.FunctionBlockBody.prototype = Object.create(AstNode.prototype);

    /** Condition */
    self.Condition = function (line, column, properties, children) {
        this.type = self.NodeTypes.CONDITION;
        AstNode.call(this, line, column, properties, children);
    };

    self.Condition.prototype = Object.create(AstNode.prototype);

    /** Conjunction */
    self.Conjunction = function (line, column, properties, children) {
        this.type = self.NodeTypes.CONJUNCTION;
        AstNode.call(this, line, column, properties, children);
    };

    self.Conjunction.prototype = Object.create(AstNode.prototype);

    /** Disjunction */
    self.Disjunction = function (line, column, properties, children) {
        this.type = self.NodeTypes.DISJUNCTION;
        AstNode.call(this, line, column, properties, children);
    };

    self.Disjunction.prototype = Object.create(AstNode.prototype);

    /** X */
    self.X = function (line, column, properties, children) {
        this.type = self.NodeTypes.X;
        AstNode.call(this, line, column, properties, children);
    };

    self.X.prototype = Object.create(AstNode.prototype);


    /** Subcondition */
    self.Subcondition = function (line, column, properties, children) {
        this.type = self.NodeTypes.SUBCONDITION;
        AstNode.call(this, line, column, properties, children);

        if(children.length === 1 && typeof children[0] === 'string') {
            useSymbol(line, column, children[0], self.Scope.FUNCTION_BLOCK, self.VariableType.INPUT);
        } else if(typeof children[0].type === self.NodeTypes.EQUATION) {
            useSymbol(line, column, children[0].properties.a, self.Scope.FUNCTION_BLOCK, self.VariableType.INPUT);
        }
    };

    self.Subcondition.prototype = Object.create(AstNode.prototype);

    /** Equation */
    self.Equation = function (line, column, properties, children) {
        this.type = self.NodeTypes.EQUATION;
        AstNode.call(this, line, column, properties, children);

        useTerm(line, column, properties.a, properties.b);
    };

    self.Equation.prototype = Object.create(AstNode.prototype);

    /** Conclusion */
    self.Conclusion = function (line, column, properties, children) {
        this.type = self.NodeTypes.CONCLUSION;
        AstNode.call(this, line, column, properties, children);

        for(var i=0; i < children.length; i++) {
            if(typeof children[i] === 'string') {
                useSymbol(line, column, children[i], self.Scope.FUNCTION_BLOCK, self.VariableType.OUTPUT);
            } else if(typeof children[i].type === self.NodeTypes.EQUATION) {
                useSymbol(line, column, children[i].properties.a, self.Scope.FUNCTION_BLOCK, self.VariableType.OUTPUT);
            }
        }
    };

    self.Conclusion.prototype = Object.create(AstNode.prototype);

    /**
     * Defuzzify Block
     * properties: variable
     * */
    self.DefuzzifyBlock = function (line, column, properties, children) {
        this.type = self.NodeTypes.DEFUZZIFY_BLOCK;
        AstNode.call(this, line, column, properties, children);

        useSymbol(line, column, properties.variable, self.Scope.FUNCTION_BLOCK, self.VariableType.OUTPUT);

        for(var i = 0; i < children.length; i++) {
            if (children[i] !== undefined && children[i].type === self.NodeTypes.LINGUISTIC_TERM) {
                addTerm(line, column, properties.variable, children[i].properties.name);
            }
        }
    };

    self.DefuzzifyBlock.prototype = Object.create(AstNode.prototype);

    /** Defuzzification Method */
    self.DefuzzificationMethod = function (line, column, properties, children) {
        this.type = self.NodeTypes.DEFUZZIFICATION_METHOD;
        AstNode.call(this, line, column, properties, children);
    };

    self.DefuzzificationMethod.prototype = Object.create(AstNode.prototype);

    /** Activation Method */
    self.ActivationMethod = function (line, column, properties, children) {
        this.type = self.NodeTypes.ACTIVATION_METHOD;
        AstNode.call(this, line, column, properties, children);
    };

    self.ActivationMethod.prototype = Object.create(AstNode.prototype);

    /**
     * Fuzzify Block
     * properties: variable
     * */
    self.FuzzifyBlock = function (line, column, properties, children) {
        this.type = self.NodeTypes.FUZZIFY_BLOCK;
        AstNode.call(this, line, column, properties, children);

        useSymbol(line, column, properties.variable, self.Scope.FUNCTION_BLOCK, self.VariableType.INPUT);

        for(var i = 0; i < children.length; i++) {
            if (children[i].type === self.NodeTypes.LINGUISTIC_TERM) {
                addTerm(line, column, properties.variable, children[i].properties.name);
            }
        }

    };
    self.FuzzifyBlock.prototype = Object.create(AstNode.prototype);

    /** Membership Function */
    self.MembershipFunction = function (line, column, properties, children) {
        this.type = self.NodeTypes.MEMBERSHIP_FUNCTION;
        AstNode.call(this, line, column, properties, children);
    };

    self.MembershipFunction.prototype = Object.create(AstNode.prototype);

    /** Term */
    self.LinguisticTerm = function (line, column, properties, children) {
        this.type = self.NodeTypes.LINGUISTIC_TERM;
        AstNode.call(this, line, column, properties, children);
    };

    self.LinguisticTerm.prototype = Object.create(AstNode.prototype);

    /** Range */
    self.DefaultValue = function (line, column, properties, children) {
        this.type = self.NodeTypes.DEFAULT_VALUE;
        AstNode.call(this, line, column, properties, children);
    };

    self.DefaultValue.prototype = Object.create(AstNode.prototype);

    /** Range */
    self.Range = function (line, column, properties, children) {
        this.type = self.NodeTypes.RANGE;
        AstNode.call(this, line, column, properties, children);
    };

    self.Range.prototype = Object.create(AstNode.prototype);

    /** Point */
    self.Point = function (line, column, properties, children) {
        this.type = self.NodeTypes.POINT;
        AstNode.call(this, line, column, properties, children);

        if (typeof properties.x === 'string') {
            useSymbol(line, column, properties.x, self.Scope.FUNCTION_BLOCK, self.VariableType.INPUT);
        }
    };

    self.Point.prototype = Object.create(AstNode.prototype);

    /** VarDeclaration */
    self.VarDeclaration = function (line, column, properties, children) {
        this.type = self.NodeTypes.VAR_DECLARATION;
        AstNode.call(this, line, column, properties, children);

        for(var i=0; i < properties.names.length; i++) {
            declareSymbol(line, column, properties.names[i], children[0], self.Scope.FUNCTION_BLOCK, self.VariableType.IN_OUT);
        }
    };

    self.VarDeclaration.prototype = Object.create(AstNode.prototype);

    /** VarInitDecl */
    self.VarInitDecl = function (line, column, properties, children) {
        this.type = self.NodeTypes.VAR_INIT_DECL;
        AstNode.call(this, line, column, properties, children);

        for(var i=0; i < properties.names.length; i++) {
            declareSymbol(line, column, properties.names[i], children[0]);
        }
    };

    self.VarInitDecl.prototype = Object.create(AstNode.prototype);

    /**
     * Singleton
     * properties: value
     * */
    self.Singleton = function (line, column, properties, children) {
        this.type = self.NodeTypes.SINGLETON;
        AstNode.call(this, line, column, properties, children);

        if(typeof properties.value === 'string') {
            useSymbol(line, column, properties.value, self.Scope.FUNCTION_BLOCK, self.VariableType.INPUT);
        }
    };

    self.Singleton.prototype = Object.create(AstNode.prototype);
}


AST.prototype.DataTypes = {
    REAL:      "Real",
    INTEGER:   "Integer"
};

AST.prototype.DefuzzificationMethods = {
    COG:    "CoG",
    COGS:   "CoGS",
    COA:    "CoA",
    LM:     "LM",
    RM:     "RM"
};

AST.prototype.OperatorAlgorithms = {
    MAX:  "MAX",
    MIN:  "MIN",
    ASUM: "ASUM",
    PROD: "PROD",
    BSUM: "BSUM",
    BDIF: "BDIF"
};

/** NODES */

/** all possible node types enum */
AST.prototype.NodeTypes = {
    LIBRARY:                    "Library",
    FUNCTION_BLOCK:             "FunctionBlock",
    FUNCTION_BLOCK_BODY:        "FunctionBlockBody",
    INPUT_DECLARATIONS:         "InputDeclarations",
    INPUT_DECLARATION:          "InputDeclaration",
    OUTPUT_DECLARATIONS:        "OutputDeclarations",
    INPUT_OUTPUT_DECLARATIONS:  "InputOutputDeclarations",
    VAR_DECLARATIONS:           "VarDeclarations",
    SIMPLE_SPEC_INIT:           "SimpleSpecInit",
    RULE:                       "Rule",
    RULE_BLOCK:                 "RuleBlock",
    CONDITION:                  "Condition",
    SUBCONDITION:               "Subcondition",
    CONJUNCTION:                "Conjunction",
    DISJUNCTION:                "Disjunction",
    X:                          "X",
    EQUATION:                   "Equation",
    CONCLUSION:                 "Conclusion",
    DEFUZZIFY_BLOCK:            "DefuzzifyBlock",
    DEFUZZIFICATION_METHOD:     "DefuzzificationMethod",
    OPERATOR_DEFINITION:        "OperatorDefinition",
    FUZZIFY_BLOCK:              "FuzzifyBlock",
    ACTIVATION_METHOD:          "ActivationMethod",
    LINGUISTIC_TERM:            "LinguisticTerm",
    MEMBERSHIP_FUNCTION:        "MembershipFunction",
    SINGLETON:                  "Singleton",
    POINT:                      "Point",
    DEFAULT_VALUE:              "DefaultValue",
    ACCUMULATION_METHOD:        "AccumulationMethod",
    WEIGHTING_FACTOR:           "WeightingFactor",
    VAR_DECLARATION:            "VarDeclaration",
    VAR_INIT_DECL:              "VarInitDecl"
};

AST.prototype.Scope = {
    LIBRARY:            "Library",
    FUNCTION_BLOCK:     "FunctionBlock"
};

AST.prototype.VariableType = {
    INPUT:      "Input",
    OUTPUT:     "Output",
    IN_OUT:     "InOut"
};

exports.AST = function() {
  return new AST();
};