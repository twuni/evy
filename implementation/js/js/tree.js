var tree = function( program ) {

  var root = {
    depth: -1,
    name: undefined,
    children: []
  };

  var ancestors = toCollection([root]);

  toCollection( program.split("\n") ).each( function() {

    var node = toStatement(this).toNode();
    var parent = ancestors.last();

    if( !node.name ) { return; }

    if( node.depth > parent.depth ) {
      parent.children.push( node );
      ancestors.push( node );
    } else {
      ancestors.pop();
      arguments.callee.apply( this, arguments );
    }

  } );

  return root;

};
