export class MultipleSlotsLayout1ViewModel {
  el: Element;
  attached() {
    this.el.classList.remove('view-only');
    this.el.classList.add('multiple-slots-layout-1');
  }
}
