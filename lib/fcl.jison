/* Fuzzy Control Language (FCL) */

%{
var ast = require('./lib/fcl_ast'),

Library                     = ast.Library
InputDeclarations           = ast.InputDeclarations
InputDeclaration            = ast.InputDeclaration
OutputDeclarations          = ast.OutputDeclarations
OutputDeclaration           = ast.OutputDeclaration
VarDeclarations             = ast.VarDeclarations
InputOutputDeclarations     = ast.InputOutputDeclarations
SimpleSpecInit              = ast.SimpleSpecInit
FunctionBlock               = ast.FunctionBlock
FunctionBlockBody           = ast.FunctionBlockBody
FuzzifyBlock                = ast.FuzzifyBlock
DefuzzifyBlock              = ast.DefuzzifyBlock
RuleBlock                   = ast.RuleBlock
OptionBlock                 = ast.OptionBlock
LinguisticTerm              = ast.LinguisticTerm
MembershipFunction          = ast.MembershipFunction
Point                       = ast.Point
Rule                        = ast.Rule
Range                       = ast.Range
WeightingFactor             = ast.WeightingFactor
OperatorDefinition          = ast.OperatorDefinition
ActivationMethod            = ast.ActivationMethod
AccumulationMethod          = ast.AccumulationMethod
DefuzzificationMethod       = ast.DefuzzificationMethod
DefaultValue                = ast.DefaultValue
Condition                   = ast.Condition
Conjunction                 = ast.Conjunction
Disjunction                 = ast.Disjunction
Conclusion                  = ast.Conclusion
X                           = ast.X
Subcondition                = ast.Subcondition
Equation                    = ast.Equation
EdgeDeclaration             = ast.EdgeDeclaration
WeightingFactor             = ast.WeightingFactor

%}

%ebnf

%%

library
  : data_type_declarations* function_block_declaration* EOF
       { return new Library(@1.first_line, @1.first_column, {}, [].concat($1).concat($2)) }
  ;
function_block_declaration
  : FUNCTION_BLOCK ID
         fb_io_var_declarations*
         other_var_declarations*
         function_block_body
    END_FUNCTION_BLOCK -> new FunctionBlock(@1.first_line, @1.first_column, {name: $2}, [].concat($3).concat($4).concat($5))
  ;

fb_io_var_declarations
  : input_declarations -> $1
  | output_declarations -> $1
  ;

other_var_declarations
  : var_declarations -> $1
  ;

function_block_body
  : fuzzify_block*
    defuzzify_block*
    rule_block*
    option_block* -> new FunctionBlockBody(@1.first_line, @1.first_column, {}, $1.concat($2).concat($3).concat($4))
  ;

fuzzify_block
  : FUZZIFY ID
         linguistic_term*
    END_FUZZIFY -> new FuzzifyBlock(@2.first_line, @2.first_column, {variable: $2}, [$3])
  ;

defuzzify_block
  : DEFUZZIFY ID
         range?
         linguistic_term*
         defuzzification_method
         default_value
    END_DEFUZZIFY -> new DefuzzifyBlock(@1.first_line, @1.first_column, {variable: $2}, [$3, $4, $5, $6])
  ;

defuzzification_method
  : METHOD COLON (CoG | CoGS | CoA | LM | RM) SEMICOLON -> new DefuzzificationMethod(@1.first_line, @1.first_column, {method: $3}, [])
  ;

default_value
  : DEFAULT ASSIGNMENT (numeric_literal | NC) SEMICOLON -> new DefaultValue(@1.first_line, @1.first_column, {value: $3}, [])
  ;

rule_block
  : RULEBLOCK ID
        operator_definition
        activation_method?
        accumulation_method
        rule*
    END_RULEBLOCK -> new RuleBlock(@1.first_line, @1.first_column, {id: $2}, [].concat($3).concat($4).concat($5).concat($6))
  ;

operator_definition
  : operator_definition_disjunction?
    operator_definition_conjunction? SEMICOLON
            -> new OperatorDefinition(@1.first_line, @1.first_column, {orMethod: $1, andMethod: $2}, [])
  ;

