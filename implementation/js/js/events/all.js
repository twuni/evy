function applyNativeSubscriptions( evy ) {

  function subscribeTo( events, subscription ) {
    for( var i = 0; i < events.length; i++ ) {
      evy.subscribe( events[i], subscription );
    }
  }

  subscribeTo( [ "@", "next", "once" ], function() {
  
    var children = this.children;
    var event = arguments[0][0];
    var parameters = Array.prototype.slice.call( arguments, 1 );
    
    toCollection(children).each( function() {
      var child = this;
      evy.subscribe( event, function() {
        child.setSymbols( arguments );
        evy.execute( child );
        evy.unsubscribe( event, arguments.callee );
      } );
    } );

  } );

  subscribeTo( [ "@@", "every", "each" ], function() {

    var children = this.children;
    var event = arguments[0][0];
    var parameters = Array.prototype.slice.call( arguments, 1 );
    
    toCollection(children).each( function() {
      var child = this;
      evy.subscribe( event, function() {
        child.setSymbols( arguments );
        evy.execute( child );
      } );
    } );

  } );

  evy.subscribe( "native", function() {
    eval( arguments[0][arguments[0].length-1] );
  } );

  evy.subscribe( "print", function() {
    var message = [];
    for( var i = 0; i < arguments.length; i++ ) {
      message.push( eval(arguments[i][arguments[i].length-1]) );
    }
    console.log.apply( console, message );
  } );

}
