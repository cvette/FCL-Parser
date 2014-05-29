"use strict";

/** all possible node types enum */
var NodeTypes = {
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
    POINT:                      "Point",
    DEFAULT_VALUE:              "DefaultValue",
    ACCUMULATION_METHOD:        "AccumulationMethod",
    WEIGHTING_FACTOR:           "WeightingFactor",
    VAR_DECLARATION:            "VarDeclaration",
    VAR_INIT_DECL:              "VarInitDecl"
};

exports.NodeTypes = NodeTypes;


var Scope = {
    GLOBAL:      "Global",
    RULE_BLOCKS: "RuleBlocks"
};

/* Symbol Table */
var symbols = {};

function AlreadyDefinedException(symbol) {
    this.message = 'Symbol "' + symbol + '" is already defined';

    this.toString = function () {
        return this.message;
    };
}

function declareSymbol(symbol, type, scope) {

    // make global default scope
    if(scope === undefined) {
        scope = Scope.GLOBAL;
    }

    // init scope property
    if(symbols[scope] === undefined) {
        symbols[scope] = {};
    }

    // check if symbol is already defined within scope
    if(symbols[scope][symbol] !== undefined) {
        throw new AlreadyDefinedException(symbol);
    }

    console.log("Declaration: " + symbol);
    symbols[scope][symbol] = type;
}



