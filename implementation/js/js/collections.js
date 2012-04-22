var toCollection = cacheOf( function( array ) {
  
  array = Array.prototype.slice.call( array );

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
    clone: function() { return toCollection( array.slice() ); },
    toString: function() { return array.toString(); }

  };

} );
