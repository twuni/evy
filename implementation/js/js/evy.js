var Evy = ( function() {

  var Evy = cacheOf( function( program ) {

    var PUBLICATION = /^([^ ]+)(?: (.+))?$/gi;
    
    var execute = function( context ) {

      if( !context ) { context = tree( program ); }

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
      toCollection( events[event] || [] ).each( function() {
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
      toCollection( events[event] || [] ).each( function() {
        if( this !== behavior ) {
          after.push( this );
        }
      } );
      events[event] = after;
    };

    return {
      execute: execute,
      publish: publish,
      subscribe: subscribe,
      unsubscribe: unsubscribe
    };

  } );

  return Evy;

} )();
