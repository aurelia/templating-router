export class MultipleSlotsLayout1ViewModel {

  /**
   * Populated by Aurelia ref binding
   */
  readonly el: Element;

  attached() {
    this.el.classList.remove('view-only');
    this.el.classList.add('multiple-slots-layout-1');
  }
}
