export class Route2ViewModel {

  /**
   * Populated by Aurelia ref binding
   */
  readonly el: Element;

  attached() {
    this.el.classList.remove('view-only');
  }
}
