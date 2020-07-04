import m from 'mithril/hyperscript'
import mount from 'mithril/mount'
import redraw from 'mithril/redraw'

function cleanup (el: HTMLElement): void {
  mount(el, null)
  redraw.sync()
}

export { m, mount, redraw, cleanup }