operator_definition_disjunction
  : OR COLON (MAX | ASUM | BSUM) -> $3
  ;

operator_definition_conjunction
  : AND COLON (MIN | PROD | BDIF) -> $3
  ;

option_block
  : OPTION
      /* any manufacturer specific parameters */
    END_OPTION -> new OptionBlock(@1.first_line, @1.first_column, {}, [])
  ;

linguistic_term
  : TERM ID ASSIGNMENT membership_function SEMICOLON -> new LinguisticTerm(@1.first_line, @1.first_column, {name: $2}, [].concat($4))
  ;

membership_function
  : (singleton | points) -> new MembershipFunction(@1.first_line, @1.first_column, {}, [].concat($1))
  ;

singleton
  : numeric_literal -> $1
  | ID -> $1
  ;

points
  : point* -> $1
  ;

point
  : LPARA (numeric_literal | ID) COMMA numeric_literal RPARA -> new Point(@2.first_line, @2.first_column, {x: $2, y: $4})
  ;

defuzzification_method
  : METHOD COLON defuzzifcation_method_option SEMICOLON -> new DefuzzificationMethod(@1.first_line, @1.first_column, {method: $3}, [])
  ;

defuzzification_method_option
  : CoG -> $1
  | CoGS -> $1
  | CoA -> $1
  | LM -> $1
  | RM -> $1
  ;

range
  : RANGE LPARA numeric_literal RANGEDOT numeric_literal RPARA SEMICOLON -> new Range(@3.first_line, @3.first_column, {start: $3, end: $5})
  ;

activation_method
  : ACT COLON (PROD | MIN) SEMICOLON -> new ActivationMethod(@1.first_line, @1.first_column, {name: $3}, [])
  ;

accumulation_method
  : ACCU COLON (MAX | BSUM | NSUM) SEMICOLON -> new AccumulationMethod(@4.first_line, @4.first_column, {name: $3}, [])
  ;

rule
  : RULE integer_literal COLON
    IF condition THEN conclusion (weighting_factor)? SEMICOLON
        {{ $$ = new Rule(@1.first_line, @1.first_column, {number: $2}, [].concat($condition).concat($conclusion).concat($5).concat($8))}}
  ;

condition
  : x condition_concat* -> new Condition(@1.first_line, @1.first_column, {}, [].concat($1).concat($2))
  ;

condition_concat
  : AND x ->  new Conjunction(@1.first_line, @1.first_column, {}, [$2])
  | OR x -> new Disjunction(@1.first_line, @1.first_column, {}, [$2])
  ;

x
  : (NOT)? ((subcondition) | (LPARA condition RPARA)) -> new X(@1.first_line, @1.first_column, {negation: ($1===undefined)?false:true}, [].concat($2))
  ;

subcondition
  : subcondition_equation -> new Subcondition(@1.first_line, @1.first_column, {}, [].concat($1))
  | ID -> $1
  ;

subcondition_equation
  : ID IS (NOT)? ID -> new Equation(@1.first_line, @1.first_column, {a: $1, b: $4, negatedB: ($3===undefined)?false:true})
  ;

conclusion
  : conclusion_equation conclusion_concat* -> new Conclusion(@1.first_line, @1.first_column, {}, [].concat($1).concat($2))
  | ID conclusion_concat* -> new Conclusion(@1.first_line, @1.first_column, {}, [].concat($1).concat($2))
  ;

conclusion_equation
  : ID IS ID -> new Equation(@1.first_line, @1.first_column, {a: $1, b: $3, negatedB: false})
  ;

conclusion_concat
  : COMMA conclusion_equation -> $2
  | COMMA ID -> $2
  ;

weighting_factor
  : WITH (variable | numeric_literal) -> new WeightingFactor(@1.first_line, @1.first_column, {}, [].concat($2));
  ;

/* according to IEC 61131-3 */

constant
  : numeric_literal -> $1
  | boolean_literal -> $1
  ;

numeric_literal
  : integer_literal -> $1
  | real_literal -> $1
  ;

