function Node( string ) {

  string = "" + string;

  this.name = string.replace( /^\s+/g, "" );
  this.depth = string.length - this.name.length;
  this.children = [];
  this.symbols = {};

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
      ancestors.push( node );
    } else {
      ancestors.pop();
      arguments.callee.call( this );
    }

  } );

};
