var hasAnnotation = require('../utils/hasAnnotation');
module.exports = create();

module.exports.create = create;
var types = require('ast-types');
var n = types.namedTypes;


function create(regexp, logger){

  regexp = regexp ||  /^\s*@ngProvide\s*$/;

  logger = logger || require('../silent-logger');

  var containsNgInjectAnnotation = hasAnnotation(regexp);

  return getsInjection;


  function getsInjection(node){
    if(!n.VariableDeclaration.check(node)){
      logger.logRejectedNode('not a VariableDeclaration', node);
      return false;
    }
    if(!containsNgInjectAnnotation(node)){
      logger.logRejectedNode('does not contain an NgProvide comment', node);
      return false;
    }
    if(missingInit(node)){
      logger.logRejectedNode('at least one variable is missing an initialization', node);
      return false;
    }
    logger.logAcceptedNode(node);
    return true;
  }

  function missingInit(node){
    n.VariableDeclaration.assert(node);
    var missing = false;
    types.visit(node,{
      visitVariableDeclarator:function(path){
        if(path.node.init === null || path.node.init === undefined) missing = true;
        return false;
      }
    });
    return missing;
  }
}