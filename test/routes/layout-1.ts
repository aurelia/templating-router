export class Layout1ViewModel {
  el: Element;
  attached() {
    this.el.classList.remove('view-only');
    this.el.classList.add('layout-1');
  }
  activate(params: any) {
    this.activate = params;
  }
}
