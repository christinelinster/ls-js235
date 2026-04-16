import templates from './templates.js';
let photos;

async function getPhotos() {
  let response = await fetch('/photos')
  return response.json();
}

function renderPhotos() {
  let slides = document.getElementById('slides');
  slides.innerHTML = templates.photos(photos);
}

function renderPhotoInformation(id) {
  let photo = photos.find(photo => photo.id === id);
  let information = document.getElementById('information');
  information.innerHTML = templates.photoInformation(photo)
}

async function fetchComments(id) {
  let response = await fetch(`/comments?photo_id=${id}`);
  return response.json();
}

function renderComments(comments) {
  let commentList = document.querySelector('#comments ul')
  commentList.innerHTML = comments.map(com => templates.comment(com)).join('')
}

async function main() {
  photos = await getPhotos();
  let firstPhotoId = photos[0].id;
  renderPhotos();
  renderPhotoInformation(firstPhotoId)

  let comments = await fetchComments(firstPhotoId);
  renderComments(comments)

  slideshow.init();
}

async function handleActions(event) {
  event.preventDefault();

  let {target} = event;
  let {property} = target.dataset

  if (!property) return;

  let id = Number(target.dataset.id);
  let href = target.href;
  let currLikes = target.textContent;

  let response = await fetch(href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body: 'photo_id=' + id,
  })

  let data = await response.json();
  target.textContent = currLikes.replace(/\d+/, data.total)

  let updatedPhoto = photos.find(photo => photo.id === id);
  updatedPhoto[property] = data.total;
}

function renderNewComment(comment) {
  let commentList = document.querySelector('#comments ul');
  commentList.insertAdjacentHTML('beforeend', templates.comment(comment))
}

async function handleSubmit(event) {
  event.preventDefault();
  let form = event.target;
  let href = form.getAttribute('action')
  let formData = new FormData(form);
  let currentSlideId = slideshow.currentSlide.getAttribute('data-id')

  formData.set('photo_id', currentSlideId)

  let newComment = await fetch(href, {
    method: form.method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body: new URLSearchParams(formData)
  })

  let json = await newComment.json();
  renderNewComment(json)
  form.reset();
}


const slideshow = {
  init() {
    this.slideshow = document.getElementById('slideshow')
    this.slides = this.slideshow.querySelectorAll('figure')

    console.log(this.slideshow)
    console.log(this.slides)

    this.firstSlide = this.slides[0];
    this.lastSlide = this.slides[this.slides.length - 1]
    this.currentSlide = this.firstSlide;
    this.bind();
  },

  prevSlide(event) {
    event.preventDefault();
    let prev = this.currentSlide.previousElementSibling || this.lastSlide;
    this.changeSlide(prev)
  },

  nextSlide(event) {
    event.preventDefault();
    let next = this.currentSlide.nextElementSibling || this.firstSlide;
    this.changeSlide(next);
  },

  async renderPhotoContent(id) {
    renderPhotoInformation(Number(id))
    let comments = await fetchComments(id);
    renderComments(comments);
  },

  changeSlide(newSlide) {
    this.fadeOut(this.currentSlide);
    this.fadeIn(newSlide);
    this.renderPhotoContent(newSlide.getAttribute('data-id'));
    this.currentSlide = newSlide;
  },

  fadeOut(slide) {
    slide.classList.add('hide')
    slide.classList.remove('show')
  },

  fadeIn(slide) {
    slide.classList.add('show')
    slide.classList.remove('hide')
  },

  bind() {
    let prevButton = this.slideshow.querySelector('a.prev');
    let nextButton = this.slideshow.querySelector('a.next');

    prevButton.addEventListener('click', event => this.prevSlide(event));
    nextButton.addEventListener('click', event => this.nextSlide(event))
  }

}

document.addEventListener('DOMContentLoaded', () => {
  main();
  document.getElementById('information').addEventListener('click', handleActions)
  document.querySelector('form').addEventListener('submit', handleSubmit)
})


