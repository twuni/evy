function each( array, behavior ) {
  if( !array ) { array = []; }
  if( !behavior ) { behavior = function() {}; }
  for( var i = 0; i < array.length; i++ ) {
    behavior.call( array[i], array[i], i );
  }
}

var Evy = ( function() {

  var subscribers = {};
  
  function parseArg( token ) {
    var arg = {
      key: token.replace( /(.+)=(.+)/g, "$1" ),
      value: token.replace( /(.+)=(.+)/g, "$2" )
    };
    if( arg.key === token ) {
      arg.key = undefined;
    }
    return arg;
  };

  return {

    publish: function( event, args ) {

      if( !subscribers[event] ) {
        return;
      }

      each( subscribers[event], function() {
        this.behavior.apply( Evy, args );
      } );

    },

    subscribe: function( event, args, behavior ) {

      if( !subscribers[event] ) {
        subscribers[event] = [];
      }

      subscribers[event].push( {
        event: event,
        args: args,
        behavior: behavior
      } );

    },

    parse: function(script) {

      var statements = [];

      each( script.split("\n"), function( line ) {

        var statement = {};

        statement.indent = line.replace( /^(\s*).+/g, "$1" ).length;
        statement.publishing = true;
        statement.args = [];

        each( line.replace( /^\s+(.+)/, "$1" ).split(/\s+/g), function(token, index) {
        
          switch(index) {
            case 0:
              if( token === "@" ) {
                statement.publishing = false;
              } else {
                statement.event = token;
              }
              break;
            case 1:
              if( !statement.publishing ) {
                statement.event = token;
              } else {
                statement.args.push(parseArg(token));
              }
              break;
            default:
              statement.args.push(parseArg(token));
              break;
          }

        } );

        if( statement.event ) {
          statements.push( statement );
        }

      } );

      return statements;

    },
  
    execute: function( statement ) {
      if( statement.publishing ) {
        Evy.publish( statement.event, statement.args );
      } else {
        Evy.subscribe( statement.event, statement.args, statement.behavior );
      }
    }

  };

} )();
