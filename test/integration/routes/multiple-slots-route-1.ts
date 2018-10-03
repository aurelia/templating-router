export class MultipleSlotsRoute1ViewModel {

  /**
   * Populated by Aurelia ref binding
   */
  readonly el1: Element;
  readonly el2: Element;

  attached() {
    this.el1.classList.remove('view-only');
    this.el2.classList.remove('view-only');
  }
}
