function cloneOf( object ) {
  var clone = {};
  for( var key in object ) {
    clone[key] = object[key];
  }
  return clone;
}
