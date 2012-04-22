var LOG = new Log( "Evy", Log.Level.TRACE );
var PUBLICATION = /^([^ ]+)(?: (.+))?$/gi;
var $ = toCollection;

var Evy = function( program ) {

  this.root = tree( program );
  this.events = {};

};

Evy.prototype = {

  events: {},

  subscribe: function( event, behavior ) {

    LOG.trace( this, "subscribe(", event, behavior, ")" );

    if( !event ) { throw "Event name must be specified."; }
    if( !behavior ) { throw "Behavior must be a function."; }
    if( !this.events[event] ) { this.events[event] = []; }

    this.events[event].push( behavior );

  },

  unsubscribe: function( event, behavior ) {

    LOG.trace( this, "unsubscribe(", event, behavior, ")" );

    if( !event ) { throw "Event name must be specified."; }
    if( !behavior ) { this.events[event] = []; return; }

    var after = [];
    $( this.events[event] ).each( function() {
      if( this !== behavior ) {
        after.push( this );
      }
    } );

    this.events[event] = after;

  },

  publish: function( event, parameters, context ) {

    LOG.trace( this, "publish(", event, parameters, context, ")" );

    if( !event ) { throw "Event name must be specified."; }
    if( !parameters ) { parameters = []; }
    if( !context ) { context = {}; }

    $( this.events[event] ).each( function() {
      this.apply( context, parameters );
    } );

  },

  execute: function( context ) {

    if( !context ) { context = this.root; }

    if( context.name ) {

      var event = context.name.replace( PUBLICATION, "$1" );
      var parameters = parse( context.name.replace( PUBLICATION, "$2" ) );

      this.publish( event, parameters, context );

    } else {

      for( var i = 0; i < context.children.length; i++ ) {
        this.execute( context.children[i] );
      }

    }

  }

};
