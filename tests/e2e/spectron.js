import test from 'ava'
import {Application} from 'spectron'
import path from 'path'

let app = null

test.before(async t => {
  const boostnotePath = ((platform) => {
    switch (platform) {
      case 'darwin':
        return path.join('..', '..', 'dist', 'Boostnote-darwin-x64', 'Boostnote.app', 'Contents', 'MacOS', 'Boostnote')
      case 'linux':
        return path.join('..', '..', 'dist', 'Boostnote-linux-x64', 'Boostnote')
    }
  })(process.platform)
  app = new Application({
    path: boostnotePath
  })

  await app.start()
})

test.after.always(async t => {
  await app.stop()
})

test('Measure BrowserWindow status with await', async t => {
  await app.client.waitUntilWindowLoaded()

  const win = app.browserWindow
  t.is(await app.client.getWindowCount(), 1)
  t.false(await win.isMinimized())
  t.false(await win.isDevToolsOpened())
  t.true(await win.isVisible())
  t.true(await win.isFocused())

  const {width, height} = await win.getBounds()
  t.true(width > 0)
  t.true(height > 0)
})

test('Modal can be opened and closed', async t => {
  await app.client.click('.TopBar__control-newPostButton___browser-main-TopBar-')
  await app.client.click('.NewNoteModal__close-mark___browser-main-modals-')
})
