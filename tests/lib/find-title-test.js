/**
 * @fileoverview Unit test for browser/lib/findTitle
 */

const test = require('ava')
const { findNoteTitle } = require('browser/lib/findNoteTitle')

// Unit test
test('findNoteTitle#find  should return a correct title (string)', t => {
  // [input, expected]
  const testCases = [
    ['# hoge\nfuga', 'hoge'],
    ['# hoge_hoge_hoge', 'hoge_hoge_hoge'],
    ['```\n# hoge\n```\n# fuga', 'fuga'],
    ['```\n# hoge\n```', '```'],
    ['hoge', 'hoge']
  ]

  testCases.forEach(testCase => {
    const [input, expected] = testCase
    t.is(findNoteTitle(input), expected, `Test for find() input: ${input} expected: ${expected}`)
  })
})