/** basic ast node */
function AstNode(line, column, properties, children) {
    this.line = line;
    this.column = column;
    this.properties = properties;
    this.children = children;

    //console.log("Line " + line + ":" + column + ": " + this.type);

    /**  */
    this.toJSON = function () {

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

exports.Library = function (line, column, properties, children) {
    this.type = NodeTypes.LIBRARY;
    AstNode.call(this, line, column, properties, children);
};

exports.Library.prototype = Object.create(AstNode.prototype);


/** Function Block
 *
 *  Properties: name
 * */
exports.FunctionBlock = function (line, column, properties, children) {
    this.type = NodeTypes.FUNCTION_BLOCK;
    AstNode.call(this, line, column, properties, children);

    declareSymbol(properties.name, this.type);
};

exports.FunctionBlock.prototype = Object.create(AstNode.prototype);


/** InputDeclarations */
exports.InputDeclarations = function (line, column, properties, children) {
    this.type = NodeTypes.INPUT_DECLARATIONS;
    AstNode.call(this, line, column, properties, children);
};

exports.InputDeclarations.prototype = Object.create(AstNode.prototype);

/**
 * InputDeclaration
 * properties: names
 * */
exports.InputDeclaration = function (line, column, properties, children) {
    this.type = NodeTypes.INPUT_DECLARATION;
    AstNode.call(this, line, column, properties, children);

    for(var i=0; i < properties.names.length; i++) {
        declareSymbol(properties.names[i], children[0].type);
    }
};

exports.InputDeclaration.prototype = Object.create(AstNode.prototype);

/** OutputDeclarations */
exports.OutputDeclarations = function (line, column, properties, children) {
    this.type = NodeTypes.OUTPUT_DECLARATIONS;
    AstNode.call(this, line, column, properties, children);
};

exports.OutputDeclarations.prototype = Object.create(AstNode.prototype);


/** InputOutputDeclarations */
exports.InputOutputDeclarations = function (line, column, properties, children) {
    this.type = NodeTypes.OUTPUT_DECLARATION;
    AstNode.call(this, line, column, properties, children);
};

exports.InputOutputDeclarations.prototype = Object.create(AstNode.prototype);

/** VarDeclarations */
exports.VarDeclarations = function (line, column, properties, children) {
    this.type = NodeTypes.VAR_DECLARATIONS;
    AstNode.call(this, line, column, properties, children);
};

exports.VarDeclarations.prototype = Object.create(AstNode.prototype);

/** SimpleSpecInit */
exports.SimpleSpecInit = function (line, column, properties, children) {
    this.type = NodeTypes.SIMPLE_SPEC_INIT;
    AstNode.call(this, line, column, properties, children);
};

exports.SimpleSpecInit.prototype = Object.create(AstNode.prototype);


/** AccumulationMethod */
exports.AccumulationMethod = function (line, column, properties, children) {
    this.type = NodeTypes.ACCUMULATION_METHOD;
    AstNode.call(this, line, column, properties, children);
};

exports.AccumulationMethod.prototype = Object.create(AstNode.prototype);

/**
 * Rule Block
 * properties: id
 * */
exports.RuleBlock = function (line, column, properties, children) {
    this.type = NodeTypes.RULE_BLOCK;
    AstNode.call(this, line, column, properties, children);
    declareSymbol(properties.id, this.type, Scope.RULE_BLOCKS);
};

exports.RuleBlock.prototype = Object.create(AstNode.prototype);


exports.OperatorDefinition = function (line, column, properties, children) {
    this.type = NodeTypes.OPERATOR_DEFINITION;

    if ((properties.andMethod === 'MIN' && properties.orMethod !== 'MAX')
        || (properties.andMethod === 'PROD' && properties.orMethod !== 'ASUM')
        || (properties.andMethod === 'BDIF' && properties.orMethod !== 'BSUM')) {

        console.warn('Line ' + line + ': Operator algorithms should be used pairwise.');
        console.warn('Use one of these combinations: MIN and MAX, PROD and ASUM, BDIF and BSUM');
    }

    AstNode.call(this, line, column, properties, children);
};

exports.OperatorDefinition.prototype = Object.create(AstNode.prototype);

/** Rule */
exports.Rule = function (line, column, properties, children) {
    this.type = NodeTypes.RULE;
    AstNode.call(this, line, column, properties, children);
};

exports.Rule.prototype = Object.create(AstNode.prototype);

/** WeightingFactor */
exports.WeightingFactor = function (line, column, properties, children) {
    this.type = NodeTypes.WEIGHTING_FACTOR;
    AstNode.call(this, line, column, properties, children);
};

exports.WeightingFactor.prototype = Object.create(AstNode.prototype);

exports.FunctionBlockBody = function (line, column, properties, children) {
    this.type = NodeTypes.FUNCTION_BLOCK_BODY;
    AstNode.call(this, line, column, properties, children);
};

exports.FunctionBlockBody.prototype = Object.create(AstNode.prototype);

/** Condition */
exports.Condition = function (line, column, properties, children) {
    this.type = NodeTypes.CONDITION;
    AstNode.call(this, line, column, properties, children);
};

exports.Condition.prototype = Object.create(AstNode.prototype);

/** Conjunction */
exports.Conjunction = function (line, column, properties, children) {
    this.type = NodeTypes.CONJUNCTION;
    AstNode.call(this, line, column, properties, children);
};

exports.Conjunction.prototype = Object.create(AstNode.prototype);

/** Disjunction */
exports.Disjunction = function (line, column, properties, children) {
    this.type = NodeTypes.DISJUNCTION;
    AstNode.call(this, line, column, properties, children);
};

exports.Disjunction.prototype = Object.create(AstNode.prototype);

/** X */
exports.X = function (line, column, properties, children) {
    this.type = NodeTypes.X;
    AstNode.call(this, line, column, properties, children);
};

exports.X.prototype = Object.create(AstNode.prototype);


/** Subcondition */
exports.Subcondition = function (line, column, properties, children) {
    this.type = NodeTypes.SUBCONDITION;
    AstNode.call(this, line, column, properties, children);
};

exports.Subcondition.prototype = Object.create(AstNode.prototype);

/** Subcondition */
exports.Equation = function (line, column, properties, children) {
    this.type = NodeTypes.EQUATION;
    AstNode.call(this, line, column, properties, children);
};

exports.Equation.prototype = Object.create(AstNode.prototype);

/** Conclusion */
exports.Conclusion = function (line, column, properties, children) {
    this.type = NodeTypes.CONCLUSION;
    AstNode.call(this, line, column, properties, children);
};

exports.Conclusion.prototype = Object.create(AstNode.prototype);

/** Defuzzify Block */
exports.DefuzzifyBlock = function (line, column, properties, children) {
    this.type = NodeTypes.DEFUZZIFY_BLOCK;
    AstNode.call(this, line, column, properties, children);
};

exports.DefuzzifyBlock.prototype = Object.create(AstNode.prototype);

/** Defuzzification Method */
exports.DefuzzificationMethod = function (line, column, properties, children) {
    this.type = NodeTypes.DEFUZZIFICATION_METHOD;
    AstNode.call(this, line, column, properties, children);
};

exports.DefuzzificationMethod.prototype = Object.create(AstNode.prototype);

/** Activation Method */
exports.ActivationMethod = function (line, column, properties, children) {
    this.type = NodeTypes.ACTIVATION_METHOD;
    AstNode.call(this, line, column, properties, children);
};

exports.ActivationMethod.prototype = Object.create(AstNode.prototype);

/** Fuzzify Block */
exports.FuzzifyBlock = function (line, column, properties, children) {
    this.type = NodeTypes.FUZZIFY_BLOCK;
    AstNode.call(this, line, column, properties, children);
};
exports.FuzzifyBlock.prototype = Object.create(AstNode.prototype);

/** Membership Function */
exports.MembershipFunction = function (line, column, properties, children) {
    this.type = NodeTypes.MEMBERSHIP_FUNCTION;
    AstNode.call(this, line, column, properties, children);
};

exports.MembershipFunction.prototype = Object.create(AstNode.prototype);

/** Term */
exports.LinguisticTerm = function (line, column, properties, children) {
    this.type = NodeTypes.LINGUISTIC_TERM;
    AstNode.call(this, line, column, properties, children);
};

exports.LinguisticTerm.prototype = Object.create(AstNode.prototype);

/** Range */
exports.DefaultValue = function (line, column, properties, children) {
    this.type = NodeTypes.DEFAULT_VALUE;
    AstNode.call(this, line, column, properties, children);
};

exports.DefaultValue.prototype = Object.create(AstNode.prototype);

/** Range */
exports.Range = function (line, column, properties, children) {
    this.type = NodeTypes.RANGE;
    AstNode.call(this, line, column, properties, children);
};

exports.Range.prototype = Object.create(AstNode.prototype);

/** Point */
exports.Point = function (line, column, properties, children) {
    this.type = NodeTypes.POINT;
    AstNode.call(this, line, column, properties, children);
};

exports.Point.prototype = Object.create(AstNode.prototype);

/** VarDeclaration */
exports.VarDeclaration = function (line, column, properties, children) {
    this.type = NodeTypes.VAR_DECLARATION;
    AstNode.call(this, line, column, properties, children);

    for(var i=0; i < properties.names.length; i++) {
        declareSymbol(properties.names[i], children[0].type);
    }
};

exports.VarDeclaration.prototype = Object.create(AstNode.prototype);

/** VarInitDecl */
exports.VarInitDecl = function (line, column, properties, children) {
    this.type = NodeTypes.VAR_INIT_DECL;
    AstNode.call(this, line, column, properties, children);

    for(var i=0; i < properties.names.length; i++) {
        declareSymbol(properties.names[i], children[0].type);
    }
};

exports.VarInitDecl.prototype = Object.create(AstNode.prototype);