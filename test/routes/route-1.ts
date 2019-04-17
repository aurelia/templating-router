export class Route1ViewModel {
  el: Element;
  attached() {
    this.el.classList.remove('view-only');
  }
}

