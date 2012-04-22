( function() {

  function subscribeTo( events, subscription ) {
    for( var i = 0; i < events.length; i++ ) {
      Evy.prototype.subscribe( events[i], subscription );
    }
  }

  subscribeTo( [ "@", "next", "once" ], function() {

    var children = this.children;
    var event = arguments[0][0];
    
    toCollection(children).each( function() {
      var child = this;
      Evy.prototype.subscribe( event, function() {
        Evy.prototype.execute( child );
        Evy.prototype.unsubscribe( event, arguments.callee );
      } );
    } );

  } );

  subscribeTo( [ "@@", "every", "each" ], function() {

    var children = this.children;
    var event = arguments[0][0];
  
    toCollection(children).each( function() {
      var child = this;
      Evy.prototype.subscribe( event, function() {
        Evy.prototype.execute( child );
      } );
    } );

  } );

  Evy.prototype.subscribe( "native", function() {
    eval( arguments[0][0] );
  } );

  Evy.prototype.subscribe( "print", function() {
    console.log( arguments[0][0] );
  } );

} )();
