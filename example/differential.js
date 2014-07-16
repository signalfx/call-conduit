var callConduit = require('../')();

callConduit('differential.query', {ids: ['2129']}).then(function(data){
    console.log(data); 
});