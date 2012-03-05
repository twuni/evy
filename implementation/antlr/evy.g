grammar evy;

PUBLICATION : IDENTIFIER (' ' CONTEXT)* ;
fragment CONTEXT : (IDENTIFIER '=')? ATOM ;
fragment ATOM : (STRING|INTEGER|FLOAT|BOOLEAN) ;
fragment BOOLEAN : ('true'|'false') ;
fragment IDENTIFIER : ('!'|'#'..'*'|','|'.'..'/'|':'..'~') ('!'..'~')* ;
fragment INTEGER : ('+'|'-')? '0'..'9'+ ;
fragment FLOAT : '0'..'9'+ '.' ('0'..'9')+ EXPONENT? | '0'..'9'+ EXPONENT ;
fragment STRING : '"' ( ESCAPE_SEQUENCE | ~('\\'|'"') )* '"' ;
fragment EXPONENT : ('e'|'E') INTEGER ;
fragment ESCAPE_SEQUENCE : '\\' ('a'..'z'|'"'|'\''|'\\') | UNICODE_ESCAPE_SEQUENCE ;
fragment UNICODE_ESCAPE_SEQUENCE : '\\u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT ;
fragment HEX_DIGIT : ('0'..'9'|'a'..'f'|'A'..'F') ;
