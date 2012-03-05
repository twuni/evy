var Evy = ( function() {

  var F = function( fn ) {
    return {
      cache: function() {
        return function() {
          return fn.apply( this, arguments );
        };
      }
    };
  };

  var A = F( function( array ) {

    if( !( array instanceof Array ) ) { ( function( proxy ) {
      if( !array ) { array = []; }
      for( var i = 0; i < array.length; i++ ) {
        proxy.push( array[i] );
      }
      array = proxy;
    } )( [] ); }
    
    return {

      each: function( fn ) {
        if( !array ) { return this; }
        for( var i = 0; i < array.length; i++ ) {
          fn.call( array[i] );
        }
        return this;
      },

      first: function() { return this.at(0); },
      last: function() { return this.at( array.length - 1 ); },
      at: function( index ) { return array[index]; },
      push: function( item ) { array.push( item ); return this; },
      pop: function() { return array.pop(); },
      clone: function() { return A( array.slice(0) ); },
      toString: function() { return array.toString(); }

    };

  } ).cache();

  var S = F( function( string ) {

    return {

      toNode: F( function() {

        var node = {};

        node.name = string.replace(/^\s+/g,"");
        node.depth = string.length - node.name.length;
        node.children = [];

        return node;

      } ).cache()

    };

  } ).cache();

  var Evy = F( function( program ) {

    var PUBLICATION = /^([^ ]+)(?: (.+))?$/gi;
    
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
    
    var tree = function() {

      var root = {
        depth: -1,
        name: undefined,
        children: []
      };

      var ancestors = A([root]);

      A( program.split("\n") ).each( function() {

        var node = S(this).toNode();
        var parent = ancestors.last();

        if( !node.name ) { return; }

        if( node.depth > parent.depth ) {
          parent.children.push( node );
          ancestors.push( node );
        } else {
          ancestors.pop();
          arguments.callee.apply( this, arguments );
        }

      } );

      return root;

    };
    
    var execute = function( context ) {

      if( !context ) { context = tree(); }

      if( context.name ) {

        var event = context.name.replace( PUBLICATION, "$1" );
        var parameters = parse( context.name.replace( PUBLICATION, "$2" ) );

        publish( event, parameters, context );

      } else {

        for( var i = 0; i < context.children.length; i++ ) {
          execute( context.children[i] );
        }

      }

    };
    
    var events = {};

    var publish = function( event, parameters, context ) {
      // console.log( "Publishing", event, "event with parameters", parameters, "and execution context", context );
      if( !event ) { throw "Event name must be specified."; }
      if( !parameters ) { parameters = []; }
      if( !context ) { context = {}; }
      A( events[event] || [] ).each( function() {
        this.apply( context, parameters );
      } );
    };

    var subscribe = function( event, behavior ) {
      if( !event ) { throw "Event name must be specified."; }
      if( !behavior ) { throw "Behavior must be a function."; }
      if( !events[event] ) { events[event] = []; }
      events[event].push( behavior );
    };

    var unsubscribe = function( event, behavior ) {
      if( !event ) { throw "Event name must be specified."; }
      if( !behavior ) { events[event] = []; return; }
      var after = [];
      A( events[event] || [] ).each( function() {
        if( this !== behavior ) {
          after.push( this );
        }
      } );
      events[event] = after;
    };

    A( [ "@", "next", "once" ] ).each( function() { subscribe( this, function() {

      var children = this.children;
      var event = arguments[0][0];
      
      A(children).each( function() {
        var child = this;
        subscribe( event, function() {
          execute( child );
          unsubscribe( event, arguments.callee );
        } );
      } );

    } ); } );
    
    A( [ "@@", "every", "each" ] ).each( function() { subscribe( this, function() {

      var children = this.children;
      var event = arguments[0][0];
      
      A(children).each( function() {
        var child = this;
        subscribe( event, function() {
          execute( child );
        } );
      } );

    } ); } );
    
    subscribe( "native", function() {
      eval( arguments[0][0] );
    } );

    subscribe( "print", function() {
      console.log( arguments[0][0] );
    } );

    return {
      execute: execute,
      publish: publish,
      subscribe: subscribe,
      unsubscribe: unsubscribe
    };

  } ).cache();

  return Evy;

} )();
