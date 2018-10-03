export class Layout1ViewModel {

  /**
   * Populated by Aurelia ref binding
   */
  readonly el: Element;

  attached() {
    this.el.classList.remove('view-only');
    this.el.classList.add('layout-1');
  }

  activate(params) {
    this.activate = params;
  }
}
