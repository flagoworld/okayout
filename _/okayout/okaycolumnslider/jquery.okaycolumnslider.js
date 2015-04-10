/*!
 * jquery.OkayColumnSlider() - v1.0
 * 2014-11-08
 *
 * Copyright 2014 Ryan Layne
 */

(function($)
{
	'use strict';
	
	var defaults=
	{
		position:0,
		updateEvent:$.noop,
		nextButton:'#okay-column-slider-next',
		prevButton:'#okay-column-slider-prev'
	};
	
	var okayColumnSlider=
	{
		init:function(options)
		{
			var $this=this;
			
			$this.addClass('okay-column-slider');
			
			$('body').on('click touchstart',options.nextButton+':not(.disabled)',function()
			{
				if(options.position+4<$this.find('> div').length-1)
					options.position+=4;
				
				if(options.position+4>=$this.find('> div').length-1)
					options.position=$this.find('> div').length-4;
				
				okayColumnSlider.update.call($this);
			});
			
			$('body').on('click touchstart',options.prevButton+':not(.disabled)',function()
			{
				if(options.position>0)
					options.position-=4;
				
				if(options.position<0)
					options.position=0;
				
				okayColumnSlider.update.call($this);
			});
			
			okayColumnSlider.update.call($this);
		},
		
		update:function()
		{
			var options=this.data('okayColumnSliderOptions');
			
			if(options.position<=0)
			{
				options.position=0;
				$(options.prevButton).addClass('disabled');
			}else
			{
				$(options.prevButton).removeClass('disabled');
			}
			
			if(options.position+4>=this.find('> div').length-1)
			{
				$(options.nextButton).addClass('disabled');
			}else
			{
				$(options.nextButton).removeClass('disabled');
			}
			
			var width=this.find('> div:not(.hide)').eq(0).width();
			var all=this.find('> div');
			
			all.find('> .noscale').css('width',width+'px');
			all.addClass('hide').slice(options.position,options.position+4).removeClass('hide');
			
			setTimeout(function()
			{
				all.find('> .noscale').removeAttr('style');
			},500);
			
			options.updateEvent.call(this);
		}
	};
	
	$.fn.extend(
	{
		OkayColumnSlider:function(method)
		{
			if(!$(this).length) return $(this);
			
			if(method=='options') return this.eq(0).data('okayColumnSliderOptions');
			
			return this.each(function()
			{
				var $this=$(this);
				
				var okayColumnSliderOptions=$this.data('okayColumnSliderOptions');
				
				if(okayColumnSlider[method])
				{
					if(typeof okayColumnSliderOptions==='undefined')
					{
						$.error('Method '+method+' called on uninitialized jQuery.OkayColumnSlider');
						return;
					}
					
					if(method=='init')
					{
						$.error('Direct initialization of jQuery.OkayColumnSlider is forbidden');
						return;
					}
					
					okayColumnSlider[method].apply(this,Array.prototype.slice.call(arguments,1));
				}else
				if(typeof method==='object'||!method)
				{
					if(typeof okayColumnSliderOptions==='undefined')
					{
						okayColumnSliderOptions=$.extend({},defaults,method);
						$this.data('okayColumnSliderOptions',okayColumnSliderOptions);
						okayColumnSlider.init.apply($this,[okayColumnSliderOptions]);
					}else
					{
						$.extend(okayColumnSliderOptions,options);
					}
				}else
				{
					$.error('Method '+method+' does not exist in jQuery.OkayColumnSlider');
				}
			});
		}
	});
})(jQuery);
