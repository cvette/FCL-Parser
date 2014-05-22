%lex

DIGIT = [0-9]
IDENTIFIER = ([a-zA-Z] | (\_([a-zA-Z] | [0-9]))) ((\_)? ([a-zA-Z] | [0-9]))*
SINGLE_BYTE_STRING = \'[.^\']|"$\'"\'
DOUBLE_BYTE_STRING = \"[.^\']|"$\""\"
BINARY_INTEGER = "2#"\s*[0-1]\s*(\_?[0-1])*
OCTAL_INTEGER = "8#"\s*[0-7]\s*(\_?[0-7])*
HEX_INTEGER = "16#"\s*[0-9A-F]\s*(\_?[0-9A-F])*
REAL = (\+|\-)?[0-9](\_?[0-9])*\.[0-9](\_?[0-9])*
DIRECT_VAR_PREFIX = %\s*[IQM]{1}\s+("NIL"|[WDLXB]){1}
DURATION_PREFIX = ("T"|"TIME")\s*#\s*\-?

%options flex case-insensitive

%%

\s+                 /* IGNORE */
ACCU                return 'ACCU'
ACT                 return 'ACT'
AND                 return 'AND'
ANY                 return 'ANY'
ANY_DERIVED         return 'ANY_DERIVED'
ANY_ELEMENTARY      return 'ANY_ELEMENTARY'
ANY_MAGNITUDE       return 'ANY_MAGNITUDE'
ANY_NUM             return 'ANY_NUM'
ANY_REAL            return 'ANY_REAL'
ANY_INT             return 'ANY_INT'
ANY_BIT             return 'ANY_BIT'
ANY_STRING          return 'ANY_STRING'
ANY_DATE            return 'ANY_DATE'
ARRAY               return 'ARRAY'
ASUM                return 'ASUM'
BDIF                return 'BDIF'
BSUM                return 'BSUM'
BYTE                return 'BYTE'
BOOL                return 'BOOL'
CoA                 return 'CoA'
CoG                 return 'CoG'
CoGS                return 'CoGS'
CONSTANT            return 'CONSTANT'
DATE                return 'DATE'
DATE_AND_TIME       return 'DATE_AND_TIME'
DT                  return 'DT'
DEFAULT             return 'DEFAULT'
DEFUZZIFY           return 'DEFUZZIFY'
DINT                return 'DINT'
{DIRECT_VAR_PREFIX} return 'DIRECT_VAR_PREFIX'
{DURATION_PREFIX}   return 'DURATION_PREFIX'
DWORD               return 'DWORD'
END_DEFUZZIFY       return 'END_DEFUZZIFY'
END_FUNCTION_BLOCK  return 'END_FUNCTION_BLOCK'
END_FUZZIFY         return 'END_FUZZIFY'
END_OPTIONS         return 'END_OPTIONS'
END_RULEBLOCK       return 'END_RULEBLOCK'
END_VAR             return 'END_VAR'
END_TYPE            return 'END_TYPE'
FUNCTION_BLOCK      return 'FUNCTION_BLOCK'
FUZZIFY             return 'FUZZIFY'
IF                  return 'IF'
INT                 return 'INT'
IS                  return 'IS'
LM                  return 'LM'
LINT                return 'LINT'
LREAL               return 'LREAL'
LWORD               return 'LWORD'
METHOD              return 'METHOD'
MAX                 return 'MAX'
MIN                 return 'MIN'
MOD                 return 'MOD'
NC                  return 'NC'
NIL                 return 'NIL'
NOT                 return 'NOT'
NON_RETAIN          return 'NON_RETAIN'
NSUM                return 'NSUM'
OPTIONS             return 'OPTIONS'
OF                  return 'OF'
OR                  return 'OR'
PROD                return 'PROD'
RANGE               return 'RANGE'
REAL                return 'REAL'
RETAIN              return 'RETAIN'
RM                  return 'RM'
RULEBLOCK           return 'RULEBLOCK'
RULE                return 'RULE'
TERM                return 'TERM'
TIME_OF_DAY         return 'TIME_OF_DAY'
TIME                return 'TIME'
TOD                 return 'TOD'
USINT               return 'USINT'
UINT                return 'UINT'
ULINT               return 'ULINT'
UDINT               return 'UDINT'
THEN                return 'THEN'
TYPE                return 'TYPE'
VAR_OUTPUT          return 'VAR_OUTPUT'
VAR_INPUT           return 'VAR_INPUT'
VAR_IN_OUT          return 'VAR_IN_OUT'
VAR                 return 'VAR'
WORD                return 'WORD'
WITH                return 'WITH'
WSTRING             return 'WSTRING'
STRUCT              return 'STRUCT'
STRING              return 'STRING'
SINT                return 'SINT'
END_STRUCT          return 'END_STRUCT'
FALSE               return 'FALSE'
TRUE                return 'TRUE'
{SINGLE_BYTE_STRING} return 'SINGLE_BYTE_STRING'
{DOUBLE_BYTE_STRING} return 'DOUBLE_BYTE_STRING'
{IDENTIFIER}        return 'ID'
{BINARY_INTEGER}    return 'BINARY_INTEGER'
{OCTAL_INTEGER}     return 'OCTAL_INTEGER'
{HEX_INTEGER}       return 'HEX_INTEGER'
{REAL_NUMBER}       return 'REAL_NUMBER'
{DIGIT}             return 'DIGIT'
"$$"                return 'EDOLLAR'
"$L"                return 'LDOLLAR'
"$N"                return 'NDOLLAR'
"$P"                return 'PDOLLAR'
"$R"                return 'RDOLLAR'
"$T"                return 'TDOLLAR'
"$'"                return 'ESINGLEQUOTE'
"$'"                return 'EQUOTE'
"$"                 return 'DOLLAR'
{LETTER}            return 'LETTER'
"#"                 return 'HASH'
"%"                 return 'PERCENT'
"'"                 return "SINGLEQUOTE"
'"'                 return 'QUOTE'
"+"                 return 'PLUS'
"-"                 return 'DASH'
"_"                 return 'LDASH'
"/"                 return 'SLASH'
"**"                return 'DOUBLE_ASTERISK'
"*"                 return 'ASTERISK'
")"                 return 'RPARA'
"("                 return 'LPARA'
"["                 return 'LBRACKET'
"]"                 return 'RBRACKET'
";"                 return 'SEMICOLON'
","                 return 'COMMA'
":="                return 'ASSIGNMENT'
"=>"                return 'ARROW'
"="                 return 'EQUALS'
"&"                 return 'AMPERSAND'
"<>"                return 'UNEQUAL'
"<="                return 'LOWER_EQUAL'
">="                return 'BIGGER_EQUAL'
":"                 return 'COLON'
"<"                 return 'LOWER'
"<"                 return 'BIGGER'
"."                 return 'DOT'
".."                return 'RANGEDOT'
<<EOF>>             return 'EOF'
.                   return 'INVALID'