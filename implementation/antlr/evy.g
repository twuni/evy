grammar evy;

PUBLICATION
	:	IDENTIFIER (' ' CONTEXT)*
	;

fragment
CONTEXT
	:	(IDENTIFIER '=')? ATOM
	;

fragment
ATOM	
	:	(STRING|INT|FLOAT|BOOLEAN)
	;

fragment
BOOLEAN
	:	('true'|'false')
	;

fragment
IDENTIFIER  :	('a'..'z'|'A'..'Z'|'_') ('a'..'z'|'A'..'Z'|'0'..'9'|'_')*
    ;

fragment
INT :	'0'..'9'+
    ;

fragment
FLOAT
    :   ('0'..'9')+ '.' ('0'..'9')* EXPONENT?
    |   ('0'..'9')+ EXPONENT
    ;

fragment
STRING
    :  '"' ( ESC_SEQ | ~('\\'|'"') )* '"'
    ;

fragment
CHAR:  '\'' ( ESC_SEQ | ~('\''|'\\') ) '\''
    ;

fragment
EXPONENT : ('e'|'E') ('+'|'-')? ('0'..'9')+ ;

fragment
HEX_DIGIT : ('0'..'9'|'a'..'f'|'A'..'F') ;

fragment
ESC_SEQ
    :   '\\' ('b'|'t'|'n'|'f'|'r'|'\"'|'\''|'\\')
    |   UNICODE_ESC
    |   OCTAL_ESC
    ;

fragment
OCTAL_ESC
    :   '\\' ('0'..'3') ('0'..'7') ('0'..'7')
    |   '\\' ('0'..'7') ('0'..'7')
    |   '\\' ('0'..'7')
    ;

fragment
UNICODE_ESC
    :   '\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
    ;
