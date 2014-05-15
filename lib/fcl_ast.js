
/** basic node for context information */
var AstNode = function (line, column, properties, children) {
    this.line = line;
    this.column = column;
    this.properties = properties;
    this.children = children;
};

exports.Library = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
};

exports.Library.prototype = Object.create(AstNode.prototype);


/** Function Block */
exports.FunctionBlock = function (line, column, properties, children) {
    AstNode.call(this, line, column, properties, children);
};

exports.FunctionBlock.prototype = Object.create(AstNode.prototype);


/** Number */
exports.NumberVal = function (line, column, numberText) {
    "use strict";
    AstNode.call(this, line, column);
};

exports.NumberVal.prototype = Object.create(AstNode.prototype);

/** Input Block */
exports.InputBlock = function(line, column, varDecl, varDecls) {
    AstNode.call(this, line, column);

    if(arguments.length == 3) {
        varDecls = [];
    }
    varDecls.push(varDecl);

    this.toString = function() {
        return "InputBlock: " + varDecls;
    }
};

exports.InputBlock.prototype = Object.create(AstNode.prototype);

/** Output Block */
exports.OutputBlock = function(line, column, varDecl, varDecls) {
    AstNode.call(this, line, column);

    if(arguments.length == 3) {
        varDecls = [];
    }
    varDecls.push(varDecl);

    this.toString = function() {
        return "OutputBlock: " + varDecls;
    }
};

exports.OutputBlock.prototype = Object.create(AstNode.prototype);

/** Var Block */
exports.VarBlock = function(line, column, varDecls) {
    AstNode.call(this, line, column);

    this._vars = varDecls;

    this.toString = function() {
        return "VarBlock: " + this._varDecls;
    }
};

exports.VarBlock.prototype = Object.create(AstNode.prototype);

/** AccumulationMethod */
exports.AccumulationMethod = function(line, column, method) {
    AstNode.call(this, line, column);
    this._method = method;

    this.toString = function() {
        return "AccumulationMethod: " + this._method;
    }
};

exports.AccumulationMethod.prototype = Object.create(AstNode.prototype);

/** AndOperatorDefinition */
exports.AndOperatorDefinition = function(line, column, mode) {
    AstNode.call(this, line, column);
    this._mode = mode;

    this.toString = function() {
        return "AndOperatorDefinition: " + this._mode;
    }
};

exports.AndOperatorDefinition.prototype = Object.create(AstNode.prototype);

/** OrOperatorDefinition */
exports.OrOperatorDefinition = function(line, column, mode) {
    AstNode.call(this, line, column);
    this._mode = mode;

    this.toString = function() {
        return "OrOperatorDefinition: " + this._mode;
    };
};

exports.OrOperatorDefinition.prototype = Object.create(AstNode.prototype);


/** Rule Block */
exports.RuleBlock = function(line, column, name, operatorDefinition, activationMethod, accumulationMethod, rules) {
    AstNode.call(this, line, column);
    this._name = name;
    this._operatorDefinition = operatorDefinition;
    this._activationMethod = activationMethod;
    this._accumulationMethod = accumulationMethod;
    this._rules = rules;

    this.toString = function() {
        return "RuleBlock: " + this._name + " " + this._operatorDefinition + " " + this._activationMethod + " " + this._accumulationMethod + " " + this._rules;
    };
};

exports.RuleBlock.prototype = Object.create(AstNode.prototype);

exports.OperatorDefinition = function() {

};

exports.OperatorDefinition.prototype = Object.create(AstNode.prototype);

/** Rule */
exports.Rule = function(line, column, number, condition, conclusion, weighting) {
    AstNode.call(this, line, column);
    this._number = number;
    this._condition = condition;
    this._conclusion = conclusion;
    this._weighting = weighting;

    this.toString = function() {
        return "Rule: " + this._number + ": " + this._condition + " " +  this._conclusion + this._weighting;
    };
};

exports.Rule.prototype = Object.create(AstNode.prototype);

exports.FunctionBlockBody  = function(line, column) {
    AstNode.call(this, line, column);


};

exports.FunctionBlockBody.prototype = Object.create(AstNode.prototype);

/** LogicPart */
exports.LogicPart = function(line, column, variable, negate_term, term) {
    AstNode.call(this, line, column);
    this._variable = variable;
    this._term = term;
    this._term_negation = negate_term;
    this._negation = false;

    this.negate = function() {
        this._negation = true;
    };

    this.toString = function() {
        return "LogicPart: " + ((this._negation)? "! " : " ") + this._variable + ", " + ((this._term_negation)? "!":"") + this._term;
    };
};

exports.LogicPart.prototype = Object.create(AstNode.prototype);

/** Condition */
exports.Condition = function(line, column, subconditions) {
    AstNode.call(this, line, column);
    this._subconditions = subconditions;

    this.toString = function() {
        return "Condition: " + this._subconditions;
    };
};

