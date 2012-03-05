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

    return {

      tree: function() {

        var root = {
          depth: -1,
          name: undefined,
          children: []
        };

        var ancestors = A([root]);

        A( program.split("\n") ).each( function() {

          var node = S(this).toNode();
          var parent = ancestors.last();

          if( !node.name ) {
          } else if( node.depth > parent.depth ) {
            parent.children.push( node );
            ancestors.push( node );
          } else {
            ancestors.pop();
            arguments.callee.apply( this, arguments );
          }

        } );

        return root;

      },

      execute: function( context ) {

        if( !context ) { context = this.tree(); }

        if( context.name ) {

          var event = context.name.replace( PUBLICATION, "$1" );
          var parameters = this.parse( context.name.replace( PUBLICATION, "$2" ) );

          this.publish( event, parameters, context );

        } else {

          for( var i = 0; i < context.children.length; i++ ) {
            arguments.callee.call( this, context.children[i] );
          }

        }

      },

      parse: function( line, start, parameters ) {

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

      },

      publish: function( event, parameters, context ) {

        if( !context ) { context = {}; }

        A( this.events[event] || [] ).each( function() {
          this.behavior.apply( context, parameters );
        } );

      },

      events: {},

      subscribe: function( event, behavior, context ) {

        if( !context ) { context = {}; }

        var events = this.events[event] || [];

        events.push( { context: context, behavior: behavior } );

        this.events[event] = events;

      },

      unsubscribe: function( event, behavior, context ) {

        if( !context ) { context = {}; }

        var events = [];

        A( this.events[event] || [] ).each( function() {
          if( this.behavior !== behavior || this.context !== context ) {
            events.push( this );
          }
        } );

        this.events[event] = events;

      }

    };

  } ).cache();

  return Evy;

} )();
