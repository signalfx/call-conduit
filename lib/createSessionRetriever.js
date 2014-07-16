var crypto = require('crypto'),
  http = require('http'),
  url = require('url'),
  q = require('q');

var authTimeout = 14 * 60 * 1000; // 14 minutes
module.exports = function(host){
  var lastAuthenticated = -Math.Infinity;
  var sessionData;

  function createSessionResult(){
    return {
      host: host,
      data: sessionData
    };
  }

  return function(){
    if(lastAuthenticated > (Date.now() - authTimeout)){
      return q.when(createSessionResult);
    }

    return getSession(host).then(function(data){
      sessionData = data.result;
      lastAuthenticated = Date.now();
      return createSessionResult();
    });
  }
}

function buildSignature(token, cert){
  var sha1 = crypto.createHash('sha1');
  return sha1.update(token + cert).digest('hex');
}

function getSession(host){
  var deferred = q.defer();
  var token = Date.now() / 1000;
  var params = {
    user: host.user,
    client: 'hubot',
    host: host.hostname,
    authToken: token,
    authSignature: buildSignature(token, host.cert)
  };
  var formData = 'params=' + JSON.stringify(params) + '&output=json';
  var options = {
    host: host.url.host,
    port: 80,
    path: '/api/conduit.connect',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(formData)
    }  
  }
  
  var req = http.request(options, function(res){
    if(res.statusCode !== 200) {
      deferred.reject(res);
      return;
    }

    var chunks = [];
    res.on('data', function(data){
      chunks.push(data);
    });

    res.on('end', function(){
      var data = JSON.parse(chunks.join(''));
      deferred.resolve(data);
    });
  });

  req.end(formData);

  return deferred.promise;
}
