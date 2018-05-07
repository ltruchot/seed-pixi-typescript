# Pixi + Webpack + TypeScript

A "ready to dev" environment to work with PIXI.js, webpack & typescript for web oriented games/projects. Use it as a seed to begin a new project.

## Launch it

Prerequisite:
* install node > 8.10.0 && npm > 5.8.0 (`npm i -g npm`)
* run `npm i` before first start

Run (dev): `npm start` then browse http://localhost:4200/ with Firefox or Chrome
Build (prod): `npm run build` then use freshly generated "dist" 
## More infos

Current version: Release v5.0.1

Last NPM full update: 2018-03-27

Author: Loïc TRUCHOT

Licences: [CC-BY-NC-4.0](https://creativecommons.org/licenses/by-nc/4.0/): you can use/copy/modify any code but only without commercial intentions.

```
/*
rm -rf node_modules 
  && npm cache verify
  && npm i npm -g
  && npm i @types/node @types/pixi.js clean-webpack-plugin copy-webpack-plugin file-loader html-webpack-plugin awesome-typescript-loader tslint typescript webpack webpack-cli webpack-dev-server tsconfig-paths-webpack-plugin --save-dev
  && npm i pixi.js --save
*/
```
