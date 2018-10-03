export class Layout2ViewModel {

  /**
   * Populated by Aurelia ref binding
   */
  readonly el: Element;

  attached() {
    this.el.classList.remove('view-only');
    this.el.classList.add('layout-2');
  }
}
