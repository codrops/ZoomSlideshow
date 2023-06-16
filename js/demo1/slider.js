// Slider class definition for managing a slideshow
export class Slider {
	DOM = {
		el: null
	};
	// Define a private property to store the current slide index
	#current = 0;

	// Constructor accepts a DOM element representing the slider
	constructor(DOM_el) {
		this.DOM.el = DOM_el;
		
		// Create an array of all slides
		this.slides = [...this.DOM.el.querySelectorAll('.slider__item')];
		
		// Calculate the total number of slides
		this.slidesTotal = this.slides.length;

		// Set the current slide's class to 'slider__item--current'
		this.slides[this.current].classList.add('slider__item--current');
		
		// Set the previous slide's class to 'slider__item--previous'
		this.slides[this.getPreviousPosition()].classList.add('slider__item--previous');
	}
	
	// Method to get the index of the previous slide
	getPreviousPosition() {
		return this.current != 0 ? this.current - 1 : this.slidesTotal - 1;
	}
	
	// Method to get the index of the slide before the previous slide
	getPreviousPreviousPosition() {
		const position = this.getPreviousPosition();
		return position != 0 ? position-1 : this.slidesTotal - 1;
	}
	
	// Method to get the index of the next slide
	getNextPosition() {
		return this.current != this.slidesTotal - 1 ? this.current + 1 : 0;
	}
	
	// Method to navigate to the next slide
	next() {
		this.navigate(1);
	}
	
	// Method to navigate to the previous slide
	prev() {
		this.navigate(0);
	}
	
	// Getter for the current slide index
	get current() {
		return this.#current;
	}
	
	// Setter for the current slide index
	set current(value) {
		this.#current = value;
	}
	
	// Method to navigate the slider in the given direction (1 for next, 0 for previous)
	navigate(direction) {
		
		// Return early if an animation is in progress
		if ( this.isAnimating ) return false;
		this.isAnimating = true;
		
		// Define variables to reference the current, next, previous, and slide before previous slide
		const currentSlide = this.slides[this.current];
		const nextSlide = this.slides[this.getNextPosition()];
		const previousSlide = this.slides[this.getPreviousPosition()];
		const previousPreviousSlide = this.slides[this.getPreviousPreviousPosition()];
		
		// Animate the slider navigation using GSAP
		const tl = gsap.timeline({
			defaults: {
				duration: 1.1, 
				ease: 'expo.inOut'
			},
			onStart: () => {
				if ( !direction ) {
					gsap.set(previousPreviousSlide, {opacity: 1, scale: 1});
				}

				// Set z-indexes for proper layering
				const incomingSlide = direction ? nextSlide : previousSlide;
				// Reset slides z-indexes
				gsap.set(this.slides, {zIndex: 0, willChange: 'transform, opacity'});
				gsap.set(incomingSlide, {zIndex: direction ? 3 : 2});
				gsap.set(currentSlide, {zIndex: direction ? 2 : 3});
				gsap.set(direction ? previousSlide : previousPreviousSlide, {zIndex: 1});
			},
			onComplete: () => {
				// Update classes for current and previous slides based on direction
				currentSlide.classList.remove('slider__item--current');
				previousSlide.classList.remove('slider__item--previous');
				(direction ? nextSlide : previousSlide).classList.add('slider__item--current');
				(direction ? currentSlide : previousPreviousSlide).classList.add('slider__item--previous');

				// Set the isAnimating property to false, indicating that the animation is complete
				this.isAnimating = false;
			}
		})
		.to(currentSlide, {
			scale: direction
		})
		.fromTo(direction ? nextSlide : previousSlide, {
			scale: direction ? 0 : 1,
			opacity: 1
		}, {
			scale: 0.3
		}, 0)

		// Update the current slide index based on the navigation direction
		this.current = direction ? this.getNextPosition() : this.getPreviousPosition();
	}
}