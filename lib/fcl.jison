/* Fuzzy Control Language (FCL) */

%{
var ast = require('./lib/fcl_ast'),

Library                     = ast.Library
DataType                    = ast.DataType
FunctionBlock               = ast.FunctionBlock
FunctionBlockBody           = ast.FunctionBlockBody
FuzzifyBlock                = ast.FuzzifyBlock
DefuzzifyBlock              = ast.DefuzzifyBlock
RuleBlock                   = ast.RuleBlock
OptionBlock                 = ast.OptionBlock
LinguisticTerm              = ast.LinguisticTerm
MembershipFunction          = ast.MembershipFunction
Points                      = ast.Points
Rule                        = ast.Rule
Range                       = ast.Range
WeightingFactor             = ast.WeightingFactor
OperatorDefinition          = ast.OperatorDefinition
ActivationMethod            = ast.ActivationMethod
AccumulationMethod          = ast.AccumulationMethod

%}

%ebnf

%%

library
  : data_type_declaration* function_block_declaration* EOF
       { return Library({}, [$1, $2]) }
  ;
function_block_declaration
  : FUNCTION_BLOCK ID
         fb_io_var_declarations*
         other_var_declarations*
         function_block_body
    END_FUNCTION_BLOCK -> FunctionBlock({name: $2}, [$3, $4, $5, $6, $7, $8])
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
    option_block* -> FunctionBlockBody({}, [$1, $2, $3, $4])
  ;

fuzzify_block
  : FUZZIFY_BLOCK ID
         linguistic_term*
    END_FUZZIFY -> FuzzifyBlock({variable: $2}, [$4])
  ;

defuzzify_block
  : DEFUZZIFY ID
         range?
         linguistic_term*
         defuzzification_method
         default_value
    END_DEFUZZIFY -> DefuzzifyBlock({variable: $2}, [$3, $4, $5, $6])
  ;

rule_block
  : RULEBLOCK rule_block_name
        operator_definition
        activation_method?
        accumulation_method
        rule*
    END_RULEBLOCK -> RuleBlock({name: $2}, [$3, $4, $5, $6])
  ;

option_block
  : OPTION
      /* any manufacturer specific parameters */
    END_OPTION -> OptionBlock({}, [])
  ;

linguistic_term
  : TERM ID ASSIGNMENT membership_function SEMICOLON -> LinguisticTerm({name: $2}. [$4])
  ;

membership_function
  : (singleton | points) -> MembershipFunction({}, [$1])
  ;

singleton
  : numeric_literal -> $1
  | ID -> $1
  ;

points
  : (LPARA (numeric_literal | ID) COMMA numeric_literal RPARA)* -> Points({}, )
  ;

defuzzification_method
  : METHOD COLON (CoG | CoGS | CoA | LM | RM) SEMICOLON
  ;

default_value
  : DEFAULT ASSIGNMENT numeric_literal | NC SEMICOLON
  ;

range
  : RANGE LPARA numeric_literal RANGEDOT numeric_literal RPARA SEMICOLON -> Range({}, [$3, $5])
  ;

operator_definition
  : (OR COLON (MAX | ASUM | BSUM))?
    (AND COLON (MIN | PROD | BDIF))? SEMICOLON -> OperatorDefinition({operator: yytext}, [])
  ;

activation_method
  : ACT COLON (PROD | MIN) SEMICOLON -> ActivationMethod({name: yytex}, [])
  ;

accumulation_method
  : ACCU COLON (MAX | BSUM | NSUM) SEMICOLON -> AccumulationMethod({name: yytext}, [])
  ;

rule
  : RULE integer_literal COLON
    IF condition THEN conclusion (WITH weighting_factor)? SEMICOLON
        { $$ = Rule({number: $2}, [$condition, $conclusion, $weighting_factor])}
  ;

condition
  : x(( AND x | OR x ))*
  ;

x
  : (NOT)? ((subcondtion) | (LPARA condition RPARA))
  ;

subcondition
  : ID IS (NOT)? ID
  | ID
  ;

conclusion
  : ID (IS ID) (COMMA ID (IS ID)?)*
  ;

weighting_factor
  : (variable | numeric_literal) -> WeightingFactor({}, [$1])
  ;

/* according to IEC 61131-3 */

constant
  : numeric_literal
  | character_string
  | time_literal
  | bit_string_literal
  | boolean_literal
  ;

numeric_literal
  : integer_literal -> $1
  | real_literal -> $1
  ;

signed_integer
  : (PLUS | DASH) integer
  | integer
  ;

integer_literal
  : integer_type_name HASH ( signed_integer | BINARY_INTEGER | OCTAL_INTEGER | HEX_INTEGER)
  | ( signed_integer | BINARY_INTEGER | OCTAL_INTEGER | HEX_INTEGER)
  ;

integer
  : DIGIT ((LDASH)? DIGIT)*
  ;

real_literal
  : real_type_name HASH REAL_NUMBER (exponent)?
  | REAL_NUMBER (exponent)?
  ;

exponent
  : (E) (PLUS | DASH)? integer
  ;

bit_string_literal
  : bit_string_type_name HASH (integer | BINARY_INTEGER | OCTAL_INTEGER | HEX_INTEGER)
  ;

bit_string_type_name
  : BYTE
  | WORD
  | DWORD
  | LWORD
  ;

boolean_literal
  : TRUE
  | FALSE
  ;


character_string
  : SINGLE_BYTE_STRING
  | DOUBLE_BYTE_STRING
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
  | ID
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
  : ID
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
    END_VAR
  ;

input_declaration
  : name_list COLON (edge_declaration | var_init_decl)
  ;

edge_declaration
  : BOOL (R_EDGE | F_EDGE)
  ;

var_init_decl
  : (spec_init | fb_name_decl)
  ;

fb_name_decl
  : function_block_type_name (ASSIGNMENT structure_initialization)?
  ;

name_list
  : ID (COMMA ID)*
  ;

output_declarations
  : VAR_OUTPUT (RETAIN | NON_RETAIN)?
      var_init_decl SEMICOLON
      (var_init_decl SEMICOLON)*
    END_VAR
  ;

input_output_declarations
  : VAR_IN_OUT
      var_declaration SEMICOLON
      (var_declaration SEMICOLON)*
    END_VAR
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
    END_VAR
  ;


%%
