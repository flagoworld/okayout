(function($)
{
	$.extend(
	{
		equalizeModuleHeights:function()
		{
		    $('.column-layout').each(function()
			{
				var height=0;
				var els=[];
				$(this).children('div[class^="span-"]').each(function(i)
				{
					$(this).css({'min-height':0});
					$(this).children().eq(0).filter('div.module,div.panel').eq(0).css({'min-height':0});
					
					var h=$(this).outerHeight();
					
					if(height<h) height=h;
					
					els.push(this);
					
					if($(this).hasClass('last'))
					{
						for(var o=0;o<els.length;++o)
						{
							var el=$(els[o]);
							el.css({'min-height':height});
							el.children().eq(0).filter('div.module,div.panel').eq(0).css({'min-height':$(el).height()});
						}
						height=0;
						els=[];
					}
				});
			});
		},
		
		padding:function(direction)
		{
		    var intPart=this.css('padding-'+direction);
		    intPart=typeof intPart!=='undefined'?parseInt(intPart):0;
		    var unit=this.css('padding-'+direction);
		    unit=typeof unit!=='undefined'?unit.substring(unit.length-2):'px';
		
		    switch (unit)
		    {
		        case 'px':
		            return intPart;
		        case 'em':
		            return ConvertEmToPx(intPart)
		        default:
		        	return 0;
		    }
		},
		
		fullscreen:function()
		{
			$('.fullscreen').css('min-height',$(window).height());
		}
	});
	
	$(window).load(function()
	{
		$.equalizeModuleHeights();
		$.fullscreen();
		
		$('.module-collapsible').each(function()
		{
			if($(this).parent().parent().hasClass('hidden'))
				$(this).parent().parent().css('max-height',$(this).outerHeight());
			else
				$(this).parent().parent().css('max-height',1000);
		});
		
		$('body').on('click','.module-collapsible',function()
		{
			if($(this).parent().parent().hasClass('hidden'))
				$(this).parent().parent().animate({'max-height':1000}).removeClass('hidden');
			else
				$(this).parent().parent().animate({'max-height':$(this).outerHeight()}).addClass('hidden');
		});
	});
	
	$(window).resize(function()
	{
		$.equalizeModuleHeights();
		$.fullscreen();
	});
})(jQuery);
