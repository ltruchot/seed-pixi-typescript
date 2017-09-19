# Pixi playground

A "ready to dev" environment to work with PIXI.js, webpack & typescript for web oriented games/projects.
Any change in server or client files will trigger a hot reload.


## Launch it

Prerequisite:
* install node > 8.0.0 && npm > 5.0.0 (`npm i -g npm`)
* install pm2 globally (`npm i -g pm2`) - a process manager for node.js
* run `npm i` before first start

Run (dev): `npm start` then browse http://localhost:5000/ with Firefox or Chrome

Build (prod): `npm run release && npm run deploy` then browse http://localhost:3000.

* `pm2 list` to if you want to check pm2 process.
* `npm run cleanserver && npm run release && cd dist && node server.js` if you prefer to launch the server yourself, with node.

## More infos

Current version: Release v4.0.1

Last NPM full update: 2017-09-19

Author: Loïc TRUCHOT

Licences: [CC-BY-NC-4.0](https://creativecommons.org/licenses/by-nc/4.0/): you can use/copy/modify any code but only without commercial intentions.
