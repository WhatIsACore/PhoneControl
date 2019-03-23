'use strict';

function moduleAvailable(name){
  try {
    require.resolve(name);
    return true;
  } catch(e){}
  return false;
}

var Keys;
if(moduleAvailable('./keys')){
  Keys = require('./keys');
} else {
  Keys = process.env;
}

module.exports = {
  debug: moduleAvailable('./keys'),
  port: Keys.PORT || 5000
};
