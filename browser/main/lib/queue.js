import Storage from 'browser/lib/Storage'
import _ from 'lodash'

let tasks = []

function _save (task, storageKey, note) {
  note = Object.assign({}, note)
  delete note._storage

  task.status = 'process'

  Storage
    .find(storageKey)
    .then((storage) => {
      return storage.updateNote(note.key, note)
    })
    .then((note) => {
      tasks.splice(tasks.indexOf(task), 1)
      console.info('Note saved', note)
    })
    .catch((err) => {
      tasks.splice(tasks.indexOf(task), 1)
      console.error('Failed to save note', note)
      console.error(err)
    })
}

const queueSaving = function (storageKey, note) {
  let key = `${storageKey}-${note.key}`

  let taskIndex = _.findIndex(tasks, {
    type: 'SAVE_NOTE',
    key: key,
    status: 'idle'
  })
  let task = tasks[taskIndex]
  if (taskIndex < 0) {
    task = {
      type: 'SAVE_NOTE',
      key: key,
      status: 'idle',
      timer: null
    }
  } else {
    tasks.splice(taskIndex, 1)
    window.clearTimeout(task.timer)
  }

  task.timer = window.setTimeout(() => {
    _save(task, storageKey, note)
  }, 1500)
  tasks.push(task)
}

export default {
  save: queueSaving
}
