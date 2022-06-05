/* eslint-disable */
'use strict'

function _typeof(obj) {
  '@babel/helpers - typeof'
  return (
    (_typeof =
      typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
        ? function(obj) {
            return typeof obj
          }
        : function(obj) {
            return obj &&
              typeof Symbol === 'function' &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? 'symbol'
              : typeof obj
          }),
    _typeof(obj)
  )
}

Object.defineProperty(exports, '__esModule', {
  value: true
})

var React = require('react')

function _interopDefaultLegacy(e) {
  return e && _typeof(e) === 'object' && 'default' in e
    ? e
    : {
        default: e
      }
}

var React__default = /* #__PURE__ */ _interopDefaultLegacy(React)

function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }

      return target
    }

  return _extends.apply(this, arguments)
}
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
  var t = {}

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p]
  }

  if (s != null && typeof Object.getOwnPropertySymbols === 'function')
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (
        e.indexOf(p[i]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(s, p[i])
      )
        t[p[i]] = s[p[i]]
    }
  return t
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i)
        ar[i] = from[i]
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from))
}

function handleDragStart(e, props) {
  var treeDispatch = props.treeDispatch,
    node = props.node,
    parent = props.parent,
    index = props.index,
    updateComponent = props.updateComponent,
    parentUpdateComponent = props.parentUpdateComponent
  e.stopPropagation()
  treeDispatch({
    type: 'dragged',
    payload: {
      node: node,
      parent: parent,
      index: index,
      updateComponent: updateComponent,
      parentUpdateComponent: parentUpdateComponent
    }
  })
}

function handleDragEnd(e, props) {
  e.stopPropagation()
  e.preventDefault()
  var treeDispatch = props.treeDispatch
  treeDispatch({
    type: 'dragged',
    payload: null
  })
}

function createRootNode(nodeList) {
  var root = {
    root: true,
    children: nodeList
  }
  return root
}

function moveNodePosition(
  fromNode,
  fromParent,
  fromIndex,
  toNode,
  toParent,
  toIndex
) {
  if (fromIndex == undefined || toIndex == undefined)
    throw new Error('Wrong params')
  var fromParentChildren = fromParent.children || []
  var toParentChildren = toParent.children || []
  toParentChildren.splice(toIndex, 0, fromNode)
  if (fromParent === toParent && fromIndex > toIndex) fromIndex += 1
  fromParentChildren.splice(fromIndex, 1)
}

function insertBefore(dragged, target) {
  var fromNode = dragged.node,
    fromParent = dragged.parent,
    fromIndex = dragged.index
  var node = target.node,
    parent = target.parent,
    index = target.index
  moveNodePosition(fromNode, fromParent, fromIndex, node, parent, index)
}

function insertAfter(dragged, target) {
  var fromNode = dragged.node,
    fromParent = dragged.parent,
    fromIndex = dragged.index
  target.node
  var parent = target.parent,
    index = target.index
  var toNodeNextIndex = index + 1
  var toNodeNext = parent.children[toNodeNextIndex]

  if (toNodeNextIndex >= parent.children.length) {
    moveNodePosition(
      fromNode,
      fromParent,
      fromIndex,
      parent,
      parent,
      parent.children.length
    )
  } else {
    moveNodePosition(
      fromNode,
      fromParent,
      fromIndex,
      toNodeNext,
      parent,
      toNodeNextIndex
    )
  }
}

function appendChild(dragged, target) {
  var fromNode = dragged.node,
    fromParent = dragged.parent,
    fromIndex = dragged.index
  var node = target.node
  moveNodePosition(fromNode, fromParent, fromIndex, node, node, 0)
}

function isChildNode(parentNode, childNode) {
  var list = __spreadArray([], parentNode.children || [], true)

  while (list.length) {
    var node = list.shift()

    if (node === childNode) {
      return true
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(function(i) {
        return list.push(i)
      })
    }
  }

  return false
}

function canMoveNode(fromNode, toNode) {
  return fromNode && fromNode !== toNode && !isChildNode(fromNode, toNode)
}

