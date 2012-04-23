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
        child.setSymbols( parameters );
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
        child.setSymbols( parameters );
        evy.execute( child );
      } );
    } );

  } );

  evy.subscribe( "native", function() {
    eval( arguments[0][0] );
  } );

  evy.subscribe( "print", function() {
    console.log( arguments[0][0] );
  } );

}
