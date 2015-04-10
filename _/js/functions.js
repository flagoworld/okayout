// Browser detection for when you get desparate. A measure of last resort.
// http://rog.ie/post/9089341529/html5boilerplatejs

// var b = document.documentElement;
// b.setAttribute('data-useragent',  navigator.userAgent);
// b.setAttribute('data-platform', navigator.platform);

// sample CSS: html[data-useragent*='Chrome/13.0'] { ... }


// remap jQuery to $
(function($){

var count = 0;
var interval = null;

/* trigger when the DOM is loaded */
$(function()
{
	var h1 = $('#okayout-loading').find('h1');
	
	interval = setInterval(function()
	{
		var dots = '';
		
		if(count > 3) count = 0;
		
		while(dots.length < count)
			dots += '.';
		
		h1.text('loading' + dots);
		
		++count;
	}, 300);
});


/* trigger when page is fully loaded */
$(window).load(function()
{
	var overlay = $('#okayout-loading');
	
	clearInterval(interval);
	
	overlay.find('h1')
	.fadeOut(function()
	{
		$(this).text('welcome to okayout')
		.fadeIn()
		.delay(1000).queue(function()
		{
			$(this).stop().animate({left: '-1000px', opacity: 0}, 1000, 'swing');
			overlay.fadeOut(800);
		});
	});
});

})(window.jQuery);