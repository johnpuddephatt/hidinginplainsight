let inView = (elem,threshold,rootMargin) => {

  if(!(elem instanceof Element || elem instanceof HTMLDocument)) {
    elem = document.querySelectorAll(elem);
  }

  if(!elem) return;

  let callback = function (entries) {
    entries.forEach(entry => {
      if(entry.intersectionRatio >= threshold) {
        entry.target.classList.add('in-view');
         entry.target.classList.add('has-been-in-view');
      }
      else {
        entry.target.classList.remove('in-view');
      }
    });
  };

  let options = {
    rootMargin: rootMargin || '0px 0px',
    threshold: [0.25, 0.6],
  }

  let observer = new IntersectionObserver(callback, options);
  elem.forEach(elem => {
    observer.observe(elem);
  });
}

export default inView;