# Testing for Boostnote
There is e2e tests for Boostnote written in [ava](https://github.com/avajs/ava) and [spectron](https://github.com/electron/spectron).

## How to run
There is a command for e2e testing bellow:

```
$ yarn run test:e2e
```

The reason why I seperate aother test command is because of convenience of travisCI.

## On travisCI
I set e2e tests running on travisCI only master branch. If you're interested in it, please take a look at .travis.yml
