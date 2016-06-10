/*
 * email autoComplete 0.1
 * http://act.iteye.com
 * 2012-08-20 by jy.hu
 * 一个简单自动完成email输入的插件
 *a simple automatic completion of email input jquery plugin
 */
;
(function($){
	// 默认配置
	var settings = {
		maxItems : 100 , // 最大提示数目
		subBox : 'email_auto_warp' , // 存放容器
		subOp : 'dd' , // 列表显示
		hoverClass : 'on' , // 鼠标悬浮样式
		defaultItems : ['@qq.com' , '@163.com' , '@sina.com' , '@126.com' , '@gmail.com' , '@sohu.com' ,  '@hotmail.com'] // 默认提示邮箱后缀
	};
	$.fn.emailAutoCompele = function(options){
		var config = {};
		$.extend(config,settings,options);
		var items = config.defaultItems;
		var $this = $(this);
		var _oWidth = $this.outerWidth();
		var _oHeight = $this.outerHeight();
		var _oLeft = $this.offset().left;
        var _oTop = $this.offset().top;
		var _cur_index_ = 1;
		if($this.is(':input') && $this.attr('type')==='text'){
			var warp_div_html = "<div id='"+config.subBox+"'>";
			var warp_head_html = "<{1} style='min-width: "+_oWidth+"px;width:"+_oWidth+"px'></{1}>";
			var warp_head = 'dl';
			if(config.subOp === 'li')
				warp_head = 'ul';
			warp_head_html = warp_head_html.replace('{1}',warp_head);
			$this.after(warp_div_html+warp_head_html+"</div>");
			//键盘释放事件
			$this.keyup(function(e){
				if(e.keyCode==40 || e.keyCode==38){
					return false;
				}
				var warp_object = $("#"+config.subBox);
				var cur_value = this.value;
				if(cur_value.replace(/(^\s*)(\s*$)/g,'') != ''){
					if(e.keyCode!=13 && e.keyCode!=27){
						warp_object.css({
							"left":_oLeft,
							"top":_oTop+_oHeight,
							"display":"block"
						});
						warp_object.find(warp_head).html(buildItem(cur_value));
						bindItem(warp_object);
						//获取焦点
						$this.focus(function(e){
							if(warp_object.is(':hidden')&&this.value.replace(/(^\s*)(\s*$)/g,'') != ''){
									warp_object.find(warp_head).html(buildItem(this.value));
									bindItem(warp_object);
									warp_object.show();
								}
						});
						//项鼠标点击
						warp_object.find(config.subOp).click(function(){
							if(this.id === 'e_type')
								return;
							var _that = $(this);
							$this.val(_that.text());
						});
						//鼠标点击
						document.onclick = function(event){
							var e = window.event || event;
							var k = e.keyCode || e.which;
							var obj = e.srcElement ? e.srcElement : e.target;
							var id = obj.getAttribute('id');
							if(id === 'e_type')
								return;
							if(id != $this.attr('id')){
								warp_object.hide();
								if (e && e.stopPropagation)
									e.stopPropagation()
								else
									window.event.cancelBubble=true
							}
						}
						//键盘触发
						document.onkeydown = function(evnet){
							var e = window.event || evnet;
							var k = e.keyCode || e.which;
							var item_object = warp_object.find(config.subOp);
							var item_lenght = item_object.length-1;
							var cur_item = warp_object.find(config.subOp+"[class="+config.hoverClass+"]");
							var cur_index = cur_item.index();
							var _cur_index = cur_index;
							var _sign = false;
							switch(k){
								case 40://下键
									if(cur_index == item_lenght)
										_cur_index = 1;
									else
										_cur_index += 1;
										_sign =true;
										break;
								case 38://上键
									if(cur_index == 1)
										_cur_index = item_lenght;
									else
										_cur_index -= 1;
										_sign =true;
										break;
								case 9://tab键关闭联想框
									warp_object.hide();
									_sign=false;
									break;
								case 13:
									$this.val(cur_item.text());
									warp_object.hide();
									break;
								default:
									_sign = false;
									break;
							}
							if(_sign){
								cur_item.removeClass(config.hoverClass);
								warp_object.find(config.subOp+":eq("+_cur_index+")").addClass(config.hoverClass);
								_cur_index_  = _cur_index;
							}
						}
					}
				}else{
					warp_object.hide();
				}
			});
		}else{
			if(console && console.log)
				console.log('this ojbect is not support!');
		}
		function bindItem(warp_object){
			var _items = warp_object.find(config.subOp);
			//项鼠标悬浮
			_items.hover(function(){
					if(this.id === 'e_type'){
						warp_object.find(config.subOp+":eq("+_cur_index_+")").addClass(config.hoverClass);
						return;
					}
					var _that=$(this);
					_items.removeClass(config.hoverClass);
					_that.addClass(config.hoverClass);
					_cur_index_  = _that.index();
				},function(){
					if(this.id === 'e_type')
						return;
						var _that=$(this);
						_that.removeClass(config.hoverClass);
				});
				//存放容器悬浮事件
			warp_object.hover(function(){
				},function(){
					$(this).find(config.subOp+":eq("+_cur_index_+")").addClass(config.hoverClass);
			});
		}
		function buildItem(cur_value){
			var warp_item_html = "<"+config.subOp+" id='e_type'>请选择邮件类型:</"+config.subOp+">";
			warp_item_html += "<"+config.subOp+" class='on'>"+cur_value+"</"+config.subOp+">";
			var _item = "<"+config.subOp+">{1}</"+config.subOp+">";
			var _e = cur_value.indexOf('@');
			if(_e >= 0){
				var _sh=cur_value.substring(0,_e)
				var _se=cur_value.substring(_e);
				$.each(config.defaultItems, function (s,m) {
					if(s+1>config.maxItems)
						return false;
					if(_se === m)
						return true;
					if(m.indexOf(_se)!=-1){
						warp_item_html += _item.replace('{1}', _sh + m);
						}
				})
			}else{
				for(var i = 0;i<items.length;i++){
					if(i+1>config.maxItems)
						break;
						warp_item_html += _item.replace('{1}',cur_value+items[i]);
					}
			}
		return warp_item_html;
		}
	};
})(jQuery);