exports.Condition.prototype = Object.create(AstNode.prototype);


/** AndOperator */
exports.AndOperator = function(line, column) {
    AstNode.call(this, line, column);

    this.toString = function() {
        return "AND";
    };
};

exports.AndOperator.prototype = Object.create(AstNode.prototype);

/** OrOperator */
exports.OrOperator = function(line, column) {
    AstNode.call(this, line, column);

    this.toString = function() {
        return "OR";
    };
};

exports.OrOperator.prototype = Object.create(AstNode.prototype);

/** Condition */
exports.Subcondition = function(line, column, operator, logic) {
    AstNode.call(this, line, column);
    this._operator = operator;
    this._logic = logic;

    this.toString = function() {
        return "Subcondition: " + this._operator + ", " + this._logic;
    };
};

exports.Subcondition.prototype = Object.create(AstNode.prototype);

/** Conclusion */
exports.Conclusion = function(line, column, logics) {
    AstNode.call(this, line, column);
    this._logics = logics;

    this.toString = function() {
        return "Conclusion: " + this._logics;
    };
};

exports.Conclusion.prototype = Object.create(AstNode.prototype);

/** Defuzzify Block */
exports.DefuzzifyBlock = function(line, column, variableName, terms, method, defaultValue, range) {
    AstNode.call(this, line, column);
    this._variable = variableName;
    this._terms = terms;
    this._method = method;
    this._defaultValue = defaultValue;
    this._range = range;

    this.toString = function() {
        return "DefuzzifyBlock " + this._variable + ": " + this._terms + ", " + this._method + ", " + this._defaultValue + ", " + this._range;
    };
};

exports.DefuzzifyBlock.prototype = Object.create(AstNode.prototype);

/** Defuzzification Method */
exports.DefuzzificationMethod = function(line, column, method) {
    AstNode.call(this, line, column);
    this._method = method;

    this.toString = function() {
        return "DefuzzificationMethod: " + this._method;
    };
};

exports.DefuzzificationMethod.prototype = Object.create(AstNode.prototype);

/** Activation Method */
exports.ActivationMethod = function(line, column, method) {
    AstNode.call(this, line, column);
    this._method = method;

    this.toString = function() {
        return "ActivationMethod: " + this._method;
    };
};

exports.ActivationMethod.prototype = Object.create(AstNode.prototype);

/** Fuzzify Block */
exports.FuzzifyBlock = function(line, column, variableName, terms) {
    AstNode.call(this, line, column);
    this._variable = variableName;
    this._terms = terms;

    this.toString = function() {
        return "FuzzifyBlock " + this._variable + ": " + this._terms;
    };
};

exports.FuzzifyBlock.prototype = Object.create(AstNode.prototype);

/** Membership Function */
exports.MembershipFunction = function(line, column, func) {
    AstNode.call(this, line, column);
    this._function = func;

    this.toString = function() {
        return "MembershipFunction: " + func;
    }
};

exports.MembershipFunction.prototype = Object.create(AstNode.prototype);

/** Term */
exports.LinguisticTerm = function(line, column, name, func) {
    AstNode.call(this, line, column);
    this._name = name;
    this._function = func;

    this.toString = function() {
        return "Term: " + this._name + ", " + this._function;
    };
};

exports.LinguisticTerm.prototype = Object.create(AstNode.prototype);

/** Range */
exports.DefaultValue = function(line, column, val) {
    AstNode.call(this, line, column);
    this._val = val;

    this.toString = function() {
        return "DefaultValue: " + this._val;
    };
};

exports.DefaultValue.prototype = Object.create(AstNode.prototype);

/** Range */
exports.Range = function(line, column, id, start, end) {
    AstNode.call(this, line, column);
    this._start = start;
    this._end = end;

    this.toString = function() {
        return "Range: " + this._start + ":" + this._end;
    };
};

exports.Range.prototype = Object.create(AstNode.prototype);

/** Variable Declaration */
exports.VariableDeclaration = function(line, column, id, type) {
    AstNode.call(this, line, column);
    this._id = id;
    this._type = type;

    this.toString = function() {
        return "VariableDeclaration: " + this._id + ":" + this._type;
    };
};

exports.VariableDeclaration.prototype = Object.create(AstNode.prototype);

/** Variable */
exports.Variable = function(line, column, variableText) {
    AstNode.call(this, line, column);
    this._name = variableText;

    this.toString = function() {
        return 'Variable: ' + this._name;
    };
};

exports.Variable.prototype = Object.create(AstNode.prototype);

/** Point */
exports.Point = function(line, column, x, y) {
    AstNode.call(this, line, column);
    this._x = x;
    this._y = y;

    this.toString = function() {
        return "Point: {" + x + ", " + y + "}";
    }
};

exports.Point.prototype = Object.create(AstNode.prototype);
