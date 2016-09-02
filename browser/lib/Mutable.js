class MutableMap {
  constructor (iterable) {
    this._map = new Map(iterable)
  }

  get (...args) {
    return this._map.get(...args)
  }

  set (...args) {
    return this._map.set(...args)
  }

  delete (...args) {
    return this._map.delete(...args)
  }

  has (...args) {
    return this._map.has(...args)
  }

  clear (...args) {
    return this._map.clear(...args)
  }

  forEach (...args) {
    return this._map.forEach(...args)
  }

  [Symbol.iterator] () {
    return this._map[Symbol.iterator]()
  }

  map (cb) {
    let result = []
    for (let [key, value] of this._map) {
      result.push(cb(value, key))
    }
    return result
  }
}

class MutableSet {
  constructor (iterable) {
    if (iterable instanceof MutableSet) {
      this._set = new Set(iterable._set)
    } else {
      this._set = new Set(iterable)
    }
  }

  add (...args) {
    return this._set.add(...args)
  }

  delete (...args) {
    return this._set.delete(...args)
  }

  forEach (...args) {
    return this._set.forEach(...args)
  }

  [Symbol.iterator] () {
    return this._set[Symbol.iterator]()
  }

  map (cb) {
    let result = []
    this._set.forEach(function (value, key) {
      result.push(cb(value, key))
    })

    return result
  }

  toJS () {
    return Array.from(this._set)
  }
}

const Mutable = {
  Map: MutableMap,
  Set: MutableSet
}

module.exports = Mutable
