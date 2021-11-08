var t;
$(function()
{
	$.ajaxSetup({ cache: false });
	$(document).on('submit',"#form_dlg",function(){return false;});
	if($(".stacked-menu").length>0)
	{
		new StackedMenu();
	}
	//附件上传
	uploadButtonInit(".uploadFile");
	//页面ckeditor
	$('.ckeditor_page').each(function(){
		var placeholder = $(this).attr('placeholder');
		var imgUrl = "admin_img_upload.php?type=image&m="+$('#m').val()+"&lang="+$(this).attr('name')+"&uid="+$('#unique_id').val();
		var fileUrl = "admin_img_upload.php?type=link&m="+$('#m').val()+"&lang="+$(this).attr('name')+"&uid="+$('#unique_id').val();
		$(this).ckeditor({
			height: 380,
			removePlugins: 'Maximize,elementspath,resize,autogrow',
			filebrowserImageUploadUrl: imgUrl,
			filebrowserUploadUrl: fileUrl,
			editorplaceholder: placeholder,
			toolbar: [
				{ name: 'tools', items: ['Source'] },
				{ name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', '-','TextColor','BGColor'  ] },
				{ name: 'format', items: ['CopyFormatting', 'RemoveFormat'] },
				{ name: 'links', items: ['Link', 'Unlink'] },
				{ name: 'insert', items: ['Image' ] },
				{ name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
				{ name: 'justify', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
				{ name: 'styles', items: ['Format', 'Font', 'FontSize'] }
			]
		});
	});
	//选择改变， 通用
	$(document).on('change',".select_change",function()
	{
		if(typeof($(this).attr("data-url"))=="undefined") 
		{
			alert("必须设置 data-url 参数");
			return;
		}
		if(typeof($(this).attr("data-param"))=="undefined") 
		{
			alert("必须设置 data-param 参数");
			return;
		}
		if(typeof($(this).attr("data-id"))=="undefined") 
		{
			alert("必须设置 data-id 参数");
			return;
		}
		var url_action=$(this).attr('data-url');
		var data=$(this).attr('data-param');
		var id=$(this).attr('data-id');
		var opt_val=$(this).find('option:selected').val();
		data+='&val='+opt_val;
		data+='&select_id='+id;
		$.ajax({type: "POST",dataType: 'json',url: url_action,data: data,
			success: function(json)
			{
				json_action(json);
			}
		});
	});
	//文本框内容输入改变 , 通用
	$(document).on('change',".input_change",function()
	{
		if(typeof($(this).attr("data-url"))=="undefined") 
		{
			alert("必须设置 data-url 参数");
			return;
		}
		if(typeof($(this).attr("data-param"))=="undefined") 
		{
			alert("必须设置 data-param 参数");
			return;
		}
		var url_action=$(this).attr('data-url');
		var data=$(this).attr('data-param');
		var opt_val=$(this).val();
		data+='&val='+opt_val;
		$.ajax({type: "POST",dataType: 'json',url: url_action,data: data,
			success: function(json)
			{
				json_action(json);
			}
		});
	});
	//单选框改变， 通用
	$(document).on('change',".check_change",function()
	{
		if(typeof($(this).attr("data-url"))=="undefined") 
		{
			alert("必须设置 data-url 参数");
			return;
		}
		if(typeof($(this).attr("data-param"))=="undefined") 
		{
			alert("必须设置 data-param 参数");
			return;
		}
		var url_action=$(this).attr('data-url');
		var data=$(this).attr('data-param');
		var opt_val="";
		if($(this).prop("checked"))
		{// 选择
			opt_val=$(this).val();
		}

		data+='&val='+opt_val;
		$.ajax({type: "POST",dataType: 'json',url: url_action,data: data,
			success: function(json)
			{
				json_action(json);
			}
		});
	});

	//分类 radio ajax
	$(".radio_ajax").change(function()
	{
		if(typeof($(this).attr("data-url"))==="undefined") 
		{
			alert("必须设置 data-url 参数，用于跳转");
			return;
		}
		url=$(this).attr('data-url');
		var val=$(this).attr('value');
		data = 'val='+val;
		$.ajax({type: "POST",dataType: 'json',url: url,data: data,
			success: function(json)
			{
				json_action(json);
			}
		});
	});
	
	//分类 radio
	$(".radio_type").change(function()
	{
		if(typeof($(this).attr("data-url"))==="undefined") 
		{
			alert("必须设置 data-url 参数，用于跳转");
			return;
		}
		url=$(this).attr('data-url');
		window.location.href=url;
	});
	if($(".datepicker2").length>0)
	{
		$(".datepicker2").datepicker({
			format: "yyyy-mm-dd",
			language: "zh-CN",
			autoclose: true,
			todayHighlight: true
		});
	}
	//点击隐藏错误提示
	$(document).on('click','.reg_input_err',function(){$('.reg_input_err').removeClass('reg_input_err');});
	$(document).on('click','body',function(){$('#ErrorDetail').slideUp('fast'); $('#ErrorDetail_main').slideUp('fast'); $('#ErrorDetail_main2').slideUp('fast');});

	//上传按钮
	$(document).on("click",".uploadBtn",function()
	{
		var obj=$(this);
		var text = obj.html();
		var target_form=obj.attr("form");
		//var status_txt=obj.attr("status");
		//if(typeof(status_txt)!="undefined") $('#'+status_txt).html('正在上传...');
		obj.addClass('disable_button').attr('disabled',true).html('正在上传...');
		startUpload($('#'+target_form),function(data)
			{
				obj.removeClass('disable_button').attr('disabled',false).html(text);
				//if(typeof(status_txt)!="undefined") $('#'+status_txt).html('上传完成。');
				json_action(data);
			});
	});

	//对话框_bootstrap
	$(document).on("click",".dialogb",function(){
		var url,modal,post_data,dlg_title,dlg_width;
		var obj = $(this);
		modal = (typeof(obj.attr("data-modal"))==="undefined") ? 'edit_modal':obj.attr("data-modal");
		if(typeof(obj.attr("data-url"))==="undefined") 
		{
			alert("必须设置 data-url 参数，用于对话框显示");
			return;
		}
		url = obj.attr("data-url");
		if(typeof(obj.attr("data-param"))!=="undefined"){post_data = obj.attr('data-param');}
		$("#"+modal+" .modal-dialog").removeClass('modal-lg');
		if(typeof(obj.attr("data-dlg-width"))!=="undefined")
		{
			dlg_width = obj.attr('data-dlg-width');
			if(dlg_width==='lg'){$("#"+modal+" .modal-dialog").addClass('modal-lg');}
		}
		dlg_title = (typeof(obj.attr("data-dlg-title"))==="undefined") ? obj.text() : obj.attr('data-dlg-title');
		$("#"+modal+" .modal-title").html(dlg_title);
		$('.dialog_btn_ok').attr('disabled',false).html('确定');
		$("#"+modal+" .modal-body").load(url,post_data,function()
		{
			$("#"+modal).modal('show');
		});
	});
	$(document).on("click",".dialog_btn_ok",function()
	{
		var obj = $(this);
		var id = $(this).closest('.modal').attr('id');
		var text = obj.html();
		obj.addClass('disable_button').attr('disabled',true).html('正在提交');
		$.post($("#form_dlg").attr('action'), $("#form_dlg").serialize(), function(json)
		{
			obj.removeClass('disable_button').attr('disabled',false).html(text);
			if(json[0].err!=1) $("#"+id).modal('hide'); //dlg.dialog('close');
			json_action(json);
		},'json');
	});

	//提交表单
	$(document).on("click",".submit",function()
	{
		submit_form($(this).attr('data-submit-form'),$(this),false);
	});

	//ajax submit
	$(document).on("submit", "form.ajaxSubmit", function(event)
	{
		if(typeof($(this).attr("id"))!="undefined")
		{
			$reset=false;
			if(typeof($(this).attr("reset"))!="undefined")
				if($(this).attr("reset")==1)
					$reset=true;
			id=$(this).attr('id');
			submit_form(id,null,$reset);
		}
		else
			alert('form 必须设置 id 属性');
		return false;	
	});
	//ajax
	$(document).on("click",".ajax",function()
	{
		if(typeof($(this).attr("data-url"))=="undefined")
		{
			alert('data-url 必须设置');
			return;
		}
		var data=$(this).attr('data-param');
		var url_action=$(this).attr('data-url');
		$.ajax({type: "POST",dataType: 'json',url: url_action,data: data,
			success: function(json)
			{
				json_action(json);
			}
		});
	});

	//全选
	$(".select_all").change(function()
	{
		var target=$(this).attr('data-rel');
		if($(this).prop("checked")) // 全选
			$(target).prop("checked", true);
		else  // 取消全选
			$(target).prop("checked", false);
		//工具栏按钮
		disable_button();
	});
	//工具栏按钮的禁用启用
	$(document).on('change',".select_all_check",function(){disable_button();});
	//选择变化时
	$(document).on("change",".select",function()
	{
		$($(this).attr('data-target')).html($(this).children('option:selected').attr('data-rel'));
	});

	//bootstrap modal 显示前的处理
	$(".modal").on('show.bs.modal', function (e)
	{
		uploadButtonInit(".uploadFile_dlg");
		if($(this).find('.datepicker2').length>0)
		{
			$(".datepicker2").datepicker({
				format: "yyyy-mm-dd",
				language: "zh-CN",
				autoclose: true,
				todayHighlight: true
			});
		}
		//ckeditor
		$('textarea.ckeditor_tiny').each(function(){
			var placeholder = $(this).attr('placeholder');
			$(this).ckeditor({
				height: 380,
				removePlugins: 'Maximize,elementspath,resize,autogrow',
				editorplaceholder: placeholder,
				toolbar:
					[
						{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', '-', 'RemoveFormat' ,'TextColor', 'BGColor'] },
						{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList'] },
						{ name: 'paragraph2', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] }
					]
			});
		});
		$('textarea.ckeditor').each(function(){
			$(this).ckeditor({
				height: 380,
				removePlugins: 'Maximize,autogrow,Font',
				toolbar:
					[
						{ name: 'tools', items: [ 'Source' ] },
						{ name: 'document', items: [ 'Undo', 'Redo' ,'Find' ] },
						{ name: 'insert', items: [  'Image', 'Table', 'HorizontalRule'] },
						{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Subscript', 'Superscript', '-', 'RemoveFormat' ,'TextColor', 'BGColor'] },
						{ name: 'links', items: [ 'Link', 'Unlink'] },
						{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'] },
						{ name: 'paragraph2', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
						{ name: 'styles', items: [ 'Format', 'FontSize' ] },
						{ name: 'other', items: [ 'ShowBlocks'  ] }
					]
			});
		});
		$('textarea.ckeditor_pdf').each(function(){
			const imgUrl = "signin-print_img_upload.php?m=" + $('#m').val() + "&uid=" + $('#unique_id').val();
			$(this).ckeditor({
				height: 250,
				removePlugins: 'Maximize,autogrow',
				filebrowserImageUploadUrl: imgUrl,
				toolbar:
					[
						{ name: 'tools', items: [ 'Source' ] },
						{ name: 'document', items: [ 'Undo', 'Redo' ] },
						{ name: 'insert', items: [  'Image', 'Table', 'HorizontalRule'] },
						{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Subscript', 'Superscript', '-', 'RemoveFormat' ,'TextColor', 'BGColor'] },
						{ name: 'links', items: [ 'Link', 'Unlink'] },
						{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList'] },
						{ name: 'paragraph2', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
						{ name: 'other', items: [ 'ShowBlocks' ] },
						{ name: 'styles', items: [ 'Format', 'FontSize' ] }
					]
			});
		});
	})
	$('.modal').on('hidden.bs.modal', function (e)
	{
  		$(this).find('.modal-body').html('');
	});
});

function submit_form(form_name,button_obj,is_reset)
{
	var button_obj=arguments[1]?arguments[1]:null;
	var is_reset=arguments[2]?arguments[2]:false;
	more_data="";
	post_data=$("#"+form_name).serialize();
	action=$("#"+form_name).attr("action");
	if(button_obj!=null)
	{
		if(typeof(button_obj.attr("data-param"))!="undefined") more_data=button_obj.attr('data-param');
		if(more_data!="")post_data=post_data+"&"+more_data;
		if(typeof(button_obj.attr("data-status-txt"))!="undefined")
		{
			//button_obj.
		}
	}
	$.ajax(
	{
		type:"POST",dataType:'json',url:action,data:post_data,
		success:function(json)
		{	
			if(is_reset)$('#'+form_name)[0].reset();
			json_action(json);
		}
	});
}

function disable_button()
{
	var val='';
	var data;
	var myArray=new Array();
	var x;
	var result='';
	if($('.select_all_check:checked').length>0)
	{
		$(".disable_button").attr("disabled", false);
	}
	else
	{
		$(".disable_button").attr("disabled", true);
	}

	$('.select_all_check:checked').each(function()
	{ 
		if(val!='')val+=',';
		val+=$(this).val(); 
	});
	data=$(".disable_button").attr('data-param');
	if(data==undefined)
	{
		result='select_value='+val;
	}
	else
	{
		myArray=data.split("&");
		for (x in myArray)
		{
			if(myArray[x].indexOf("select_value")!=0)
			{
				if(result!='')result+='&';
				result+=myArray[x];
			}
		}
		if(result!='')result+='&';
		result+='select_value='+val;
	}
	$(".disable_button").attr('data-param',result);
}
	
//上传函数
function startUpload(jForm,onUploadComplete)
{
	var upload = new html4Upload(jForm,onUploadCallback);
	upload.start();

	function onUploadCallback(sText)
	{
		var data = Object;
		try{data = eval('('+sText+')');}catch(ex){};
		//data=JSON.parse(sText);
		if(data[0].err === undefined)
			alert(' 上传接口发生错误！\r\n\r\n返回的错误内容为: \r\n\r\n'+sText);
		else
			onUploadComplete(data);
		return true;
	}
}

function html4Upload(jForm,callback)
{
	var uid = new Date().getTime();
	var idIO='UploadiFrame'+uid;
	var self=this;
	var jIO=$('<iframe name="'+idIO+'" style="display:none" />').appendTo('body');
	jForm.attr('target',idIO);
	this.remove = function()
	{
		if(self !== null) self = null;
	}
	this.onLoad = function(){
		var ifmDoc = jIO[0].contentWindow.document;
		var result = $(ifmDoc.body).text();
		ifmDoc.write('');
		self.remove();
		callback(result);
	}
	this.start = function(){
		jForm.submit();
		jIO.on("load",function(){self.onLoad();});
	}
	return this;
}
//上传函数结束

function uploadButtonInit(selecter)
{
	//附件上传
	$(selecter).each(function()
	{
		this.addEventListener('change',function(event)
		{
			var url = $(this).attr('data-url');
			var info = $(this).attr('data-info');
			var size = $(this).attr('data-size');
			if(url === undefined){
				alert('data-url undefined');
				return false;
			}
			if(size === undefined) size=3;

			var file = event.target.files[0];
			if (file.size >= size*1024*1024)
			{
				alert("The allowed file size is "+size+"MB. ");
			}
			else
			{
				if(info !== undefined) $('#'+info).show().html('Uploading...');
				var formData = new FormData();
				formData.append('uploadFile', file);
				$.ajax({
					url: url,
					type: "POST",
					data: formData,
					dataType: 'json',
					contentType: false,	//必须false才会自动加上正确的Content-Type
					processData: false,	//必须false才会避开jQuery对 formdata 的默认处理 XMLHttpRequest会对 formdata 进行正确的处理
					success: function (data)
					{
						if(info !== undefined) $('#'+info).html('Upload success.');
						json_action(data);
					},
					error: function ()
					{
						alert("Upload error");
					}
				});
			}
			return false;
		});
	});
}

function json_action(json_val)
{
	for(var i=0; i<json_val.length; i++)
	{
		json = json_val[i];
		if(json.err===0 || json.err==='0')
		{
			window.location.reload();
		}
		else if(json.err===1 || json.err==='1' || json.err==='dlgError')
		{
			//$(json.field).html('<span class="ui-icon ui-icon-alert" style="float: left;"></span>'+json.msg).show();
			$(json.field).html(json.msg).slideDown('fast');
			if(json.errdiv!=='')$(json.errdiv).addClass('reg_input_err');
		}
		else if(json.err===2 || json.err==='2' || json.err==='append')
		{
			$(json.field).append(json.msg);
		}
		else if(json.err===3 || json.err==='3' || json.err==='replaceWith')
		{
			$(json.field).replaceWith(json.msg);
		}
		else if(json.err===4 || json.err==='4' || json.err==='redirect')
		{
			window.location.replace(json.msg);
		}
		else if(json.err===5 || json.err==='5')
		{
		}
		else if(json.err===6 || json.err==='6' || json.err==='html')
		{
			$(json.field).html(json.msg);
		}
		else if(json.err===7 || json.err==='7' || json.err==='load')
		{
			//$(json.field).load($(json.field).attr('data-url'));
			if(typeof($(json.field).attr("data-url"))!="undefined")
			{
				var url_7 = $(json.field).attr("data-url");
				var post_data_7 = '';
				if(typeof($(json.field).attr("data-param"))!="undefined")post_data_7 = $(json.field).attr('data-param');
				$('.dialog_frame').load(url_7,post_data_7);
			}
		}
		/*else if(json.err===12 || json.err==='12' || json.err==='load')
		{
			if(typeof($(json.field).attr("data-url"))!="undefined")
			{
				var url_12 = $(json.field).attr("data-url");
				var post_data_12 = '';
				if(typeof($(json.field).attr("data-param"))!="undefined") post_data_12 = $(json.field).attr('data-param');
				$(json.field).load(url_12, post_data_12);
			}
		}*/
		else if(json.err===8 || json.err==='8' || json.err==='prepend')
		{
			$(json.field).prepend(json.msg);
		}
		else if(json.err===9 || json.err==='9' || json.err==='dlgLoad')
		{
			if(typeof($(json.field).attr("data-url"))!="undefined")
			{
				var url_9 = $(json.field).attr("data-url");
				var post_data_9 = '';
				if(typeof($(json.field).attr("data-param"))!="undefined")post_data_9 = $(json.field).attr('data-param');
				$('.dialog_frame').load(url_9,post_data_9);
			}
		}
		else if(json.err===10 || json.err==='10' || json.err==='before')
		{
			$(json.field).before(json.msg);
		}
		else if(json.err===11 || json.err==='11')
		{
			$(json.field).animate({ width: "0"}, 500 ,function(){$(json.field).remove();});
		}
		else if(json.err===13 || json.err==='13' || json.err==='hide')
		{
			$(json.field).hide();
		}
		else if(json.err===14 || json.err==='14' || json.err==='show')
		{
			$(json.field).show();
		}	
		else if(json.err===15 || json.err==='15')
		{
			$(json.field)[0].reset();
		}	
		else if(json.err===16 || json.err==='16' || json.err==='removeClass')
		{
			$(json.field).removeClass(json.msg);
		}	
		else if(json.err===17 || json.err==='17' || json.err==='addClass')
		{
			$(json.field).addClass(json.msg);
		}	
		else if(json.err===19 || json.err==='19' || json.err==='attr')
		{
			$(json.field).attr(json.errdiv,json.msg);
		}
		else if(json.err===20 || json.err==='20' || json.err==='val')
		{
			$(json.field).val(json.msg);
		}
		else if(json.err==='css')
		{
			$(json.field).css(json.css,json.msg);
		}
		else if(json.err==='eval')
		{
			if(json.msg.length<12) eval(json.msg);
		}
		else if(json.err===101 || json.err==='101' || json.err==='showDlg')
		{
			$('#bs_modal_body').html(json.msg);
			$('#NotifyModal').modal('show');
		}	
		else if(json.err===102 || json.err==='102') //验证码
		{
			var s_code_time=60;
			$('#security_code').attr('disabled',true).removeClass('text-white').addClass('text-black').val('60 s');

			var timer = setInterval(function()
			{
				s_code_time--;
				$('#security_code').val(''+s_code_time+' s');
				if(s_code_time === 0)
				{
					s_code_time = 60;
					$('#security_code').attr('disabled',false).addClass('text-white').removeClass('text-black').val(json.msg);
					clearInterval(timer);
				}
			}, 1000);
		}	
		else if(json.err===103 || json.err==='103') //验证码
		{
			$('#security_code').attr('disabled',false).addClass('text-white').removeClass('text-black').val(json.msg);
		}	
		else if(json.err===104 || json.err==='104') //对话框
		{
			var url,modal,post_data,dlg_title,dlg_width;
			var obj = $(this);
			modal = 'edit_modal';
			url = json.msg;
			$("#"+modal+" .modal-dialog").removeClass('modal-lg');
			dlg_title = '';
			$("#"+modal+" .modal-title").html(dlg_title);
			$("#"+modal+" .modal-body").load(url,post_data,function()
			{
				$("#"+modal).modal('show');
			});
		}	
		else
		{
			$("body").html(json);
		}
	}
}