var OptionContext = /* #__PURE__ */ React__default['default'].createContext({
  expandAll: false,
  sortable: false
})
var TreeNode = /* #__PURE__ */ React__default['default'].memo(function(props) {
  var parentUpdateComponent = props.parentUpdateComponent
  var expandAll = React.useContext(OptionContext).expandAll

  var _a = React.useState({}),
    update = _a[0],
    setUpdate = _a[1]

  var updateComponent = React.useCallback(function() {
    return setUpdate({})
  }, [])
  var NodeRenderer = props.NodeRenderer,
    nodeList = props.nodeList,
    treeState = props.treeState,
    treeDispatch = props.treeDispatch,
    onChange = props.onChange,
    level = props.level,
    parent = props.parent,
    node = props.node,
    index = props.index
  return /* #__PURE__ */ React__default['default'].createElement(
    React__default['default'].Fragment,
    null,
    NodeRenderer({
      NodeRenderer: NodeRenderer,
      node: node,
      index: index,
      level: level,
      nodeList: nodeList,
      parent: parent,
      treeState: treeState,
      treeDispatch: treeDispatch,
      onChange: onChange,
      update: update,
      updateComponent: updateComponent,
      parentUpdateComponent: parentUpdateComponent
    }),
    (expandAll || node.expanded) &&
      Array.isArray(node.children) &&
      /* #__PURE__ */ React__default['default'].createElement(
        TreeNodeChildren,
        {
          treeState: treeState,
          treeDispatch: treeDispatch,
          onChange: onChange,
          NodeRenderer: NodeRenderer,
          nodeList: nodeList,
          children: node.children,
          parent: node,
          level: level + 1,
          parentUpdate: update,
          parentUpdateComponent: updateComponent
        }
      )
  )
})

var TreeNodeChildren = function TreeNodeChildren(props) {
  var children = props.children,
    parent = props.parent,
    NodeRenderer = props.NodeRenderer,
    level = props.level,
    nodeList = props.nodeList,
    treeDispatch = props.treeDispatch,
    onChange = props.onChange,
    treeState = props.treeState,
    parentUpdateComponent = props.parentUpdateComponent
  return /* #__PURE__ */ React__default['default'].createElement(
    React__default['default'].Fragment,
    null,
    children.map(function(node, index) {
      if (!node.children) node.children = []
      if (!Array.isArray(node.children))
        throw new Error('Children must be an Array')
      return /* #__PURE__ */ React__default['default'].createElement(TreeNode, {
        key: node.key,
        node: node,
        index: index,
        NodeRenderer: NodeRenderer,
        level: level,
        nodeList: nodeList,
        treeDispatch: treeDispatch,
        parent: parent,
        onChange: onChange,
        treeState: treeState,
        parentUpdateComponent: parentUpdateComponent
      })
    })
  )
}

var classnames = {
  exports: {}
}
/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/

;(function(module) {
  /* global define */
  ;(function() {
    var hasOwn = {}.hasOwnProperty

    function classNames() {
      var classes = []

      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i]
        if (!arg) continue

        var argType = _typeof(arg)

        if (argType === 'string' || argType === 'number') {
          classes.push(arg)
        } else if (Array.isArray(arg)) {
          if (arg.length) {
            var inner = classNames.apply(null, arg)

            if (inner) {
              classes.push(inner)
            }
          }
        } else if (argType === 'object') {
          if (arg.toString === Object.prototype.toString) {
            for (var key in arg) {
              if (hasOwn.call(arg, key) && arg[key]) {
                classes.push(key)
              }
            }
          } else {
            classes.push(arg.toString())
          }
        }
      }

      return classes.join(' ')
    }

    if (module.exports) {
      classNames['default'] = classNames
      module.exports = classNames
    } else {
      window.classNames = classNames
    }
  })()
})(classnames)

var classNames = classnames.exports

