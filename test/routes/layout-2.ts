export class Layout2ViewModel {
  el: Element;
  attached() {
    this.el.classList.remove('view-only');
    this.el.classList.add('layout-2');
  }
}
