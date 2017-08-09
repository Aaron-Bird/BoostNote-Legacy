export function getTodoState (content) {
  let splitted = content.split('\n')
  let numberOfTodo = 0
  let numberOfCompletedTodo = 0

  splitted.forEach((line) => {
    let trimmedLine = line.trim()
    if (trimmedLine.match(/^[\+\-\*] \[\s|x\] ./)) {
      numberOfTodo++
    }
    if (trimmedLine.match(/^[\+\-\*] \[x\] ./)) {
      numberOfCompletedTodo++
    }
  })

  return {
    total: numberOfTodo,
    completed: numberOfCompletedTodo
  }
}

export function getTodoPercentageOfCompleted (content) {
  const state = getTodoState(content)
  return Math.floor(state.completed / state.total * 100)
}
