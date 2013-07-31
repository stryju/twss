/*jshint
  node:true
*/
(function () {
  'use strict';

  var twss = require( 'twss' );
  var express = require( 'express' );

  var app = express();
  app.use( express.logger() );

  app.get( '/:sentence', function ( request, response ) {
    response.send( twss.is( request.params.sentence ) ? 'twss!' : 'meh' );
  });
  app.get( '/', function ( request, response ) {
    response.send( '/[sentence to check]' );
  });

  var port = process.env.PORT || 5000;
  app.listen( port, function () {
    console.log( 'Listening on ' + port );
  });
})();
