var Node = function( string ) {
  string = "" + string;
  this.name = string.replace( /^\s+/g, "" );
  this.depth = string.length - node.name.length;
};

Node.prototype = {
  children: [],
  symbols: {}
};
