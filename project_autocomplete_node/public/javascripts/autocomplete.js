const Autocomplete = {
  wrapInput: function() {
    let wrapper = document.createElement('div');
    wrapper.classList.add('autocomplete-wrapper');
    this.input.parentNode.appendChild(wrapper);
    wrapper.appendChild(this.input);
  },

  bindEvents: function(){
    this.input.addEventListener('input', this.valueChanged.bind(this))
  },

  valueChanged: async function(){
    let value = this.input.value;

    if (value.length > 0) {
      this.matches = await this.fetchMatches(value)
      this.visible = true;
      this.bestMatchIndex = 0;
      this.draw();
    } else {
      this.reset();
    }
  },

  fetchMatches: async function(query) {
    let response = await fetch(`${this.url}${encodeURIComponent(query)}`)
    let data = await response.json(); // methods on response object are asynchronous
    return data;
  },

  draw: function() {
    while (this.listUI.lastChild) {
      this.listUI.removeChild(this.listUI.lastChild)
    }

    if (!this.visible) {
      this.overlay.textContent = '';
      return
    }

    if (this.bestMatchIndex !== null && this.matches.length !== 0) {
      let selected = this.matches[this.bestMatchIndex];
      this.overlay.textContent = this.generateOverlayContent(this.input.value, selected)
    } else {
      this.overlay.textContent = ''
    }

    this.matches.forEach(match => {
      let li = document.createElement('li')
      li.classList.add('autocomplete-ui-choice')

      li.textContent = match.name;
      this.listUI.appendChild(li);
    });
  },

  generateOverlayContent: function(value, match) {
    let end = match.name.slice(value.length)
    return value + end;
  },

  reset: function() {
    this.visible = false;
    this.matches = [];
    this.bestMatchIndex = null;
    this.draw();
  },

  createUI: function() {
    let listUI = document.createElement('ul');
    listUI.classList.add('autocomplete-ui');
    this.input.parentNode.appendChild(listUI);
    this.listUI = listUI;

    let overlay = document.createElement('div');
    overlay.classList.add('autocomplete-overlay');
    overlay.style.width = `${this.input.clientWidth}px`;

    this.input.parentNode.appendChild(overlay);
    this.overlay = overlay;
  },

  init: function() {
    this.input = document.querySelector('input');
    this.url = '/countries?matching=';

    this.listUI = null;
    this.overlay = null;

    this.visible = false;
    this.matches = [];
    this.bestMatchIndex = null;

    this.wrapInput();
    this.createUI();

    this.bindEvents()
    this.reset();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Autocomplete.init();
});