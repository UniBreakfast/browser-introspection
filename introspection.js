const introspection = new class introspection { }
const introspectionKeys = ['introspectionHubCore', 'introspectRightNow']

const premadeGloballyAvailableValueNames = getGloballyAvailableValueNames()
const windowDescriptor = {
  value: window,
  foundIn: [{
    inProp: 'window',
    ofObj: window,
    visitedAs: 'window',
  }],
  primitive: false,
}
const nameRegistry = new Map
const valueRegistry = new Map([[window, windowDescriptor]])

let consoleWinPropNames = []

windowDescriptor.foundIn[0].withDescriptor = windowDescriptor
// introspect()

console.log(
  `run ${introspectionKeys[1]}() to introspect or see ${introspectionKeys[0]} for results`
)

window[introspectionKeys[0]] = introspection
window[introspectionKeys[1]] = introspect

async function introspect() {
  const enumWinPropNames = getEnumWinPropNames()
  const nonEnumWinPropNames = getNonEnumWinPropNames()
  const winPropNames = getWinPropNames()
  const inheritedWinPropNames = getInheritedWinPropNames()
  const globallyAvailableValueNames = getGloballyAvailableValueNames()
  const consoleWinPropNames = getConsoleOnlyWinPropNames()
  const constructorWinPropNames = getConstructorWinPropNames()
  const allVisitedValues = await registerAllValues()
  const allVisitedNames = registerAllNames()

  const functions = {
    getEnumWinPropNames,
    getNonEnumWinPropNames,
    getWinPropNames,
    getInheritedWinPropNames,
    getGloballyAvailableValueNames,
    getConsoleOnlyWinPropNames,
    getConstructorWinPropNames,
    getAllValues: registerAllValues,
    subtract,
    isCapital, isUpperCase,
    isPrimitive,
  }

  Object.assign(introspection, {
    enumWinPropNames,
    nonEnumWinPropNames,
    winPropNames,
    inheritedWinPropNames,
    globallyAvailableValueNames,
    consoleWinPropNames,
    constructorWinPropNames,
    allVisitedValues,
    allVisitedNames,
    functions,
  })

  console.log(introspection)
}

function registerAllNames() {
  for (const [value, descriptor] of valueRegistry) {
    const { foundIn } = descriptor

    for (const { inProp } of foundIn) {
      const valuePlace = { value, foundIn }
      const valuesPlaces = nameRegistry.get(inProp)

      if (!valuesPlaces) {
        nameRegistry.set(inProp, [valuePlace])
      } else if (!valuesPlaces.some(vp => vp.value === value && vp.foundIn === foundIn)) {
        valuesPlaces.push(valuePlace)
      }
    }
  }

  return nameRegistry
}

async function registerAllValues(obj = window, name = 'window') {
  const keys = obj == window
    ? getWinPropNames()
    : Object.getOwnPropertyNames(obj)

  for (const key of keys) {
    let value

    try { value = await obj[key] } catch (err) { value = err }

    const descriptor = valueRegistry.get(value)

    if (!descriptor) {
      const primitive = isPrimitive(value)

      const place = {
        inProp: key,
        ofObj: obj,
        visitedAs: name,
        withDescriptor: valueRegistry.get(obj),
      }

      const descriptor = {
        value,
        foundIn: [place],
        primitive,
      }

      valueRegistry.set(value, descriptor)

      if (!primitive) registerAllValues(value, key)
    }
    else {
      const known = descriptor.foundIn.some(({ inProp, ofObj }) => inProp == key && ofObj == obj)

      if (!known) {
        const place = {
          inProp: key,
          ofObj: obj,
          visitedAs: name,
          withDescriptor: valueRegistry.get(obj),
        }

        descriptor.foundIn.push(place)
      }
    }
  }

  return valueRegistry
}

function isNotIntrospectionKey(key) {
  return !introspectionKeys.includes(key)
}

function getEnumWinPropNames() {
  return Object.keys(window)
    .filter(isNotIntrospectionKey)
}

function getNonEnumWinPropNames() {
  return Object.entries(Object.getOwnPropertyDescriptors(window))
    .filter(([, { enumerable }]) => !enumerable)
    .map(([name]) => name)
    .filter(isNotIntrospectionKey)
}

function getWinPropNames() {
  return Object.getOwnPropertyNames(window)
    .filter(isNotIntrospectionKey)
}

function getInheritedWinPropNames() {
  const names = []

  let proto = Object.getPrototypeOf(window)

  while (proto !== null) {
    names.push(...Object.getOwnPropertyNames(proto))
    proto = Object.getPrototypeOf(proto)
  }

  return [...new Set(names)]
    .filter(isNotIntrospectionKey)
}

function getGloballyAvailableValueNames() {
  return [...getWinPropNames(), ...getInheritedWinPropNames()]
}

function getConsoleOnlyWinPropNames() {
  return consoleWinPropNames = [...new Set([
    ...consoleWinPropNames,
    ...subtract(getGloballyAvailableValueNames(), premadeGloballyAvailableValueNames),
  ])]
}

function getConstructorWinPropNames() {
  return getGloballyAvailableValueNames().filter(isCapital)
    .filter(name => typeof window[name] === 'function')
}

function subtract(arr1, arr2) {
  return arr1.filter(item => !arr2.includes(item))
}

function isCapital(str) {
  return str[0] === str[0].toUpperCase() && str[0] !== str[0].toLowerCase()
}

function isUpperCase(str) {
  return str === str.toUpperCase() && str !== str.toLowerCase()
}

function isPrimitive(value) {
  return !['object', 'function'].includes(typeof value) || value === null
}
