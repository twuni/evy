function Node( string ) {

  string = "" + string;

  this.log = new Log( "Node " + string, Log.Level.TRACE );
  this.name = string.replace( /^\s+/g, "" );
  this.depth = string.length - this.name.length;
  this.children = [];
  this.symbols = {};

};

Node.prototype.lookup = function( key ) {
  return this.symbols[key] || ( this.parent ? this.parent.lookup(key) : undefined );
};

Node.prototype.setSymbols = function( parameters ) {
  this.log.trace( "setSymbols(", parameters, ")" );
  for( var i = 0; i < parameters.length; i++ ) {
    this.log.debug( " - Considering", parameters[i] );
    if( parameters[i].length == 2 ) {
      this.symbols[parameters[i][0]] = parameters[i][1];
    }
  }
};

function Tree( program ) {

  this.name = undefined;
  this.depth = -1;
  this.children = [];
  this.symbols = {};

  var $ = toCollection;

  var ancestors = $( [this] );
  var lines = program.split("\n");
  
  $( lines ).each( function() {

    var node = new Node(this);
    var parent = ancestors.last();
    
    if( !node.name ) { return; }

    if( node.depth > parent.depth ) {
      parent.children.push( node );
      node.parent = parent;
      ancestors.push( node );
    } else {
      ancestors.pop();
      arguments.callee.call( this );
    }

  } );

};

Tree.prototype.lookup = Node.prototype.lookup;
Tree.prototype.setSymbols = Node.prototype.setSymbols;
