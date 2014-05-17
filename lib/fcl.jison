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
DataType                    = ast.DataType
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

%}

%ebnf

%%

library
  : data_type_declaration* function_block_declaration* EOF
       { return new Library(@1.first_line, @1.first_column, {}, [$1, $2]) }
  ;
function_block_declaration
  : FUNCTION_BLOCK ID
         fb_io_var_declarations*
         other_var_declarations*
         function_block_body
    END_FUNCTION_BLOCK -> new FunctionBlock(@1.first_line, @1.first_column, {name: $2}, [$3, $4, $5])
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
    option_block* -> new FunctionBlockBody(@1.first_line, @1.first_column, {}, [$1, $2, $3, $4])
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
  : METHOD COLON (CoG | CoGS | CoA | LM | RM) SEMICOLON -> new DefuzzificationMethod(@1.first_line, @1.first_column, {name: $3}, [])
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
    END_RULEBLOCK -> new RuleBlock(@1.first_line, @1.first_column, {id: $2}, [$3, $4, $5, $6])
  ;


option_block
  : OPTION
      /* any manufacturer specific parameters */
    END_OPTION -> new OptionBlock(@$1.first_line, @$1.first_column, {}, [])
  ;

linguistic_term
  : TERM ID ASSIGNMENT membership_function SEMICOLON -> new LinguisticTerm(@1.first_line, @1.first_column, {name: $2}, [$4])
  ;

membership_function
  : (singleton | points) -> new MembershipFunction(@1.first_line, @1.first_column, {}, [$1])
  ;

singleton
  : numeric_literal -> $1
  | ID -> $1
  ;

points
  : point* -> $1
  ;

point
  : (LPARA (numeric_literal | ID) COMMA numeric_literal RPARA) -> new Point(@2.first_line, @2.first_column, {}, [])
  ;

defuzzification_method
  : METHOD COLON defuzzifcation_method_option SEMICOLON -> new DefuzzificationMethod(@1.first_line, @1.first_column, {}, [$3])
  ;

defuzzification_method_option
  : CoG -> yytext
  | CoGS -> yytext
  | CoA -> yytext
  | LM -> yytext
  | RM -> yytext
  ;

range
  : RANGE LPARA numeric_literal RANGEDOT numeric_literal RPARA SEMICOLON -> new Range(@3.first_line, @3.first_column, {}, [$3, $5])
  ;

operator_definition
  : (OR COLON (MAX | ASUM | BSUM))?
    (AND COLON (MIN | PROD | BDIF))? SEMICOLON -> new OperatorDefinition(@1.first_line, @1.first_column, {}, [])
  ;

activation_method
  : ACT COLON (PROD | MIN) SEMICOLON -> new ActivationMethod(@1.first_line, @1.first_column, {name: $3}, [])
  ;

accumulation_method
  : ACCU COLON (MAX | BSUM | NSUM) SEMICOLON -> new AccumulationMethod(@4.first_line, @4.first_column, {name: $3}, [])
  ;

rule
  : RULE integer_literal COLON
    IF condition THEN conclusion (WITH weighting_factor)? SEMICOLON
        { $$ = new Rule(@1.first_line, @1.first_column, {number: $2}, [$condition, $conclusion, $5])}
  ;

condition
  : x condition_concat* -> new Condition(@1.first_line, @1.first_column, {}, [$1, $2])
  ;

condition_concat
  : AND x ->  new Conjunction(@1.first_line, @1.first_column, {}, [$2])
  | OR x -> new Disjunction(@1.first_line, @1.first_column, {}, [$2])
  ;

x
  : (NOT)? ((subcondition) | (LPARA condition RPARA)) -> new X(@1.first_line, @1.first_column, {negation: ($1===undefined)?false:true}, [$2])
  ;

subcondition
  : ID IS (NOT)? ID
  | ID -> $1
  ;

conclusion
  : ID (IS ID) (COMMA ID (IS ID)?)* -> new Conclusion(@1.first_line, @1.first_column, {}, [])
  ;

weighting_factor
  : (variable | numeric_literal) -> new WeightingFactor(@1.first_line, @1.first_column, {}, [$1])
  ;

/* according to IEC 61131-3 */

