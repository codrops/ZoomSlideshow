// Import the Slider class from the slider.js module
import { Slider } from './slider.js';

// Define an object containing navigation controls for the slider
const navigation = {
	'next': document.querySelector('.slider-nav > .slider-nav__item--next'),
	'prev': document.querySelector('.slider-nav > .slider-nav__item--prev')
};

// Instantiate a new Slider object, passing the DOM element with the .slider class as the target
const slider = new Slider(document.querySelector('.slider'));

const initializeSlider = () => {
	// Define the navigate function to call the appropriate Slider method based on the action parameter (next or prev)
	const navigate = action => slider[action](); 

	// Add click event listeners to the navigation controls, calling the navigate function with the appropriate action
	navigation.next.addEventListener('click', () => navigate('next'));
	navigation.prev.addEventListener('click', () => navigate('prev'));

	// Create an (GSAP) Observer to handle wheel, touch, scroll, and pointer events
	// Trigger the navigate function accordingly to navigate through the slider
	Observer.create({
		target: window,
		type: 'wheel,touch,scroll,pointer',
		onUp : () => navigate('next'), 
		onDown : () => navigate('prev'),
		wheelSpeed: -1
	});
};

// Check if the total number of slides is less than 3, and return early if so
if (slider.slidesTotal >= 3) {
    initializeSlider();
} 
else {
    console.log('Not enough slides. Exiting...');
}

// Preload background images of the slider items
// Once all images are loaded, remove the 'loading' class from the body element
imagesLoaded(document.querySelectorAll('.slider__item-inner'), {background: true}, () => document.body.classList.remove('loading'));