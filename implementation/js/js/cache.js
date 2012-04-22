function cacheOf( something ) {

  switch( typeof(something) ) {

    case "function":

      return ( function( cache, delimiter ) {
        return function() {
          var key = Array.prototype.join.call( arguments, delimiter );
          cache[key] = ( cache[key] === undefined ) ? something.apply( this, arguments ) : cache[key];
          return cache[key];
        };
      } )( {}, Math.random() );

    case "object":

      for( var key in something ) {
        something[key] = cacheOf( something[key] );
      }

  }

  return something;

};
