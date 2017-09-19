# Pixi playground


An environnement "ready to dev" to work with pixi.js, webpack & typescript for web oriented games/projects.

Any change in server or client files will trigger a hot reload.


Prerequisite:
* run `npm i` before fist start
* install pm2 globally (`npm i -g pm2`)
* node > 8.0.0 && npm > 5.0.0


Run (dev): `npm start` then browse http://localhost:5000/ with Firefox or Chrome


Build (: `npm run release && npm run deploy` then browse http://localhost:3000.

Run `pm2 list` to if you want to check pm2 process.

Run `npm run cleanserver && npm run release && cd dist && node server.js` if you prefer to launche the server with node.


Current version: Release v4.0.0 "Typescript & Webpack".

Last NPM full update: 2017-09-19


Author: Loïc TRUCHOT

Licences: [CC-BY-NC-4.0](https://creativecommons.org/licenses/by-nc/4.0/): you can use/copy/modify any code but only without commercial intentions.
