import Repository from 'browser/lib/Repository'
import _ from 'lodash'

let tasks = []

function _save (task, repoKey, note) {
  delete note._repository

  task.status = 'process'

  Repository
    .find(repoKey)
    .then((repo) => {
      return repo.updateNote(note.key, note)
    })
    .then((note) => {
      tasks.splice(tasks.indexOf(task), 1)
      console.log(tasks)
      console.info('Note saved', note)
    })
    .catch((err) => {
      tasks.splice(tasks.indexOf(task), 1)
      console.error('Failed to save note', note)
      console.error(err)
    })
}

const queueSaving = function (repoKey, note) {
  let key = `${repoKey}-${note.key}`

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
    _save(task, repoKey, note)
  }, 1500)
  tasks.push(task)
}

export default {
  save: queueSaving
}
