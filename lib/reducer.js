import { combineReducers } from 'redux'
import _ from 'lodash'
import { SWITCH_FOLDER, SWITCH_MODE, SWITCH_ARTICLE, SET_SEARCH_FILTER, SET_TAG_FILTER, USER_UPDATE, ARTICLE_UPDATE, ARTICLE_DESTROY, FOLDER_CREATE, FOLDER_DESTROY, IDLE_MODE, CREATE_MODE } from './actions'
import auth from 'boost/auth'
import keygen from 'boost/keygen'

let defaultContent = '**Boost**は全く新しいエンジニアライクのノートアプリです。\n\n# ◎特徴\nBoostはエンジニアの仕事を圧倒的に効率化するいくつかの機能を備えています。\nその一部をご紹介します。\n1. Folderで情報を分類\n2. 豊富なsyantaxに対応\n3. Finder機能\n4. チーム機能（リアルタイム搭載）\n\n＊　＊　＊　＊\n\n# 1. Folderで情報を分類、欲しい情報にすぐアクセス。\n左側のバーに存在する「Folders」。\n今すぐプラスボタンを押しましょう。\n分類の仕方も自由自在です。\n- 言語やフレームワークごとにFolderを作成\n- 自分用のカジュアルなメモをまとめる場としてFolderを作成\n\n\n# 2. 豊富なsyantaxに対応、自分の脳の代わりに。\nプログラミングに関する情報を全て、手軽に保存しましょう。\n- mdで、apiの仕様をまとめる\n- よく使うモジュールやスニペット\n\nBoostに保存しておくことで、何度も同じコードを書いたり調べたりする必要がなくなります。\n\n# 3. Finder機能を搭載、もうコマンドを手打ちする必要はありません。\n**「shift+cmd+tab」** を同時に押してみてください。\nここでは、一瞬でBoostの中身を検索するウィンドウを表示させることができます。\n\n矢印キーで選択、Enterを押し、cmd+vでペーストすると…続きはご自身の目でお確かめください。\n- sqlやlinux等の、よく使うが手打ちが面倒なコマンド\n- （メールやカスタマーサポート等でよく使うフレーズ）\n\n私たちは、圧倒的な効率性を支援します。\n\n# 4. チーム機能を搭載、シームレスな情報共有の場を実現。\n開発の設計思想やmdファイルの共有等、チームによって用途は様々ですが、Boostは多くの情報共有の課題について解決策を投げかけます。\n魅力を感じたら、左下のプラスボタンを今すぐクリック。\n\n\n＊　＊　＊　＊\n\n\n## ◎詳しくは\nこちらのブログ( http://blog-jp.b00st.io )にて随時更新しています。\n\nそれでは素晴らしいエンジニアライフを！\n\n## Hack your memory＊＊'

const initialStatus = {
  mode: IDLE_MODE,
  search: ''
}

function getInitialArticles () {
  let data = JSON.parse(localStorage.getItem('local'))
  if (data == null) {
    let defaultFolder = {
      name: 'default',
      key: keygen()
    }
    let defaultArticle = {
      title: 'Boostとは',
      tags: ['boost', 'intro'],
      content: defaultContent,
      mode: 'markdown',
      key: keygen(),
      FolderKey: defaultFolder.key
    }

    data = {
      articles: [defaultArticle],
      folders: [defaultFolder],
      version: require('remote').require('app').getVersion()
    }
    localStorage.setItem('local', JSON.stringify(data))
  }

  return data.articles
}

function currentUser (state, action) {
  switch (action.type) {
    case USER_UPDATE:
      let user = action.data.user

      return auth.user(user)
    default:
      if (state == null) return auth.user()
      return state
  }
}

function status (state, action) {
  switch (action.type) {
    case SWITCH_FOLDER:
      state.mode = IDLE_MODE
      state.search = `in:${action.data} `

      return state
    case SWITCH_MODE:
      state.mode = action.data
      if (state.mode === CREATE_MODE) state.articleKey = null

      return state
    case SWITCH_ARTICLE:
      state.articleKey = action.data
      state.mode = IDLE_MODE

      return state
    case SET_SEARCH_FILTER:
      state.search = action.data
      state.mode = IDLE_MODE

      return state
    case SET_TAG_FILTER:
      state.search = `#${action.data}`
      state.mode = IDLE_MODE

      return state
    default:
      if (state == null) return initialStatus
      return state
  }
}

function articles (state, action) {
  switch (action.type) {
    case ARTICLE_UPDATE:
      {
        console.log(action)
        let data = JSON.parse(localStorage.getItem('local'))
        let { articles } = data
        let article = action.data.article

        let targetIndex = _.findIndex(articles, _article => article.key === _article.key)
        if (targetIndex < 0) articles.unshift(article)
        else articles.splice(targetIndex, 1, article)

        localStorage.setItem('local', JSON.stringify(data))
        state.articles = articles
      }
      return state
    case ARTICLE_DESTROY:
      {
        let data = JSON.parse(localStorage.getItem('local'))
        let { articles } = data
        let articleKey = action.data.articleKey

        let targetIndex = _.findIndex(articles, _article => articleKey === _article.key)
        if (targetIndex >= 0) articles.splice(targetIndex, 1)

        state.articles = articles
        localStorage.setItem('local', JSON.stringify(data))
      }
      return state
    case FOLDER_CREATE:
      {
        let data = JSON.parse(localStorage.getItem('local'))
        let { folders } = data
        let newFolder = action.data.folder

        let conflictFolder = _.findWhere(folders, {name: newFolder.name})
        if (conflictFolder != null) throw new Error('name conflicted!')
        folders.push(newFolder)

        localStorage.setItem('local', JSON.stringify(data))
        state.folders = folders
      }
      return state
    case FOLDER_DESTROY:
      {
        let data = JSON.parse(localStorage.getItem('local'))
        let { folderKey } = action.data
        let articles = data.articles
        articles = articles.filter(article => article.FolderKey !== folderKey)
        let folders = data.folders
        folders = folders.filter(folder => folder.key !== folderKey)

        localStorage.setItem('local', JSON.stringify(data))
        state.folders = folders
        state.articles = articles
      }
      return state
    default:
      if (state == null) return getInitialArticles()
      return state
  }
}

export default combineReducers({
  currentUser,
  status,
  articles
})