var Tree = function Tree(props) {
  var nodeList = props.nodeList,
    NodeRenderer = props.NodeRenderer,
    onChange = props.onChange,
    containerProps = props.containerProps
  var rootNode = React.useMemo(
    function() {
      return createRootNode(nodeList)
    },
    [nodeList]
  )

  var _a = React.useState(false),
    dragging = _a[0],
    setDragging = _a[1]

  var _b = React.useReducer(
      function(state, action) {
        switch (action.type) {
          case 'dragged':
            if (action.payload) {
              state.dragged = action.payload
              setDragging(true)
            } else {
              state.dragged = null
              setDragging(false)
            }

            return state

          default:
            throw new Error('Unknown dispatch type: ' + action.type)
        }
      },
      {
        dragged: null
      }
    ),
    treeState = _b[0],
    treeDispatch = _b[1]

  var _c = React.useState({}),
    update = _c[0],
    setUpdate = _c[1]

  var updateComponent = React.useCallback(function() {
    return setUpdate({})
  }, [])
  return /* #__PURE__ */ React__default['default'].createElement(
    'div',
    _extends(
      {
        className: classNames(['react-sortable-tree-list'], {
          dragging: dragging
        })
      },
      containerProps
    ),
    /* #__PURE__ */ React__default['default'].createElement(TreeNodeChildren, {
      children: rootNode.children,
      NodeRenderer: NodeRenderer,
      level: 0,
      nodeList: nodeList,
      treeDispatch: treeDispatch,
      parent: rootNode,
      onChange: onChange,
      treeState: treeState,
      parentUpdate: update,
      parentUpdateComponent: updateComponent
    })
  )
}

function styleInject(css, ref) {
  if (ref === void 0) ref = {}
  var insertAt = ref.insertAt

  if (!css || typeof document === 'undefined') {
    return
  }

  var head = document.head || document.getElementsByTagName('head')[0]
  var style = document.createElement('style')
  style.type = 'text/css'

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild)
    } else {
      head.appendChild(style)
    }
  } else {
    head.appendChild(style)
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
}

var css_248z$1 =
  '.TreeNodeLine_tree-node_content__PbiUE{position:relative}.TreeNodeLine_tree-node_content__PbiUE.TreeNodeLine_tree-node--active__qF7C-{background:rgba(0,0,0,.1)}.TreeNodeLine_tree-node_content__PbiUE.TreeNodeLine_tree-node_prev--active__c5fjR:before{border-top:4px solid #03a9f4;content:"";display:block;pointer-events:none;position:absolute;top:-2px;width:100%;z-index:1}.TreeNodeLine_tree-node_content__PbiUE.TreeNodeLine_tree-node_next--active__TYYEN:after{border-top:4px solid #03a9f4;bottom:-2px;content:"";display:block;pointer-events:none;position:absolute;width:100%;z-index:1}.react-sortable-tree-list.dragging .TreeNodeLine_tree-node__LYZDJ>div{pointer-events:none}'
var styles$1 = {
  'tree-node_content': 'TreeNodeLine_tree-node_content__PbiUE',
  'tree-node--active': 'TreeNodeLine_tree-node--active__qF7C-',
  'tree-node_prev--active': 'TreeNodeLine_tree-node_prev--active__c5fjR',
  'tree-node_next--active': 'TreeNodeLine_tree-node_next--active__TYYEN',
  'tree-node': 'TreeNodeLine_tree-node__LYZDJ'
}
styleInject(css_248z$1)
var defaultOption = {
  indent: 20
}

