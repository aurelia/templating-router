export class MultipleSlotsRoute1ViewModel {
  el1: Element;
  el2: Element;
  attached() {
    this.el1.classList.remove('view-only');
    this.el2.classList.remove('view-only');
  }
}
