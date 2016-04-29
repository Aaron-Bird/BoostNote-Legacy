# Boostnote

Simple note app

## Progress Kanban

https://trello.com/b/wJlinZJx/boostnote-todo-list

This is a public Kanban board. Also everyone can comment here.

If you want to join us, ask me to add you.

## System requirement

This app is built on Electron.

You can check it from [here](https://github.com/electron/electron/blob/master/docs/tutorial/supported-platforms.md).

Currently, I'm testing this app on Windows 10(64bit), OS X El Capitan, Ubuntu Linux, Arch Linux.

## About note storage

Currently, Boostnote stores data to a single json file.

You can find it from the path below.

OS X
```
/Users/$USER_NAME$/Library/Application Support/boost/local.json
```

Windows
```
C:\Users\$USER_NAME$\AppData\Roaming\boost\local.json
```

On v0.6.0, You will be able to select any folder in your file system.

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

> '3. Codesign' and '4. Create' installer are needed to deploy this app.
> You can skip these steps.

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

3. Codesign (OSX only)

codesign with Certification.

```
grunt codesign
```

> `OSX_COMMON_NAME` must be defined inside `/secret/auth_code.json`.

> codesigning on windows is included to creating installer.

4. Create installer

create installer, `Boostnote.dmg`(OSX) / `Setup.exe`(Windows).

```
grunt create-windows-installer
```

> #### Windows only
> `WIN_CERT_PASSWORD` must be defined inside `/secret/auth_code.json`.
> `/secret/authenticode_cer.p12` is required also.

5. Zip (OSX only)

zip `Boostnote.app` file.

```
grunt zip:osx
```

> Stuff(Setup.exe, .nupkg) of Windows are not needed to be zipped.

## Using stack

- Electron
- React
- Webpack
... check [`package.json`](./package.json)


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