var TreeNodeLine = function TreeNodeLine(TreeNodeRender, option) {
  if (option === void 0) {
    option = {}
  }

  option = Object.assign({}, defaultOption, option)
  return function(props) {
    var _a

    var level = props.level

    var _b = React.useState(null),
      active = _b[0],
      setActive = _b[1]

    var sortable = React.useContext(OptionContext).sortable
    return /* #__PURE__ */ React__default['default'].createElement(
      'div',
      {
        draggable: sortable ? 'true' : 'false',
        className: classNames([styles$1['tree-node']]),
        onDragStart: function onDragStart(e) {
          return handleDragStart(e, props)
        },
        onDragEnter: function onDragEnter(e) {
          return handleDragEnter(e)
        },
        onDragLeave: function onDragLeave(e) {
          return handleDragLeave(e, props, setActive)
        },
        onDragOver: function onDragOver(e) {
          return handleDragOver(e, props, setActive)
        },
        onDrop: function onDrop(e) {
          return handleDrop(e, props, setActive)
        },
        onDragEnd: function onDragEnd(e) {
          return handleDragEnd(e, props)
        }
      },
      /* #__PURE__ */ React__default['default'].createElement(
        'div',
        {
          className: classNames([
            styles$1['tree-node_content'],
            ((_a = {}),
            (_a[styles$1['tree-node_next--active']] = active === 'active-next'),
            (_a[styles$1['tree-node_prev--active']] = active === 'active-prev'),
            (_a[styles$1['tree-node--active']] = active === 'active'),
            _a)
          ]),
          style: {
            marginLeft: level * option.indent
          }
        },
        TreeNodeRender(props)
      )
    )
  }
}

var EDGE_HEIGHT = 10

function handleDragEnter(e, props, setState) {
  e.stopPropagation()
  e.preventDefault()
}

function handleDragLeave(e, props, setActive) {
  e.stopPropagation()
  e.preventDefault()
  setActive(null)
}

var handleDragOver = function handleDragOver(e, props, setActive) {
  var _a

  e.stopPropagation()
  e.preventDefault()
  var treeState = props.treeState,
    node = props.node
  if (!treeState.dragged || !node) return
  if (
    ((_a = treeState.dragged) === null || _a === void 0 ? void 0 : _a.node) ===
    node
  )
    return
  var fromNode =
    treeState === null || treeState === void 0 ? void 0 : treeState.dragged.node

  if (canMoveNode(fromNode, node)) {
    var el = e.currentTarget
    var rect = el.getBoundingClientRect()
    var mouseY = e.clientY - rect.top

    if (mouseY < EDGE_HEIGHT) {
      setActive('active-prev')
    } else if (rect.height - mouseY < EDGE_HEIGHT) {
      setActive('active-next')
    } else {
      setActive('active')
    }
  }
}

function handleDrop(e, props, setActive) {
  e.stopPropagation()
  e.preventDefault()
  setActive(null)
  var node = props.node,
    treeState = props.treeState,
    onChange = props.onChange,
    nodeList = props.nodeList,
    treeDispatch = props.treeDispatch,
    parent = props.parent,
    index = props.index,
    toUpdateComponent = props.updateComponent,
    toParentUpdateComponent = props.parentUpdateComponent
  var _a = treeState.dragged,
    fromNode = _a.node,
    fromParent = _a.parent,
    fromIndex = _a.index
  _a.el
  _a.updateComponent
  var fromParentUpdateComponent = _a.parentUpdateComponent
  treeDispatch({
    type: 'dragged',
    payload: null
  })

  if (canMoveNode(fromNode, node)) {
    var el = e.currentTarget
    var rect = el.getBoundingClientRect()
    var mouseY = e.clientY - rect.top

    if (mouseY < EDGE_HEIGHT) {
      moveNodePosition(fromNode, fromParent, fromIndex, node, parent, index)

      if (fromParent !== parent) {
        toParentUpdateComponent()
      }
    } else if (rect.height - mouseY < EDGE_HEIGHT) {
      var toNodeNextIndex = index + 1
      var toNodeNext = parent.children[toNodeNextIndex]

      if (toNodeNextIndex >= parent.children.length) {
        moveNodePosition(
          fromNode,
          fromParent,
          fromIndex,
          parent,
          parent,
          parent.children.length
        )
      } else {
        moveNodePosition(
          fromNode,
          fromParent,
          fromIndex,
          toNodeNext,
          parent,
          toNodeNextIndex
        )
      }

      if (fromParent !== parent) {
        toParentUpdateComponent()
      }
    } else {
      moveNodePosition(fromNode, fromParent, fromIndex, node, node, 0)
      toUpdateComponent()
    }

    fromParentUpdateComponent()
    onChange(nodeList)
  }
}

