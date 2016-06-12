let callees = []

function bind (name, el) {
  callees.push({
    name: name,
    element: el
  })
}

function release (el) {
  callees = callees.filter((callee) => callee.element !== el)
}

function fire (command) {
  console.info('COMMAND >>', command)
  let splitted = command.split(':')
  let target = splitted[0]
  let targetCommand = splitted[1]
  let targetCallees = callees
    .filter((callee) => callee.name === target)

  targetCallees.forEach((callee) => {
    callee.element.fire(targetCommand)
  })
}

export default {
  bind,
  release,
  fire
}