signed_integer
  : (PLUS | DASH) integer -> ($1==='-')? ($2 * -1) : $2
  | integer -> $1
  ;

integer_literal
  : integer_type_name HASH integer_value -> $1
  | integer_value -> $1
  ;

integer_value
  : signed_integer -> $1
  | BINARY_INTEGER -> new Number(yytext.substr(2).replace('_', ''))
  | OCTAL_INTEGER -> new Number(yytext.substr(2).replace('_', ''))
  | HEX_INTEGER -> new Number(yytext.substr(3).replace('_', ''))
  ;

integer
  : DIGIT ((LDASH)? DIGIT)* -> new Number(yytext.replace('_', ''))
  ;

real_literal
  : real_type_name HASH REAL_NUMBER (exponent)?
       {{ ($4 === undefined)? $3 : Math.pow($3, $4) }}
  | REAL_NUMBER (exponent)?
       {{ ($4 === undefined)? $1 : Math.pow($1, $2) }}
  ;

exponent
  : E (PLUS | DASH)? integer -> new Number(yytext)
  ;

boolean_literal
  : TRUE -> true
  | FALSE -> false
  ;

/* ELEMENTARY DATA TYPES */

elementary_type_name
  : numeric_type_name -> $1
  ;

numeric_type_name
  : integer_type_name -> $1
  | real_type_name -> $1
  ;

integer_type_name
  : signed_integer_type_name  -> $1
  | unsigned_integer_type_name -> $1
  ;

signed_integer_type_name
  : INT -> $1
  ;

real_type_name
  : REAL -> $1
  ;

bit_identifier
  : BOOL -> $1
  ;


simple_spec_init
  : elementary_type_name (ASSIGNMENT constant)? -> new SimpleSpecInit(@1.first_line, @1.first_column, {}, [])
  ;

/* VARIABLES */

variable
  : symbolic_variable -> $1
  ;

symbolic_variable
  : ID -> $1
  ;


/* DECLARATION AND INITIALIZATION */

input_declarations
  : VAR_INPUT (RETAIN | NON_RETAIN)?
         input_declaration SEMICOLON
         (input_declaration SEMICOLON)*
    END_VAR
        -> new InputDeclarations(@1.first_line, @1.first_column, {retain: ($2 === 'RETAIN')?true:false}, [].concat($5).concat($3))
  ;

input_declaration
  : name_list COLON (edge_declaration | simple_spec_init)
        -> new InputDeclaration(@1.first_line, @1.first_column, {names: $1}, [].concat($3))
  ;

edge_declaration
  : BOOL (R_EDGE | F_EDGE)
        -> new EdgeDeclaration(@1.first_line, @1.first_column, {risingEdge: ($2 === 'R_EDGE')?true:false}, [])
  ;

name_list
  : ID name_list_concat* -> $2.concat($1)
  ;

name_list_concat
  : COMMA ID -> $2
  ;

output_declaration
  : name_list COLON simple_spec_init -> new OutputDeclaration(@1.first_line, @1.first_column, {names: $1}, [].concat($3))
  ;

output_declarations
  : VAR_OUTPUT (RETAIN | NON_RETAIN)?
      output_declaration SEMICOLON
      (output_declaration SEMICOLON)*
    END_VAR -> new OutputDeclarations(@1.first_line, @1.first_column, {}, $5.concat($3))
  ;

input_output_declarations
  : VAR_IN_OUT
      var_declaration SEMICOLON
      (var_declaration SEMICOLON)*
    END_VAR -> new InputOutputDeclarations(@1.first_line, @1.first_column, {}, [].concat($3).concat($2))
  ;

var_decl
  : name_list COLON (elementary_type_name | ID)
  ;

var_declarations
  : VAR (CONSTANT)?
      simple_spec_init SEMICOLON
      (simple_spec_init SEMICOLON)*
    END_VAR
        -> new VarDeclarations(@1.first_line, @1.first_column, {constant:(constant!==undefined)?true:false}, [].concat($5).concat($3))
  ;

%%
