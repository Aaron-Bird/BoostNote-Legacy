# Boostnote

Simple note app

## Inspired by

- Atom
- Quiver
- Evernote
- GitKraken
- GitBook

## System requirement

This app is built on Electron.

You can check it from [here](https://github.com/electron/electron/blob/master/docs/tutorial/supported-platforms.md).

Currently, I'm testing this app on Windows 10(64bit), OS X El Capitan, Ubuntu Linux, Arch Linux.

## Develop

1. turn on HMR server

  ```
  npm run webpack
  ```

2. run hot mode

  ```
  npm run hot
  ```

> `npm start` is using compiled scripts. see [Build](#Build) to compile scripts.

## Build

1. Compile scripts

  compile all browser stuff(Javascript, Stylus).

  ```
  grunt compile
  ```

2. Build executable

  build `Boostnote.app` (OS X) / `Boostnote.exe` (Windows)

  ```
  grunt pack:osx
  grunt pack:windows
  ```

Also there are some tasks for CodeSign(OS X) and Authenticode(Windows). To use these tasks, you need to aquire your own certifications.

## Using stack

- Electron
- React
- Webpack
- Redux
- CSSModules


## Codestyle

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Author

[Rokt33r(Dick Choi of MAISIN&CO.)](https://github.com/rokt33r)

## Contributors

- [dojineko](https://github.com/dojineko)
- [Romain Bazile](https://github.com/gromain)
- [Bruno Paz](https://github.com/brpaz)

## Copyright & License

Copyright (C) 2016 MAISIN&CO.

[Check here](./LICENSE).


