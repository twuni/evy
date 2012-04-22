function cacheOf( fn ) {
  return ( function( cache, delimiter ) {
    return function() {
      var key = Array.prototype.join.call( arguments, delimiter );
      cache[key] = ( cache[key] === undefined ) ? fn.apply( this, arguments ) : cache[key];
      return cache[key];
    };
  } )( {}, Math.random() );
};
