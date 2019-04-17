export class Route2ViewModel {
  el: Element;
  attached() {
    this.el.classList.remove('view-only');
  }
}
