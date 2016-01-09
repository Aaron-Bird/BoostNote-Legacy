import keygen from './keygen'
import _ from 'lodash'

const electron = require('electron')
const remote = electron.remote
const jetpack = require('fs-jetpack')
const path = require('path')

let defaultContent = 'Boost is a brand new note App for programmers.\n\n> 下に日本語版があります。\n\n# \u25CEfeature\n\nBoost has some preponderant functions for efficient engineer\'s task.See some part of it.\n\n1. classify information by\u300CFolders\u300D\n2. deal with great variety of syntax\n3. Finder function\n\n\uFF0A\u3000\uFF0A\u3000\uFF0A\u3000\uFF0A\n\n# 1. classify information by \u300CFolders\u300D- access the information you needed easily.\n\n\u300CFolders\u300D which on the left side bar. Press plus button now. flexible way of classification.\n- Create Folder every language or flamework\n- Make Folder for your own casual memos\n\n# 2. Deal with a great variety of syntax \u2013 instead of your brain\nSave handy all information related with programming\n- Use markdown and gather api specification\n- Well using module and snippet\n\nSave them on Boost, you don\'t need to rewrite or re-search same code again.\n\n# 3. Load Finder function \u2013 now you don\'t need to spell command by hand typing.\n\n**Shift +ctrl+tab** press buttons at same time.\nThen, the window will show up for search Boost contents that instant.\n\nUsing cursor key to chose, press enter, cmd+v to paste and\u2026 please check it out by your own eye.\n\n- Such command spl or linux which programmers often use but troublesome to hand type\n\n- (Phrases commonly used for e-mail or customer support)\n\nWe support preponderant efficiency\n\n\uFF0A\u3000\uFF0A\u3000\uFF0A\u3000\uFF0A\n\n## \u25CEfor more information\nFrequently updated with this blog ( http:\/\/blog-jp.b00st.io )\n\nHave wonderful programmer life!\n\n## Hack your memory**\n\n\n\n# 日本語版\n\n**Boost**は全く新しいエンジニアライクのノートアプリです。\n\n# ◎特徴\nBoostはエンジニアの仕事を圧倒的に効率化するいくつかの機能を備えています。\nその一部をご紹介します。\n1. Folderで情報を分類\n2. 豊富なsyantaxに対応\n3. Finder機能\n\n\n＊　＊　＊　＊\n\n# 1. Folderで情報を分類、欲しい情報にすぐアクセス。\n左側のバーに存在する「Folders」。\n今すぐプラスボタンを押しましょう。\n分類の仕方も自由自在です。\n- 言語やフレームワークごとにFolderを作成\n- 自分用のカジュアルなメモをまとめる場としてFolderを作成\n\n\n# 2. 豊富なsyntaxに対応、自分の脳の代わりに。\nプログラミングに関する情報を全て、手軽に保存しましょう。\n- mdで、apiの仕様をまとめる\n- よく使うモジュールやスニペット\n\nBoostに保存しておくことで、何度も同じコードを書いたり調べたりする必要がなくなります。\n\n# 3. Finder機能を搭載、もうコマンドを手打ちする必要はありません。\n**「shift+ctrl+tab」** を同時に押してみてください。\nここでは、一瞬でBoostの中身を検索するウィンドウを表示させることができます。\n\n矢印キーで選択、Enterを押し、cmd+vでペーストすると…続きはご自身の目でお確かめください。\n- sqlやlinux等の、よく使うが手打ちが面倒なコマンド\n- （メールやカスタマーサポート等でよく使うフレーズ）\n\n私たちは、圧倒的な効率性を支援します。\n\＊　＊　＊　＊\n\n\n## ◎詳しくは\nこちらのブログ( http://blog-jp.b00st.io )にて随時更新しています。\n\nそれでは素晴らしいエンジニアライフを！\n\n## Hack your memory＊＊'

let data = null

function getLocalPath () {
  return path.join(remote.app.getPath('userData'), 'local.json')
}

function forgeInitialRepositories () {
  let defaultRepo = {
    key: keygen(),
    name: 'local',
    type: 'userData',
    user: {
      name: 'New user'
    }
  }

  if (process.platform === 'darwin') {
    defaultRepo.user.name = remote.process.env.USER
  } else if (process.platform === 'win32') {
    defaultRepo.user.name = remote.process.env.USERNAME
  }

  return [defaultRepo]
}

function getRepositories () {
  let raw = localStorage.getItem('repositories')
  try {
    let parsed = JSON.parse(raw)
    if (!_.isArray(parsed)) {
      throw new Error('repositories data is corrupted. re-init data.')
    }
    return parsed
  } catch (e) {
    console.log(e)
    let newRepos = forgeInitialRepositories()
    saveRepositories(newRepos)
    return newRepos
  }
}

function saveRepositories (repos) {
  localStorage.setItem('repositories', JSON.stringify(repos))
}

export function getUser (repoName) {
  if (repoName == null) {
    return getRepositories()[0]
  }
  return null
}

export function saveUser (repoName, user) {
  let repos = getRepositories()
  if (repoName == null) {
    Object.assign(repos[0].user, user)
  }
  saveRepositories(repos)
}

export function init () {
  // set repositories info
  getRepositories()
  data = jetpack.read(getLocalPath(), 'json')
  if (data == null) {
    let defaultFolder = {
      name: 'default',
      key: keygen()
    }
    let defaultArticle = {
      title: 'About Boost',
      tags: ['boost', 'intro'],
      content: defaultContent,
      mode: 'markdown',
      key: keygen(),
      FolderKey: defaultFolder.key,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    data = {
      articles: [defaultArticle],
      folders: [defaultFolder],
      version: '0.4'
    }
    saveData()
  }
}

export function getData (forceRead) {
  if (forceRead) {
    try {
      data = jetpack.read(getLocalPath(), 'json')
    } catch (e) {}
  }
  return data
}

let timer = null
let isSaving = false
let saveAgain = false
function saveData () {
  timer = null
  isSaving = true
  jetpack.writeAsync(getLocalPath(), data)
    .then(function () {
      isSaving = false
      if (saveAgain) {
        saveAgain = false
        queueSave()
      }
    })
}
function queueSave () {
  if (!isSaving) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(saveData, 500)
  } else {
    saveAgain = true
  }
}

export function setArticles (articles) {
  if (!_.isArray(articles)) throw new Error('Articles must be an array')
  let data = getData()
  data.articles = articles
  queueSave()
}

export function setFolders (folders) {
  if (!_.isArray(folders)) throw new Error('Folders must be an array')
  let data = getData()
  data.folders = folders
  queueSave()
}

export default {
  getUser,
  saveUser,
  init,
  getData,
  setArticles,
  setFolders
}
