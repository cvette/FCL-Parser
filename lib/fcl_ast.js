"use strict";

var NodeTypes = {
    LIBRARY:                "Library",
    FUNCTION_BLOCK:         "FunctionBlock",
    INPUT_DECLARATIONS:     "InputDeclarations",
    INPUT_DECLARATION:      "InputDeclaration",
    OUTPUT_DECLARATIONS:    "OutputDeclarations",
    OUTPUT_DECLARATION:     "OutputDeclaration"
};

exports.NodeTypes = NodeTypes;

/** basic node for context information */
function AstNode(line, column, properties, children) {
    this.line = line;
    this.column = column;
    this.properties = properties;
    this.children = children;

    console.log("(" + line + ":" + column + ") " + this.name);

    this.toJSON = function () {

        function handleChildren(children) {
            var objs = [];

            children.forEach(function (child) {
                if (typeof child.toJSON === 'function') {
                    objs.push(child.toJSON());
                } else {

                }
            });

            return objs;
        }

        var node = {
            type: this.type,
            line: this.line,
            column: this.column,
            properties: this.properties,
            children: handleChildren(this.children)
        };

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
    this.name = 'InputOutputDeclarations';
    AstNode.call(this, line, column, properties, children);
};

exports.InputOutputDeclarations.prototype = Object.create(AstNode.prototype);

/** VarDeclarations */
exports.VarDeclarations = function (line, column, properties, children) {
    this.name = 'VarDeclarations';
    AstNode.call(this, line, column, properties, children);
};

exports.VarDeclarations.prototype = Object.create(AstNode.prototype);

/** Var Block */
exports.VarBlock = function (line, column, properties, children) {
    this.name = 'VarBlock';
    AstNode.call(this, line, column, properties, children);
};

exports.VarBlock.prototype = Object.create(AstNode.prototype);

/** AccumulationMethod */
exports.AccumulationMethod = function (line, column, properties, children) {
    this.name = 'AccumulationMethod';
    AstNode.call(this, line, column, properties, children);
};

exports.AccumulationMethod.prototype = Object.create(AstNode.prototype);

/** Rule Block */
exports.RuleBlock = function (line, column, properties, children) {
    this.name = 'RuleBlock';
    AstNode.call(this, line, column, properties, children);
};

exports.RuleBlock.prototype = Object.create(AstNode.prototype);

exports.OperatorDefinition = function (line, column, properties, children) {
    this.name = 'OperatorDefinition';
    AstNode.call(this, line, column, properties, children);
};

exports.OperatorDefinition.prototype = Object.create(AstNode.prototype);

/** Rule */
exports.Rule = function (line, column, properties, children) {
    this.name = 'Rule';
    AstNode.call(this, line, column, properties, children);
};

exports.Rule.prototype = Object.create(AstNode.prototype);

exports.FunctionBlockBody = function (line, column, properties, children) {
    this.name = 'FunctionBlockBody';
    AstNode.call(this, line, column, properties, children);
};

exports.FunctionBlockBody.prototype = Object.create(AstNode.prototype);

/** Condition */
exports.Condition = function (line, column, properties, children) {
    this.name = 'Condition';
    AstNode.call(this, line, column, properties, children);
};

exports.Condition.prototype = Object.create(AstNode.prototype);

/** Conjunction */
exports.Conjunction = function (line, column, properties, children) {
    this.name = 'Conjunction';
    AstNode.call(this, line, column, properties, children);
};

exports.Conjunction.prototype = Object.create(AstNode.prototype);

/** Disjunction */
exports.Disjunction = function (line, column, properties, children) {
    this.name = 'Disjunction';
    AstNode.call(this, line, column, properties, children);
};

exports.Disjunction.prototype = Object.create(AstNode.prototype);

/** X */
exports.X = function (line, column, properties, children) {
    this.name = 'X';
    AstNode.call(this, line, column, properties, children);
};

exports.X.prototype = Object.create(AstNode.prototype);

/** AndOperator */
exports.AndOperator = function (line, column, properties, children) {
    this.name = 'AndOperator';
    AstNode.call(this, line, column, properties, children);
};

exports.AndOperator.prototype = Object.create(AstNode.prototype);

/** OrOperator */
exports.OrOperator = function (line, column, properties, children) {
    this.name = 'OrOperator';
    AstNode.call(this, line, column, properties, children);
};

exports.OrOperator.prototype = Object.create(AstNode.prototype);

/** Subcondition */
exports.Subcondition = function (line, column, properties, children) {
    this.name = 'Subcondition';
    AstNode.call(this, line, column, properties, children);
};

exports.Subcondition.prototype = Object.create(AstNode.prototype);

/** Conclusion */
exports.Conclusion = function (line, column, properties, children) {
    this.name = 'Conclusion';
    AstNode.call(this, line, column, properties, children);
};

exports.Conclusion.prototype = Object.create(AstNode.prototype);

/** Defuzzify Block */
exports.DefuzzifyBlock = function (line, column, properties, children) {
    this.name = 'DefuzzifyBlock';
    AstNode.call(this, line, column, properties, children);
};

exports.DefuzzifyBlock.prototype = Object.create(AstNode.prototype);

/** Defuzzification Method */
exports.DefuzzificationMethod = function (line, column, properties, children) {
    this.name = 'DefuzzificationMethod';
    AstNode.call(this, line, column, properties, children);
};

exports.DefuzzificationMethod.prototype = Object.create(AstNode.prototype);

/** Activation Method */
exports.ActivationMethod = function (line, column, properties, children) {
    this.name = 'ActivationMethod';
    AstNode.call(this, line, column, properties, children);
};

exports.ActivationMethod.prototype = Object.create(AstNode.prototype);

/** Fuzzify Block */
exports.FuzzifyBlock = function (line, column, properties, children) {
    this.name = 'FuzzifyBlock';
    AstNode.call(this, line, column, properties, children);
};
exports.FuzzifyBlock.prototype = Object.create(AstNode.prototype);

/** Membership Function */
exports.MembershipFunction = function (line, column, properties, children) {
    this.name = 'MembershipFunction';
    AstNode.call(this, line, column, properties, children);
};

exports.MembershipFunction.prototype = Object.create(AstNode.prototype);

/** Term */
exports.LinguisticTerm = function (line, column, properties, children) {
    this.name = 'LinguisticTerm';
    AstNode.call(this, line, column, properties, children);
};

exports.LinguisticTerm.prototype = Object.create(AstNode.prototype);

/** Range */
exports.DefaultValue = function (line, column, properties, children) {
    this.name = 'DefaultValue';
    AstNode.call(this, line, column, properties, children);
};

exports.DefaultValue.prototype = Object.create(AstNode.prototype);

/** Range */
exports.Range = function (line, column, properties, children) {
    this.name = 'Range';
    AstNode.call(this, line, column, properties, children);
};

exports.Range.prototype = Object.create(AstNode.prototype);

/** Variable Declaration */
exports.VariableDeclaration = function (line, column, properties, children) {
    this.name = 'VariableDeclaration';
    AstNode.call(this, line, column, properties, children);
};

exports.VariableDeclaration.prototype = Object.create(AstNode.prototype);

/** Variable */
exports.Variable = function (line, column, properties, children) {
    this.name = 'Variable';
    AstNode.call(this, line, column, properties, children);
};

exports.Variable.prototype = Object.create(AstNode.prototype);

/** Point */
exports.Point = function (line, column, properties, children) {
    this.name = 'Point';
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
