import test from 'ava'
import {Application} from 'spectron'
import path from 'path'

let app = null

const modalOpenButton = '.TopBar__control-newPostButton___browser-main-TopBar-'
const modalCloseButton = '.ModalEscButton__esc-mark___browser-components-'
const noteCreateButton = '.NewNoteModal__control-button___browser-main-modals-'
const currentNoteItem = '.NoteItem__item--active___browser-components-'
const noteDetail = '.MarkdownNoteDetail__body___browser-main-Detail-'

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

test.serial('Measure BrowserWindow status with await', async t => {
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

test.serial('Modal can be opened and closed', async t => {
  await app.client.click(modalOpenButton)
  await app.client.click(modalCloseButton)
})

test.serial('Modal can be opened and a note can be created', async t => {
  await app.client.click(modalOpenButton)
  await app.client.click(noteCreateButton)
})

test.serial('NoteList can be clicked', async t => {
  await app.client.click(currentNoteItem)
})

test.serial('A sentence can be inputted', async t => {
  const input = 'this is a text'
  await app.client.click(noteDetail).webContents.insertText(input)
})
