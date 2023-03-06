let introspectNow = () => { // introspect placeholder before ready
  throw new Error('introspectNow() is not ready yet')
}

let inDetails = {} // introspection details

!async function () { // IIFE to await imports
  const [
    { DragBar },
    { PanWrapList },
    { MenuButton },
    { introspect },
    { prepareToolBar },
  ] = await Promise.all([
    import('./components/drag-bar-pkg.js'),
    import('./components/pan-wrap-list-pkg.js'),
    import('./components/menu-button-pkg.js'),
    import('./introspection.js'),
    import('./tool-bar.js'),
  ])

  const wrapList = new PanWrapList(body)
  const dragBar = new DragBar(body)

  const menuBtn = new MenuButton(
    dragBar.element, 'view another list', 'center'
  )

  const refresh = prepareToolBar(inDetails, wrapList, dragBar, menuBtn)

  introspectNow = () => {
    Object.assign(inDetails, introspect())
    refresh()

    return inDetails
  }
}()