var css_248z =
  '.TreeNodeExpand_tree-node_content__2sOQx{position:relative;transition:.2s ease}.TreeNodeExpand_tree-node_content__2sOQx.TreeNodeExpand_active__T2Kse{background:hsla(0,49%,78%,.1)}.TreeNodeExpand_tree-node_prev__4QB2c{background-clip:content-box;height:0;margin-bottom:-8px;padding-bottom:8px;position:relative;transition:.2s ease;z-index:1}.TreeNodeExpand_tree-node_prev__4QB2c.TreeNodeExpand_active__T2Kse{background-color:rgba(0,0,0,.1);height:30px}.TreeNodeExpand_tree-node_next__ky-Y1{background-clip:content-box;height:0;margin-top:-8px;padding-top:8px;position:relative;transition:.2s ease;z-index:1}.TreeNodeExpand_tree-node_next__ky-Y1.TreeNodeExpand_active__T2Kse{background-color:rgba(0,0,0,.1);height:30px}'
var styles = {
  'tree-node_content': 'TreeNodeExpand_tree-node_content__2sOQx',
  active: 'TreeNodeExpand_active__T2Kse',
  'tree-node_prev': 'TreeNodeExpand_tree-node_prev__4QB2c',
  'tree-node_next': 'TreeNodeExpand_tree-node_next__ky-Y1'
}
styleInject(css_248z)

var TreeNodeExpand = function TreeNodeExpand(TreeNodeRender) {
  return function(props) {
    var _a

    var level = props.level,
      treeState = props.treeState,
      node = props.node,
      treeDispatch = props.treeDispatch,
      index = props.index,
      parent = props.parent,
      parentUpdateComponent = props.parentUpdateComponent,
      updateComponent = props.updateComponent

    var _b = React.useState(false),
      active = _b[0],
      setActive = _b[1]

    var ref = React.useRef()
    return /* #__PURE__ */ React__default['default'].createElement(
      'div',
      {
        ref: ref
      },
      active &&
        /* #__PURE__ */ React__default['default'].createElement('div', {
          className: styles['tree-node_prev'],
          style: {
            marginLeft: level * 20 + 'px'
          },
          onDragEnter: function onDragEnter(e) {
            e.preventDefault()
            e.stopPropagation()
            setActive(true)
            e.currentTarget.classList.add(styles['active'])
          },
          onDragLeave: function onDragLeave(e) {
            e.preventDefault()
            e.stopPropagation()
            e.currentTarget.classList.remove(styles['active'])

            if (
              !e.relatedTarget ||
              !ref.current ||
              !ref.current.contains(e.relatedTarget)
            ) {
              setActive(null)
            }
          },
          onDragOver: function onDragOver(e) {
            e.preventDefault()
            e.stopPropagation()
          },
          onDrop: function onDrop(e) {
            e.preventDefault()
            e.stopPropagation()
            var dragged = treeState.dragged

            if (dragged && canMoveNode(dragged.node, node)) {
              insertBefore(dragged, {
                node: node,
                index: index,
                parent: parent
              })
              treeState.dragged.parentUpdateComponent()
              parentUpdateComponent()
            }

            e.currentTarget.classList.remove(styles['active'])
            setActive(false)
            treeDispatch({
              type: 'dragged',
              payload: null
            })
          }
        }),
      /* #__PURE__ */ React__default['default'].createElement(
        'div',
        {
          draggable: 'true',
          className: classNames(
            styles['tree-node_content'],
            ((_a = {}), (_a[styles['active']] = active), _a)
          ),
          style: {
            marginLeft: level * 20 + 'px'
          },
          onDragStart: function onDragStart(e) {
            return handleDragStart(e, props)
          },
          onDragEnter: function onDragEnter(e) {
            e.preventDefault()
            e.stopPropagation()
            setActive(true)
            e.currentTarget.classList.add(styles['active'])
          },
          onDragLeave: function onDragLeave(e) {
            e.preventDefault()
            e.stopPropagation()
            e.currentTarget.classList.remove(styles['active'])

            if (
              !e.relatedTarget ||
              !ref.current ||
              !ref.current.contains(e.relatedTarget)
            ) {
              setActive(null)
            }
          },
          onDragOver: function onDragOver(e) {
            e.preventDefault()
            e.stopPropagation()
          },
          onDrop: function onDrop(e) {
            e.stopPropagation()
            e.preventDefault()
            var dragged = treeState.dragged

            if (dragged && canMoveNode(dragged.node, node)) {
              appendChild(dragged, {
                node: node,
                index: index,
                parent: parent
              })
              node.expanded = true
              treeState.dragged.parentUpdateComponent()
              updateComponent()
            }

            e.currentTarget.classList.remove(styles['active'])
            setActive(false)
            treeDispatch({
              type: 'dragged',
              payload: null
            })
          },
          onDragEnd: function onDragEnd(e) {
            return handleDragEnd(e, props)
          }
        },
        TreeNodeRender(props)
      ),
      active &&
        /* #__PURE__ */ React__default['default'].createElement('div', {
          className: styles['tree-node_next'],
          style: {
            marginLeft: level * 20 + 'px'
          },
          onDragEnter: function onDragEnter(e) {
            e.preventDefault()
            e.stopPropagation()
            setActive(true)
            e.currentTarget.classList.add(styles['active'])
          },
          onDragLeave: function onDragLeave(e) {
            e.preventDefault()
            e.stopPropagation()
            e.currentTarget.classList.remove(styles['active'])

            if (
              !e.relatedTarget ||
              !ref.current ||
              !ref.current.contains(e.relatedTarget)
            ) {
              setActive(null)
            }
          },
          onDragOver: function onDragOver(e) {
            e.preventDefault()
            e.stopPropagation()
          },
          onDrop: function onDrop(e) {
            e.preventDefault()
            e.stopPropagation()
            var dragged = treeState.dragged

            if (dragged && canMoveNode(dragged.node, node)) {
              insertAfter(dragged, {
                node: node,
                index: index,
                parent: parent
              })
              treeState.dragged.parentUpdateComponent()
              parentUpdateComponent()
            }

            e.currentTarget.classList.remove(styles['active'])
            setActive(false)
            treeDispatch({
              type: 'dragged',
              payload: null
            })
          }
        })
    )
  }
}

