var Enumeration = function( map ) {
  for( var key in map ) {
    this[key] = map[key];
  }
};

Enumeration.prototype.keyOf = function( value ) {
  for( var key in this ) {
    if( this[key] === value ) { return key; }
  }
};
