var Log = function( name, level ) {

  this.name = name;
  this.level = level;

  function log( level ) {
    var timestamp = new Date().getTime();
    var label = "[" + Log.Level.keyOf(level) + "]";
    var tokens = Array.prototype.slice.call( arguments, 1 );
    var message = [ name, timestamp, label ].concat( tokens );
    console.log.apply( console, message );
  }
  
  function filter( priority ) {
    return function() {
      if( level >= priority ) {
        log.apply( this, [ priority ].concat( Array.prototype.slice.call( arguments ) ) );
      }
    }
  }
  
  this.severe = filter( Log.Level.SEVERE );
  this.error = filter( Log.Level.ERROR );
  this.warn = filter( Log.Level.WARN );
  this.info = filter( Log.Level.INFO );
  this.debug = filter( Log.Level.DEBUG );
  this.trace = filter( Log.Level.TRACE );

};

Log.Level = new Enumeration( {
  SEVERE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  TRACE: 5
} );