function SortableTree(props) {
  var nodeList = props.nodeList,
    NodeRenderer = props.children,
    onChange = props.onChange,
    expandAll = props.expandAll,
    sortable = props.sortable,
    containerProps = __rest(props, [
      'nodeList',
      'children',
      'onChange',
      'expandAll',
      'sortable'
    ])

  if (!Array.isArray(nodeList)) throw new Error('nodeList must be an Array')
  if (!nodeList.length)
    return /* #__PURE__ */ React__default['default'].createElement(
      'div',
      _extends(
        {
          className: 'sortable-tree'
        },
        containerProps
      )
    )
  if (typeof NodeRenderer !== 'function')
    React.useCallback(
      (NodeRenderer = function NodeRenderer(_a) {
        _a.node
        return /* #__PURE__ */ React__default['default'].createElement(
          'div',
          null
        )
      }),
      []
    )
  if (!onChange) onChange = React.useCallback(function() {}, [])
  if (typeof expandAll !== 'boolean') expandAll = false
  if (typeof sortable !== 'boolean') sortable = true
  return /* #__PURE__ */ React__default['default'].createElement(
    OptionContext.Provider,
    {
      value: {
        expandAll: expandAll,
        sortable: sortable
      }
    },
    /* #__PURE__ */ React__default['default'].createElement(Tree, {
      nodeList: nodeList,
      NodeRenderer: NodeRenderer,
      onChange: onChange,
      containerProps: containerProps
    })
  )
}

exports.SortableTree = SortableTree
exports.TreeNodeExpand = TreeNodeExpand
exports.TreeNodeLine = TreeNodeLine
exports['default'] = SortableTree
// # sourceMappingURL=index.js.map
