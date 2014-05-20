"use strict";

/** all possible node types enum */
var NodeTypes = {
    LIBRARY:                "Library",
    FUNCTION_BLOCK:         "FunctionBlock",
    FUNCTION_BLOCK_BODY:    "FunctionBlockBody",
    INPUT_DECLARATIONS:     "InputDeclarations",
    INPUT_DECLARATION:      "InputDeclaration",
    OUTPUT_DECLARATIONS:    "OutputDeclarations",
    OUTPUT_DECLARATION:     "OutputDeclaration",
    InputOutputDeclarations:"InputOutputDeclarations",
    VAR_DECLARATIONS:       "VarDeclarations",
    RULE:                   "Rule",
    RULE_BLOCK:             "RuleBlock",
    CONDITION:              "Condition",
    SUBCONDITION:           "Subcondition",
    CONJUNCTION:            "Conjunction",
    DISJUNCTION:            "Disjunction",
    X:                      "X",
    EQUATION:               "Equation",
    CONCLUSION:             "Conclusion",
    DEFUZZIFY_BLOCK:        "DefuzzifyBlock",
    DEFUZZIFICATION_METHOD: "DefuzzificationMethod",
    OPERATOR_DEFINITION:    "OperatorDefinition",
    FUZZIFY_BLOCK:          "FuzzifyBlock",
    ACTIVATION_METHOD:      "ActivationMethod",
    LINGUISTIC_TERM:        "LinguisticTerm",
    MEMBERSHIP_FUNCTION:    "MembershipFunction",
    POINT:                  "Point",
    DEFAULT_VALUE:          "DefaultValue",
    ACCUMULATION_METHOD:    "AccumulationMethod"
};

exports.NodeTypes = NodeTypes;

/** basic ast node */
function AstNode(line, column, properties, children) {
    this.line = line;
    this.column = column;
    this.properties = properties;
    this.children = children;

    console.log("(" + line + ":" + column + ") " + this.type);

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


/** Function Block */
exports.FunctionBlock = function (line, column, properties, children) {
    this.type = NodeTypes.FUNCTION_BLOCK;
    AstNode.call(this, line, column, properties, children);
};

exports.FunctionBlock.prototype = Object.create(AstNode.prototype);


/** InputDeclarations */
exports.InputDeclarations = function (line, column, properties, children) {
    this.type = NodeTypes.INPUT_DECLARATIONS;
    AstNode.call(this, line, column, properties, children);
};

exports.InputDeclarations.prototype = Object.create(AstNode.prototype);

/** InputDeclaration */
exports.InputDeclaration = function (line, column, properties, children) {
    this.type = NodeTypes.INPUT_DECLARATION;
    AstNode.call(this, line, column, properties, children);
};

exports.InputDeclaration.prototype = Object.create(AstNode.prototype);

/** OutputDeclarations */
exports.OutputDeclarations = function (line, column, properties, children) {
    this.type = NodeTypes.OUTPUT_DECLARATIONS;
    AstNode.call(this, line, column, properties, children);
};

exports.OutputDeclarations.prototype = Object.create(AstNode.prototype);

/** OutputDeclaration */
exports.OutputDeclaration = function (line, column, properties, children) {
    this.type = NodeTypes.OUTPUT_DECLARATION;
    AstNode.call(this, line, column, properties, children);
};

exports.OutputDeclaration.prototype = Object.create(AstNode.prototype);

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


/** AccumulationMethod */
exports.AccumulationMethod = function (line, column, properties, children) {
    this.type = NodeTypes.ACCUMULATION_METHOD;
    AstNode.call(this, line, column, properties, children);
};

exports.AccumulationMethod.prototype = Object.create(AstNode.prototype);

/** Rule Block */
exports.RuleBlock = function (line, column, properties, children) {
    this.type = NodeTypes.RULE_BLOCK;
    AstNode.call(this, line, column, properties, children);
};

exports.RuleBlock.prototype = Object.create(AstNode.prototype);

exports.OperatorDefinition = function (line, column, properties, children) {
    this.type = NodeTypes.OPERATOR_DEFINITION;
    AstNode.call(this, line, column, properties, children);
};

exports.OperatorDefinition.prototype = Object.create(AstNode.prototype);

/** Rule */
exports.Rule = function (line, column, properties, children) {
    this.type = NodeTypes.RULE;
    AstNode.call(this, line, column, properties, children);
};

exports.Rule.prototype = Object.create(AstNode.prototype);

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

    console.log(children);
    AstNode.call(this, line, column, properties, children);
};

exports.Point.prototype = Object.create(AstNode.prototype);

/** DataTypeDeclarations */
exports.DataTypeDeclarations = function (line, column, properties, children) {
    this.name = 'DataTypeDeclarations';
    AstNode.call(this, line, column, properties, children);
};

exports.DataTypeDeclarations.prototype = Object.create(AstNode.prototype);

/** DataTypeDeclaration */
exports.DataTypeDeclaration = function (line, column, properties, children) {
    this.name = 'DataTypeDeclaration';
    AstNode.call(this, line, column, properties, children);
};

exports.DataTypeDeclaration.prototype = Object.create(AstNode.prototype);
