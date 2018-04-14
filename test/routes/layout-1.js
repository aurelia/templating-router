export class Layout1ViewModel {
  attached() {
    this.el.classList.remove('view-only');
    this.el.classList.add('layout-1');
  }
  activate(params) {
    this.activate = params;
  }
}
