export { prepareToolBar }

function prepareToolBar(inDetails, wrapList, dragBar, menuBtn) {
  const menuItemLabels = [
    'Enumerable global variables (window properties)',
    'Non-enumerable global variables (window properties)',
    'Global variables, inherited by window',
    null,
    'All global variables',
    null,
    'Constructors among global functions',
    'Console exclusive tools',
    null,
    'All values (collected recursively)',
    'All property names (collected recursively)',
  ]

  menuBtn.list(menuItemLabels)

  return () => {
    const {
      enumWinPropNames,
      nonEnumWinPropNames,
      winPropNames,
      inheritedWinPropNames,
      globallyAvailableValueNames,
      consoleOnlyWinPropNames,
      constructorWinPropNames,
      valueNames,
      propertyNames,
    } = inDetails

    const listItems = [
      enumWinPropNames,
      nonEnumWinPropNames,
      inheritedWinPropNames,
      null,
      winPropNames,
      null,
      constructorWinPropNames,
      consoleOnlyWinPropNames,
      null,
      valueNames,
      propertyNames,
    ]

    menuBtn.on('click', ({ target }) => {
      const index = menuItemLabels.indexOf(target.textContent)

      if (index > -1) {
        wrapList.list(listItems[index])
      }
    })
  }
}
