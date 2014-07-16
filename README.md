# call-conduit

Call the [phabricator conduit api](https://secure.phabricator.com/book/phabdev/article/conduit/) with Node.js.

## Install
`npm install call-conduit`

## Use

```javascript
// Initialize call conduit according to ~/.arcrc
var callConduit = require('call-conduit')();

callConduit('differential.query', {ids: ['2129']}).then(function(data){
    console.log(data); 
});
```

If you don't want to use the contents of ~/.arcrc, you can manually pass in a
host object when constructing callConduit, like so:
```javascript
var myHost: {
        'user': 'mycert',
        'cert': '...',
        'api' 'http://myphabricator.inter.net/api/'
    }
};
var callConduit = require('call-conduit')(myHost);
```