constant
  : numeric_literal -> $1
  | character_string -> $1
  | time_literal
  | bit_string_literal -> $1
  | boolean_literal -> $1
  ;

numeric_literal
  : integer_literal -> $1
  | real_literal -> $1
  ;

signed_integer
  : (PLUS | DASH) integer -> ($1==='-')? ($2 * -1):$2
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
  | REAL_NUMBER (exponent)?
  ;

exponent
  : (E) (PLUS | DASH)? integer
  ;

bit_string_literal
  : bit_string_type_name HASH bit_string_value
  ;

bit_string_value
  : integer -> $1
  | BINARY_INTEGER -> new Number(yytext.substr(2).replace('_', ''))
  | OCTAL_INTEGER -> new Number(yytext.substr(2).replace('_', ''))
  | HEX_INTEGER -> new Number(yytext.substr(3).replace('_', ''))
  ;

bit_string_type_name
  : BYTE
  | WORD
  | DWORD
  | LWORD
  ;

boolean_literal
  : TRUE -> true
  | FALSE -> false
  ;


character_string
  : SINGLE_BYTE_STRING -> new CharacterString(@1.first_line, @1.first_column, {string: yytext}, [])
  | DOUBLE_BYTE_STRING -> new CharacterString(@1.first_line, @1.first_column, {string: yytext}, [])
  ;

/* TIME LITERALS */

time_literal
  : duration
  | time_of_day
  | date
  | date_and_time
  ;

/* DURATION */

duration
  : DURATION_PREFIX interval
  ;

interval
  : days | hours | minutes | seconds | milliseconds
  ;

interval_prefix
  : fixed_point (D|H|M|S|MS)
  | integer (days|hours|minutes|seconds)
  ;

days
  : D (LDASH)? hours
  ;

hours
  : H (LDASH)? minutes
  ;

minutes
  : M (LDASH)? seconds
  ;

seconds
  : S (LDASH)? milliseconds
  ;

fixed_point
  : integer (DOT integer)?
  ;

/* TIME OF DAY AND DATE */

time_of_day
  : (TIME_OF_DAY | TOD) HASH daytime
  ;

daytime
  : integer COLON integer COLON fixed_point
  ;

date
  : (DATE | D) HASH date_literal
  ;

date_literal
  : integer DASH integer DASH integer
  ;

date_and_time
  : (DATE_AND_TIME | DT) HASH date_literal DASH daytime
  ;

/* ELEMENTARY DATA TYPES */

elementary_type_name
  : numeric_type_name
  | date_type_name
  | bit_identifier
  | (STRING|WSTRING) (LBRACKET integer RBRACKET)? (ASSIGNMENT character_string)?
  | TIME
  ;

numeric_type_name
  : integer_type_name
  | real_type_name
  ;

integer_type_name
  : signed_integer_type_name
  | unsigned_integer_type_name
  ;

signed_integer_type_name
  : SINT
  | INT
  | DINT
  | LINT
  ;

unsigned_integer_type_name
  : USINT
  | UINT
  | UDINT
  | ULINT
  ;

real_type_name
  : REAL
  | LREAL
  ;

date_type_name
  : DATE
  | TIME_OF_DAY
  | TOD
  | DATE_AND_TIME
  | DT
  ;

bit_identifier
  : BOOL
  | BYTE
  | WORD
  | DWORD
  | LWORD
  ;

/* GENERIC DATA TYPES */

generic_type_name
  : ANY_DERIVED
  | ANY_ELEMENTARY
  | ANY_MAGNITUDE
  | ANY_NUM
  | ANY_REAL
  | ANY_INT
  | ANY_BIT
  | ANY_STRING
  | ANY_DATE
  | ANY
  ;

/* DERIVED DATA TYPES */

data_type_declaration
  : TYPE type_declaration SEMICOLON
      (type_declaration SEMICOLON)*
    END_TYPE
  ;

type_declaration
  : ID COLON (spec_init | structure_declaration )
  ;


spec_init
  : elementary_type_name (ASSIGNMENT constant)?
  | subrange_specification (ASSIGNMENT signed_integer)?
  | enumerated_specification (ASSIGNMENT enumerated_value)?
  | array_specification (ASSIGNMENT array_initialization)?
  | ID (ASSIGNMENT (constant|enumerated_value|array_initialization|structure_initialization))?
  ;

