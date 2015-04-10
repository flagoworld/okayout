/*!
 * jquery.OkayPagination() - v1.0
 * 2014-11-08
 *
 * Copyright 2014 Ryan Layne
 */

(function($)
{
	'use strict';
	
	var defaults=
	{
		pages:			$(),
		scrollSpeed:	500,
		scrollOffset:	0,
		container:		$(),
		appendTo:		$(),
		arrowUp:		'^',
		arrowDown:		'v',
		arrowTop:		'TOP',
		scrolling:		false
	};
	
	var okayPagination=
	{
		init:function(options)
		{
			var $this=this;
			
			var container=$('<div class="okay-pagination"></div>');
			var top=$('<a class="okay-pagination-top"></a>').append(options.arrowTop);
			var up=$('<a class="okay-pagination-up"></a>').append(options.arrowUp);
			var down=$('<a class="okay-pagination-down"></a>').append(options.arrowDown);
			var pages=$('<ul class="okay-pagination-pages"></ul>');
			
			top.on('click',function()
			{
				options.scrolling=true;
				$.scrollTo(0,0,{animation:{duration:options.scrollSpeed,complete:function(){options.scrolling=false}}});
			});
			
			up.on('click',function()
			{
				okayPagination.setPage.call($this,okayPagination.getPageIndex.call($this)-1);
			});
			
			down.on('click',function()
			{
				okayPagination.setPage.call($this,okayPagination.getPageIndex.call($this)+1);
			});
			
			container.append(top);
			
			if(options.pages.length)
			{
				container.append(up).append(down);
				options.pages.each(function(i,ob)
				{
					$('<li></li>').on('click',function()
					{
						okayPagination.setPage.call($this,i);
					}).appendTo(pages);
				});
				pages.appendTo(container);
			}
			
			container.appendTo(options.appendTo);
			
			options.container=container;
			
			$this.on('scroll',function()
			{
				if(options.scrolling) return;
				
				var idx=okayPagination.getPageIndex.call($this);
				okayPagination.updatePage.call($this,idx);
			});
		},
		
		getPageIndex:function()
		{
			var options=this.data('okayPaginationOptions');
			
			var pos=this.offset();
			
			if(typeof pos==='undefined')
				pos=0;
			else
				pos=pos.top;
			
			pos+=this.scrollTop();
			
			var idx=0;
			var idxdiff=999999999;
			
			options.pages.each(function(i,ob)
			{
				var diff=$(ob).offset().top-pos;
				if(Math.abs(diff)<Math.abs(idxdiff))
				{
					idx=i;
					idxdiff=diff;
				}
			});
			
			return idx;
		},
		
		setPage:function(idx)
		{
			var options=this.data('okayPaginationOptions');
			
			if(idx>=options.pages.length) idx=options.pages.length;
			if(idx<0) idx=0;
			
			options.scrolling=true;
			$.scrollTo(0,options.pages.eq(idx).offset().top+options.scrollOffset,{animation:{duration:options.scrollSpeed,complete:function(){options.scrolling=false}}});
			
			okayPagination.updatePage.call(this,idx);
		},
		
		updatePage:function(idx)
		{
			var options=this.data('okayPaginationOptions');
			
			if(idx>=options.pages.length) idx=options.pages.length;
			if(idx<0) idx=0;
			
			options.container.find('li').removeClass('active').eq(idx).addClass('active');
		}
	};
	
	$.fn.extend(
	{
		OkayPagination:function(method)
		{
			if(!$(this).length) return $(this);
			
			if(method=='options') return this.eq(0).data('okayPaginationOptions');
			
			return this.each(function()
			{
				var $this=$(this);
				
				var okayPaginationOptions=$this.data('okayPaginationOptions');
				
				if(okayPagination[method])
				{
					if(typeof okayPaginationOptions==='undefined')
					{
						$.error('Method '+method+' called on uninitialized jQuery.OkayPagination');
						return;
					}
					
					if(method=='init')
					{
						$.error('Direct initialization of jQuery.OkayPagination is forbidden');
						return;
					}
					
					okayPagination[method].apply(this,Array.prototype.slice.call(arguments,1));
				}else
				if(typeof method==='object'||!method)
				{
					if(typeof okayPaginationOptions==='undefined')
					{
						okayPaginationOptions=$.extend({},defaults,method);
						$this.data('okayPaginationOptions',okayPaginationOptions);
						okayPagination.init.apply($this,[okayPaginationOptions]);
					}else
					{
						$.extend(okayPaginationOptions,options);
					}
				}else
				{
					$.error('Method '+method+' does not exist in jQuery.OkayPagination');
				}
			});
		}
	});
})(jQuery);
