# websocket-auth
Experiment to connect twitter auth to a node/express app that hosts multi-user websocket game experience. The original game code (Without auth) is here: https://github.com/kfarr/flowvr-hackathon but this code could be applied to any node/express app.

## How to
* clone and run `npm install`
* add your own Twitter oauth app "consumer secret" to app.js
* `npm start` to start the webserver
* then point browser to `127.0.0.1:3000` # (do not use localhost:3000, it won't work through twitter oauth process)

## Notes
* simple proof of concept - does the oauth roundtrip to get twitter token / id.
* now needs to be hooked up to player object to store user info
* then create / validate websocket "session" (connections) based on the validated user
* in app.js need consumer secret, you'll need your own key and secret from twitter: https://apps.twitter.com/
