# websocket-auth
Experiment to connect websocket with an authentication mechanism

## How to
* clone and run `npm install`
* `npm start` to start the webserver
* then point browser to `127.0.0.1:3000` # (do not use localhost:3000, it won't work through twitter oauth process)

## Notes
* simple proof of concept - does the oauth roundtrip to get twitter token / id.
* now needs to be hooked up to player object to store user info and create / validate wesocket "session" based on the validated user
* in app.js need consumer secret, you'll need your own key and secret from twitter: https://apps.twitter.com/
