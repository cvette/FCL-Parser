"use strict";

/** basic node for context information */
function AstNode(line, column, properties, children) {
    this.line = line;
    this.column = column;
    this.properties = properties;
    this.children = children;
}

exports.Library = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") Library");
};

exports.Library.prototype = Object.create(AstNode.prototype);


/** Function Block */
exports.FunctionBlock = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") FunctionBlock");
};

exports.FunctionBlock.prototype = Object.create(AstNode.prototype);


/** InputDeclarations */
exports.InputDeclarations = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") InputDeclarations");
};

exports.InputDeclarations.prototype = Object.create(AstNode.prototype);

/** InputDeclaration */
exports.InputDeclaration = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") InputDeclaration");
    console.log(this.children);
};

exports.InputDeclaration.prototype = Object.create(AstNode.prototype);

/** OutputDeclarations */
exports.OutputDeclarations = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") OutputDeclarations");
};

exports.OutputDeclarations.prototype = Object.create(AstNode.prototype);

/** OutputDeclarations */
exports.OutputDeclaration = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") OutputDeclaration");
};

exports.OutputDeclaration.prototype = Object.create(AstNode.prototype);

/** InputOutputDeclarations */
exports.InputOutputDeclarations = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") InputOutputDeclarations");
};

exports.InputOutputDeclarations.prototype = Object.create(AstNode.prototype);

/** VarDeclarations */
exports.VarDeclarations = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") VarDeclarations");
};

exports.InputOutputDeclarations.prototype = Object.create(AstNode.prototype);

/** Var Block */
exports.VarBlock = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
};

exports.VarBlock.prototype = Object.create(AstNode.prototype);

/** AccumulationMethod */
exports.AccumulationMethod = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") AccumulationMethod");
};

exports.AccumulationMethod.prototype = Object.create(AstNode.prototype);

/** AndOperatorDefinition */
exports.AndOperatorDefinition = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
};

exports.AndOperatorDefinition.prototype = Object.create(AstNode.prototype);

/** OrOperatorDefinition */
exports.OrOperatorDefinition = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
};

exports.OrOperatorDefinition.prototype = Object.create(AstNode.prototype);


/** Rule Block */
exports.RuleBlock = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") RuleBlock");
};

exports.RuleBlock.prototype = Object.create(AstNode.prototype);

exports.OperatorDefinition = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") OperatorDefinition");
};

exports.OperatorDefinition.prototype = Object.create(AstNode.prototype);

/** Rule */
exports.Rule = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") Rule");
};

exports.Rule.prototype = Object.create(AstNode.prototype);

exports.FunctionBlockBody = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") FunctionBlockBody");
};

exports.FunctionBlockBody.prototype = Object.create(AstNode.prototype);

/** Condition */
exports.Condition = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") Condition");
};

exports.Condition.prototype = Object.create(AstNode.prototype);

/** Conjunction */
exports.Conjunction = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") Conjunction");
};

exports.Conjunction.prototype = Object.create(AstNode.prototype);

/** Disjunction */
exports.Disjunction = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") Disjunction");
};

exports.Disjunction.prototype = Object.create(AstNode.prototype);

/** X */
exports.X = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") X");
};

exports.X.prototype = Object.create(AstNode.prototype);

/** AndOperator */
exports.AndOperator = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
};

exports.AndOperator.prototype = Object.create(AstNode.prototype);

/** OrOperator */
exports.OrOperator = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
};

exports.OrOperator.prototype = Object.create(AstNode.prototype);

/** Subcondition */
exports.Subcondition = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
};

exports.Subcondition.prototype = Object.create(AstNode.prototype);

/** Conclusion */
exports.Conclusion = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") Conclusion");
};

exports.Conclusion.prototype = Object.create(AstNode.prototype);

/** Defuzzify Block */
exports.DefuzzifyBlock = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") DefuzzifyBlock");
};

exports.DefuzzifyBlock.prototype = Object.create(AstNode.prototype);

/** Defuzzification Method */
exports.DefuzzificationMethod = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") DefuzzificationMethod");
};

exports.DefuzzificationMethod.prototype = Object.create(AstNode.prototype);

/** Activation Method */
exports.ActivationMethod = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") ActivationMethod");
};

exports.ActivationMethod.prototype = Object.create(AstNode.prototype);

/** Fuzzify Block */
exports.FuzzifyBlock = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") FuzzifyBlock");
};
exports.FuzzifyBlock.prototype = Object.create(AstNode.prototype);

/** Membership Function */
exports.MembershipFunction = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") MembershipFunction");
};

exports.MembershipFunction.prototype = Object.create(AstNode.prototype);

/** Term */
exports.LinguisticTerm = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") LinguisticTerm");
};

exports.LinguisticTerm.prototype = Object.create(AstNode.prototype);

/** Range */
exports.DefaultValue = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") DefaultValue");
};

exports.DefaultValue.prototype = Object.create(AstNode.prototype);

/** Range */
exports.Range = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") Range");
};

exports.Range.prototype = Object.create(AstNode.prototype);

/** Variable Declaration */
exports.VariableDeclaration = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
};

exports.VariableDeclaration.prototype = Object.create(AstNode.prototype);

/** Variable */
exports.Variable = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
};

exports.Variable.prototype = Object.create(AstNode.prototype);

/** Point */
exports.Point = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
    console.log("(" + line + ") Point");
};

exports.Point.prototype = Object.create(AstNode.prototype);
