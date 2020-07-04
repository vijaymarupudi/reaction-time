import m from "mithril/hyperscript";
import mount from "mithril/mount";
import redraw from "mithril/redraw";

function cleanup(el: HTMLElement): void {
  mount(el, null);
  redraw.sync();
}

m.m = m;
m.mount = mount;
m.redraw = redraw;
m.cleanup = cleanup;

export default m;
