# Тестирование для Boostnote
## Тестирование e2e
Существуют тесты e2e для Boostnote, написанные на [ava](https://github.com/avajs/ava) и [spectron](https://github.com/electron/spectron).

### Как запустить
Для тестирование e2e существует команда:

```
$ yarn run test:e2e
```

Причина, по которой я использую другую команду тестирования - это удобство travisCI.

### TravisCI
Я установил тесты e2e, запущенные на travisCI, только в ветке master. Если вас это интересует, ознакомьтесь с файлом .travis.yml
