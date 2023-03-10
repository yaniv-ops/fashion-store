$(function() {
  // Set up the carousel's "state"
  var prevIndex = 0;
  var currentIndex = 1;
  var nextIndex = 2;
  var lastIndex = $('#quotes-carousel').find('.quote').length - 1;

  // Actions to listen for
  $('#quotes-carousel').on('click', '.previous', showQuote);
  $('#quotes-carousel').on('click', '.next', showQuote);
  $('#quotes-carousel-pips').on('click', '.pip', showFromPip);

  // Generate pips
  generatePips();
  setLeftClass();

  // Cycle automatically
  var carouselRunning = true;
  var carouselRestartTimeout;

  // Set the carousel working
  var interval = setInterval(function() {
    if (carouselRunning) {
      showNextQuote();
    }
  }, 4000);

  function showNextQuote() {
    // Calculate the indices needed to show the next quote
    if (currentIndex === lastIndex) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    updateState(currentIndex);
  }

  function showQuote(event) {
    // Get the index of the clicked quote and show it
    if ($(event.target).hasClass('quote')) {
      var target = $(event.target);
    } else {
      var target = $(event.target).parent();
    }
    var index = $('.quote').index(target);
    updateState(index);

    // Since this is by click, pause the automatic movement for a few seconds
    clearTimeout(carouselRestartTimeout);
    carouselRunning = false;
    carouselRestartTimeout = setTimeout(function() {
      carouselRunning = true;
    }, 10000);
  }

  function updateState(index) {
    // Calculates the previous and next indices, and updates the carousel
    prevIndex = index === 0 ? lastIndex : index - 1;
    currentIndex = index;
    nextIndex = index === lastIndex ? 0 : index + 1;

    updateCarouselPosition();
    setLeftClass();
    updatePips();
  }


  function updateCarouselPosition() {
    // Remove any previous, current, next classes
    $('#quotes-carousel').find('.previous').removeClass('previous');
    $('#quotes-carousel').find('.current').removeClass('current');
    $('#quotes-carousel').find('.next').removeClass('next');
    var allQuotes = $('#quotes-carousel').find('.quote');
    $(allQuotes[prevIndex]).addClass('previous');
    $(allQuotes[currentIndex]).addClass('current');
    $(allQuotes[nextIndex]).addClass('next');
  }

  function generatePips() {
    // Add pips to the ul element in index.html
    var listContainer = $('#quotes-carousel-pips').find('ul');
    for (var i = lastIndex; i >= 0; i--) {
      var newPip = $('<li class="pip"></li>');
      $(listContainer).append(newPip);
    }
    updatePips();
  }

  function updatePips() {
    // Update the classes on the pips depending on the current indices
    $('#quotes-carousel-pips').find('.previous').removeClass('previous');
    $('#quotes-carousel-pips').find('.current').removeClass('current');
    $('#quotes-carousel-pips').find('.next').removeClass('next');
    var allPips = $('#quotes-carousel-pips').find('.pip');
    $(allPips[prevIndex]).addClass('previous');
    $(allPips[currentIndex]).addClass('current');
    $(allPips[nextIndex]).addClass('next');
  }

  function showFromPip(event) {
    // Helper for when someone clicks a pip
    var index = 0;
    while( (event.target = event.target.previousSibling) != null ) {
      index++;
    }
    updateState(index);
  }

  function setLeftClass() {
    // For when we want the item to appear from the left side if it's "earlier" in the list
    var allQuotes = $('#quotes-carousel').find('.quote');
    // Clear any previous "left" item
    $('.quote.left').removeClass('left');
    if (prevIndex > 0) {
      var index = prevIndex - 1;
      $(allQuotes[index]).addClass('left');
    } else {
      // It's the first item, so add "left" to the last in the list
      $(allQuotes[allQuotes.length - 1]).addClass('left');
    }
  }

  // Lastly, add a listener for situations where the browser is in another tab / not visible
  document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
      carouselRunning = false;
    } else {
      carouselRunning = true;
    }
  });

});

var scroll = window.requestAnimationFrame ||
             function(callback) {
              window.setTimeout(callback, 1000/60)
             };

var elementsToShow = document.querySelectorAll('.show_on_scroll');

function loop () {
  elementsToShow.forEach(function(element) {
    if (isElementInViewport(element)) {
      element.classList.add('is_visible');
    }
    else {
      element.classList.remove('is_visible');
    }
  
});
  scroll(loop);

}

loop();

function isElementInViewport(el) {
  if(typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }
  var rect = el.getBoundingClientRect();
  return (
    (rect.top<=0
      && rect.bottom >=0)
      || 
    (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    ) ||
    (rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      )
      );

}