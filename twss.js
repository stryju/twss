/*jshint
  node:true
*/
(function () {
  'use strict';

  var twss      = require( 'twss' );
  var express   = require( 'express' );
  var dust      = require( 'dustjs-linkedin' );
  var cons      = require( 'consolidate' );
  var path      = require( 'path' );
  var cors      = require( 'cors' );
  var validator = require( 'express-validator');

  var sentences = require( path.join( __dirname, 'assets', 'data', 'twss.json' ) );

  twss.treshold = 0.65;
  // twss.algo     = 'knn';

  var app = express();
  app.engine( 'dust', cons.dust );

  app.configure( function appConfigure() {
    app.set( 'template_engine', 'dust' );
    app.set( 'view engine', 'dust' );
    app.set( 'views', path.join( __dirname,  'assets', 'templates' ) );

    app.use( validator() );
    app.use( cors() );
    app.use( express.favicon() );
    app.use( express.bodyParser() );
    app.use( express.static( path.join( __dirname, 'public' ) ) );
    app.use( express.logger( 'dev' ) );
  });

  // function template( input, isTwss ) {
  //   return 'foo'; //isTwss.toString();
  // }

  var responseHandlers = {
    'text/plain' : function ( res, isTWSS ) {
      return res.send( isTWSS.toString() );
    },
    'application/json' : function ( res, isTWSS ) {
      var responseJSON = {
        twss : isTWSS
      };

      return res.send( JSON.stringify( responseJSON ) );
    }
  };

  function getRandomTWSS() {
    var randomIndex = ~~ ( Math.random() * sentences.length );
    return sentences[ randomIndex ] || 'it\'s hard!';
  }

  function handleResponse( res, input ) {
    // return response.send( 'foo' );
    input = input || getRandomTWSS();
    var isTWSS = twss.is( input );

    if ( res.format in responseHandlers ) {
      return responseHandlers[ res.format ]( res, isTWSS );
    }

    return res.render( 'index' , {
      title : 'twss',
      json : {
        twss : isTWSS
      },
      jsonFull : {
        input : input,
        twss  : isTWSS
      }
    });
  }

  app.get( '/:sentence', function ( req, res ) {
    return handleResponse( res, req.sanitize( 'sentence' ).xss() );
  });

  app.get( '/', function ( req, res ) {
    return handleResponse( res );
  });

  app.post( '/', function ( req, res ) {
    return handleResponse( res, req.sanitize( 'sentence' ).xss() );
  });

  var port = process.env.PORT || 5000;

  app.listen( port, function () {
    console.log( 'Listening on ' + port );
  });
})();
