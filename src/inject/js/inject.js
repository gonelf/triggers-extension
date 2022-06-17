chrome.extension.sendMessage({}, function(response) {
	var ab = true;
	var readyStateCheckInterval = setInterval(function() {
	function rgb2hex(rgb){
	 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	 return (rgb && rgb.length === 4) ? "#" +
	  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	}

	function create_delete(top, right, target){
		top-=17;
		right-=8;
		// console.log(browser.runtime.getURL("src/inject/img/delete.png"));
		return '<div id="delete" class="delete" style="top: '+top+'px; left: '+right+'px;"><img class="del" src="https://image.flaticon.com/icons/png/512/189/189690.png" /></div>';
	}

	function create_editor(top, left, width){
		top-=40;
		var mid = left+(width/2);
		var compicon = '<img id="fontcolor" class="icon fontcolor" src="https://image.flaticon.com/icons/png/512/51/51443.png" />'+
		'<div class="icon_separator">&nbsp;</div>'+
		'<img id="bgcolor" class="icon bgcolor" src="https://image.flaticon.com/icons/png/512/3597/3597168.png" />';

		return '<div id="editor" class="editor" style="top: '+top+'px; left: '+mid+'px;">'+
		'<input type="color" class="font-colorpicker colorpicker" id="font-colorpicker" value="#e66465">'+
		'<input type="color" class="bg-colorpicker colorpicker" id="bg-colorpicker" value="#e66465">'+compicon+'</div>';
	}

	function clean(){
		console.log("clean");
		$(".delete").remove();
		$(".editor").remove();
		if($(target) || target==null){
			$(target).attr("contenteditable", false);
			$(target).removeClass("select");
		}
	}

	// var page_edit_on = false;

	// var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

		var page_edit_on = false;

		var target=null, del=false, sel=false, option=false, fontcolor, bgcolor;
		$(document).on("click", "p, h1, h2, h3, h4, h5, h6, span, pre, button, a, div", function(e){
			//e.preventDefault();
			console.log(page_edit_on);
			if(page_edit_on){

				sel=true;
				e.stopPropagation();
				console.log("click select");
				clean();
				var top = $(this).offset().top;
				var left = $(this).offset().left;
				var width = $(this).width();
				$("body").append(create_delete(top, left+width));
				$("body").append(create_editor(top, left, width));
				$(this).addClass("select");
				$(this).attr("contenteditable", true);
				$(this).focus();
				target = this;
			}
		});

		$(document).on("focusout", ".select", function(e){
			if(page_edit_on){

				console.log("focusout");
				sel=false;
				setTimeout(function(){
					if(!sel && !option) {
						clean();
					}
					else {
						sel = false;
						option = false;
					}
				}, 150);
			}
		});

		$(document).on("click", ".delete", function(e){
			if(page_edit_on){

				console.log("delete");
				$(target).remove();
				clean();
				del=true;
			}
		});
		// font colorpicker
		$(document).on("input", ".font-colorpicker", function(e){
			if(page_edit_on){

				console.log("colorpicker change");
				var newcolor = e.target.value;
				console.log(newcolor);
				$(target).css("color", newcolor);
			}
		});

		$(document).on("change", ".font-colorpicker", function(e){
			if(page_edit_on){

				console.log("colorpicker close");
				$(target).focus();
			}
		});

		$(document).on("click", ".fontcolor", function(e){
			if(page_edit_on){

				fontcolor = $(target).css("color");
				option = true;
				console.log("font-colorpicker");
				console.log(fontcolor);
				console.log(rgb2hex(fontcolor));
				$("#font-colorpicker").val(rgb2hex(fontcolor));
				$("#font-colorpicker").click();
			}
		});
		// bg colorpicker
		$(document).on("input", ".bg-colorpicker", function(e){
			if(page_edit_on){

				console.log("bg-colorpicker change");
				var newcolor = e.target.value;
				console.log(newcolor);
				$(target).css("background-color", newcolor);
			}
		});

		$(document).on("change", ".bg-colorpicker", function(e){
			if(page_edit_on){

				console.log("bg-colorpicker close");
				$(target).focus();
			}
		});

		$(document).on("click", ".bgcolor", function(e){
			if(page_edit_on){

				bgcolor = $(target).css("background-color");
				option = true;
				console.log("bg-colorpicker");
				console.log(bgcolor);
				$("#bg-colorpicker").val(rgb2hex(bgcolor));
				$("#bg-colorpicker").click();
			}
		});
	}
	}, 10);
});
