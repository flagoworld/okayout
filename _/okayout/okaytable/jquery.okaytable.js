(function($)
{
	var okayTableDefaults=
	{
		//Handlers
		handleDrawCol:function(el,row,col){el.html('');},
		handleDrawHeader:null,
		handleSelectRow:null,
		handleNumRows:function(){return 0;},
		handleNumCols:function(){return 0;},
		handleSort:function(order,col){},
		handleSearch:function(term){},
		handleReorder:null,
		handleAfterReload:null,
		
		//Settings
		sortOrder:0,
		sortCol:null,
		rowsPerPage:0,
		page:0,
		search:'',
		defaultText:''
	};
	
	var okayTableOptions;
	
	var okayTableMethods=
	{
		init:function(options)
		{
			this.addClass('okay-table');
			
			options=typeof options==='object'?options:{};
			
			if($.isFunction(options['handleDrawCol']))
				okayTableOptions['handleDrawCol']=options['handleDrawCol'];
			
			if($.isFunction(options['handleDrawHeader']))
				okayTableOptions['handleDrawHeader']=options['handleDrawHeader'];
			
			if($.isFunction(options['handleSelectRow']))
				okayTableOptions['handleSelectRow']=options['handleSelectRow'];
			
			if($.isFunction(options['handleNumRows']))
				okayTableOptions['handleNumRows']=options['handleNumRows'];
			
			if($.isFunction(options['handleNumCols']))
				okayTableOptions['handleNumCols']=options['handleNumCols'];
			
			if($.isFunction(options['handleSort']))
				okayTableOptions['handleSort']=options['handleSort'];
			
			if($.isFunction(options['handleSearch']))
				okayTableOptions['handleSearch']=options['handleSearch'];
			
			if($.isFunction(options['handleReorder']))
				okayTableOptions['handleReorder']=options['handleReorder'];
			
			if($.isFunction(options['handleAfterReload']))
				okayTableOptions['handleAfterReload']=options['handleAfterReload'];
			
			if(typeof options['sortOrder']!=='undefined')
				okayTableOptions['sortOrder']=parseInt(options['sortOrder']);
			
			if(typeof options['sortCol']!=='undefined')
				okayTableOptions['sortCol']=options['sortCol'];
			
			if(typeof options['rowsPerPage']!=='undefined')
				okayTableOptions['rowsPerPage']=parseInt(options['rowsPerPage']);
			
			if(typeof options['page']!=='undefined')
				okayTableOptions['page']=Math.abs(parseInt(options['page']));
			
			if(okayTableOptions['page']<1) okayTableOptions['page']=1;
			
			if(typeof options['search']!=='undefined')
				okayTableOptions['search']=''+options['search'];
			
			if(typeof options['defaultText']!=='undefined')
				okayTableOptions['defaultText']=''+options['defaultText'];
			
			okayTableMethods['reload'].apply(this,[]);
		},
		reload:function()
		{
			okayTableOptions['handleSearch'].apply(this,[okayTableOptions['search']]);
			okayTableOptions['handleSort'].apply(this,[okayTableOptions['sortOrder'],okayTableOptions['sortCol']]);
			
			var rowsPerPage=okayTableOptions['rowsPerPage'];
			var page=okayTableOptions['page']-1;
			var numRows=okayTableOptions['handleNumRows'].apply(this,[]);
			var numCols=okayTableOptions['handleNumCols'].apply(this,[]);
			
			var start=page*rowsPerPage;
			var end=start+rowsPerPage;
			
			if(start>numRows) page=0;
			
			if(end>numRows||rowsPerPage==0) end=numRows;
			
			var table=$(this).find('table');//$('<table></table>');
			if(!table.length)
			{
				table=$('<table></table>');
				$(this).append(table);
			}
			
			var header='';
			
			if(okayTableOptions['handleDrawHeader']!=null)
			{
				header=$('<thead></thead>');
				var row=$('<tr></tr>');
				
				for(var i=0;i<numCols;++i)
				{
					var col=$('<th></th>');
					okayTableOptions['handleDrawHeader'].apply(this,[col,i]);
					if(!col.html().length) col.html('&nbsp;');
					row.append(col);
				}
				
				header.append(row);
			}
			
			var body=$('<tbody></tbody>');
			
			if(end-start<=0&&okayTableOptions['defaultText'].length)
			{
				body.append('<tr><td colspan="'+numCols+'">'+okayTableOptions['defaultText']+'</td></tr>');
			}
			
			for(var i=start;i<end;++i)
			{
				var row=$('<tr></tr>');
				
				(function()
				{
					var self=this;
					var opt=okayTableOptions;
					var idx=i;
					if(opt['handleSelectRow']==null) return;
					
					row.on('click',function()
					{
						body.find('tr').removeClass('sel');
						$(this).addClass('sel');
						opt['handleSelectRow'].apply(self,[idx]);
					});
				})();
				
				for(var s=0;s<numCols;++s)
				{
					var col=$('<td></td>');
					
					okayTableOptions['handleDrawCol'].apply(this,[col,i,s]);
					row.append(col);
				}
				
				body.append(row);
			}
			
			if(okayTableOptions['handleReorder']!=null)
			{
				var from;
				$(body).sortable(
				{
					helper:function(e,tr)
					{
						var $originals = tr.children();
					    var $helper = tr.clone();
					    $helper.children().each(function(index) {
					        $(this).width($originals.eq(index).width())
					    });
					    return $helper;
					},
					start:function(e,ui)
					{
						from=start+ui.item.index();
					},
					stop:function(e,ui)
					{
						okayTableOptions['handleReorder'].apply(this,[from,start+ui.item.index()]);
					}
				});
			}
			
/* 			this.animate({opacity:0},100,function() */
/* 			{ */
				table.empty().append(header).append(body);//.append('<div style="clear: both;"></div>');//.stop().animate({opacity:1},100);
/* 			}); */
			
			if(okayTableOptions['handleAfterReload']!=null)
				okayTableOptions['handleAfterReload'].apply(this,[]);
		}
	};
	
	$.fn.OkayTable=function(method)
	{
		if(!$(this).length) return;
		
		okayTableOptions=$(this).data('okayTableOptions');
		
		if(method=='options') return okayTableOptions;
		
		if(typeof okayTableOptions==='undefined')
		{
			okayTableOptions=$.extend({},okayTableDefaults);
			$(this).data('okayTableOptions',okayTableOptions);
		}
		
		if(okayTableMethods[method])
			return okayTableMethods[method].apply(this,Array.prototype.slice.call(arguments,1));
		else
		if(typeof method==='object'||!method)
			okayTableMethods.init.apply(this,arguments);
		else
			$.error('Method '+method+' does not exist in jQuery.OkayTable');
	}
})(jQuery);