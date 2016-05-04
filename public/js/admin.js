//删除逻辑
$(function(){
	$('.del').click(function(e){  //拿到所有的删除按钮
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)
		
		$.ajax({
			type:'DELETE',  //异步请求类型：删除
			url:'/admin/list?id=' + id,
		})
		.done(function(results){   
			if(results.success === 1){
				if(tr.length > 0){
					tr.remove()
				}
			}
		})
	});
});