subrange_specification
  : integer_type_name LPARA subrange RPARA
  ;

subrange
  : signed_integer RANGEDOT signed_integer
  ;

enumerated_specification
  : LPARA enumerated_value (COMMA enumerated_value)* RPARA
  ;

enumerated_value
  : ID HASH ID
  | ID -> $1
  ;

array_specification
  : ARRAY LBRACKET subrange (COMMA subrange)* RBRACKET OF (elementary_type_name | ID)
  ;

array_initialization
  : LBRACKET array_initial_elements (COMMA array_initial_elements)* RBRACKET
  ;

array_initial_elements
  : array_initial_element
  | integer LPARA (array_initial_element)? RPARA
  ;

array_initial_element
  : constant
  | enumerated_value
  | structure_initialization
  | array_initialization
  ;

structure_declaration
  : STRUCT structure_element_declaration SEMICOLON
        (structure_element_declaration SEMICOLON)*
    END_STRUCT
  ;

structure_element_declaration
  : ID COLON spec_init
  ;

structure_initialization
  : LPARA structure_element_initialization (COMMA structure_element_initialization)* RPARA
  ;

structure_element_initialization
  : ID ASSIGNMENT (constant | enumerated_value | array_initialization | structure_initialization)
  ;

/* VARIABLES */

variable
  : direct_variable
  | symbolic_variable
  ;

symbolic_variable
  : ID -> $1
  | multi_element_variable
  ;

/* DIRECTLY REPRESENTED VALUES */

direct_variable
  : DIRECT_VAR_PREFIX integer (DOT integer)*
  ;

/* MULTI-ELEMENT VARIABLES */

multi_element_variable
  : array_variable
  | structured_variable
  ;

array_variable
  : symbolic_variable LBRACKET expression (COMMA expression)* RBRACKET
  ;

structured_variable
  : symbolic_variable DOT ID
  ;

/* DECLARATION AND INITIALIZATION */

input_declarations
  : VAR_INPUT (RETAIN | NON_RETAIN)?
         input_declaration SEMICOLON
         (input_declaration SEMICOLON)*
    END_VAR -> new InputDeclarations(@1.first_line, @1.first_column, {}, [])
  ;

input_declaration
  : name_list COLON (edge_declaration | var_init_decl) -> new InputDeclaration(@1.first_line, @1.first_column, {}, [])
  ;

edge_declaration
  : BOOL (R_EDGE | F_EDGE)
  ;

var_init_decl
  : (spec_init | fb_name_decl) -> $1
  ;

fb_name_decl
  : function_block_type_name (ASSIGNMENT structure_initialization)?
  ;

name_list
  : ID name_list_concat*
  ;

name_list_concat
  : COMMA ID -> $2
  ;

output_declaration
  : name_list COLON var_init_decl -> new OutputDeclaration(@1.first_line, @1.first_column, {}, [])
  ;

output_declarations
  : VAR_OUTPUT (RETAIN | NON_RETAIN)?
      output_declaration SEMICOLON
      (output_declaration SEMICOLON)*
    END_VAR -> new OutputDeclarations(@1.first_line, @1.first_column, {}, [])
  ;

input_output_declarations
  : VAR_IN_OUT
      var_declaration SEMICOLON
      (var_declaration SEMICOLON)*
    END_VAR -> new InputOutputDeclarations(@1.first_line, @1.first_column, {}, [])
  ;

var_decl
  : name_list COLON (elementary_type_name | subrange_specification | enumerated_specification | array_specification | ID | fb_name_decl)
  ;

single_byte_string_spec
  : STRING (LBRACKET integer RBRACKET)? (ASSIGNMENT single_byte_character_string)?
  ;

double_byte_string_spec
  : WSTRING (LBRACKET integer RBRACKET)? (ASSIGNMENT double_byte_character_string)?
  ;

var_declarations
  : VAR (CONSTANT)?
      var_init_decl SEMICOLON
      (var_init_decl SEMICOLON)*
    END_VAR -> new VarDeclarations(@1.first_line, @1.first_column, {}, [])
  ;


%%
