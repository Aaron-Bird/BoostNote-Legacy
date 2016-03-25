# Boostnote

Simple note app

## Progress Kanban

https://trello.com/b/wJlinZJx/boostnote-todo-list

This is a public Kanban board. Also everyone can comment here.

If you want to join us, ask me to add you.

## Live coding

I've been broadcasting my work. You can check it from the below links. :smile:

- [Live Stream](https://www.livecoding.tv/rokt33r/videos/)
- [Recorded Videos](https://www.livecoding.tv/rokt33r/videos/)

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

## Copyright & License

Copyright (C) 2016 MAISIN&CO.

[Check here](./LICENSE).


