var parse = function( line, start, parameters ) {

  if( !line ) { line = ""; }
  if( !start ) { start = 0; }
  if( !parameters ) { parameters = []; }

  if( start >= line.length ) { return parameters; }

  var space  = line.indexOf( ' ', start );
  var equals = line.indexOf( '=', start );
  var quote  = line.indexOf( '"', start );

  if( space < 0 ) { space = line.length; }
  if( quote < 0 ) { quote = line.length + 1; }
  if( equals < 0 ) { equals = line.length + 2; }

  var token  = line.substring( start, space );

  if( quote < space ) {
    var matchingQuote = line.indexOf( '"', quote + 1 );
    token = line.substring( start, matchingQuote + 1 );
  }

  var end = start + token.length;

  var parameter = [];

  if( equals < space ) {
    parameter.push( line.substring( start, equals ) );
    parameter.push( line.substring( equals + 1, end ) );
  } else {
    parameter.push( token );
  }

  for( var i = 0; i < parameter.length; i++ ) {
    if( parameter[i].indexOf('"') > -1 ) {
      parameter[i] = parameter[i].substring( 1, parameter[i].length - 1 );
    }
  }

  parameters.push( parameter );

  return arguments.callee( line, end + 1, parameters );

};