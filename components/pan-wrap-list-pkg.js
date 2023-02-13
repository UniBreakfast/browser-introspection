export { PanWrapList }

class PanWrapList {
  constructor(parent) {
    const pan = document.createElement('horizontal-pan')
    const list = document.createElement('wrap-list')

    parent.appendChild(pan).append(list)

    this.element = list

    if (PanWrapList.rules) {
      const sheet = document.styleSheets[0]

      PanWrapList.rules.forEach(rule => sheet.insertRule(rule, sheet.cssRules.length))
      delete PanWrapList.rules
    }
  }

  list(arr) {
    this.element.replaceChildren(...arr.map(item => {
      const li = document.createElement('li')

      li.textContent = item

      return li
    }))
  }

  static rules = `
    horizontal-pan {
      display: block;
      height: 300px;
      overflow: auto clip;
    }

    wrap-list {
      display: flex;
      flex-flow: column wrap;
      width: min-content;
      height: 100%;
      gap: 0 20px;
    }

    wrap-list>li {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 250px;
    }
  `.split(/\n\n/)
}
