var toStatement = cacheOf( function( string ) {

  return {

    toNode: cacheOf( function() {

      var node = {};

      node.name = string.replace(/^\s+/g,"");
      node.depth = string.length - node.name.length;
      node.children = [];
      node.symbols = {};

      return node;

    } )

  };

} );
