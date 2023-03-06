export { DragBar }

class DragBar {
  static e0
  static current
  static bars = []

  constructor(parent) {
    const bar = document.createElement('drag-bar')
    const div = document.createElement('div')

    parent.appendChild(bar).append(div)

    this.element = div

    this.assignListeners()

    DragBar.bars.push(bar)

    if (DragBar.rules) {
      const sheet = document.styleSheets[0]
        || document.head.appendChild(document.createElement('style')).sheet

      DragBar.rules.forEach(rule => sheet.insertRule(rule, sheet.cssRules.length))
      delete DragBar.rules
    }
  }

  insert(...children) {
    this.element.append(...children)
  }

  assignListeners() {
    this.element.parentElement.addEventListener('mousedown', DragBar.handleMousedown)

    if (!DragBar.bars.length) {
      window.addEventListener('resize', DragBar.handleResize)
    }
  }

  static handleMousedown(e) {
    if (e.target == this) {
      DragBar.e0 = e
      DragBar.current = this.parentElement.appendChild(this)
      this.style.cursor = 'grabbing'
      window.addEventListener('mousemove', DragBar.handleDrag)
      window.addEventListener('mouseup', DragBar.handleMouseup)
    }
  }

  static handleDrag(e) {
    DragBar.current.style.left = normalize(
      e.clientX - DragBar.e0.offsetX,
      innerWidth - DragBar.current.offsetWidth
    ) + 'px'

    DragBar.current.style.top = normalize(
      e.clientY - DragBar.e0.offsetY,
      innerHeight - DragBar.current.offsetHeight
    ) + 'px'
  }

  static handleMouseup() {
    DragBar.current.style.cursor = null
    window.removeEventListener('mousemove', DragBar.handleDrag)
    window.removeEventListener('mouseup', DragBar.handleMouseup)
  }

  static handleResize() {
    for (const bar of DragBar.bars) {
      bar.style.left = normalize(bar.offsetLeft, innerWidth - bar.offsetWidth) + 'px'
      bar.style.top = normalize(bar.offsetTop, innerHeight - bar.offsetHeight) + 'px'
    }
  }

  static rules = `
    drag-bar {
      position: fixed;
      width: 30vmin;
      height: 12vmin;
      background-color: plum;
      user-select: none;
      padding: 6px 40px;
    }

    drag-bar:hover:not(:has(:hover)) {
      cursor: grab;
    }

    drag-bar:active:not(:has(:active)) {
      cursor: grabbing;
    }

    drag-bar>:only-child {
      background: wheat;
      height: 100%;
      overflow: hidden;
    }
  `.split(/\n\n/)
}

function normalize(value, max) {
  return Math.max(0, Math.min(max, value))
}
