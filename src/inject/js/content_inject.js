// chrome.extension.sendMessage({}, function(response) {
	// var readyStateCheckInterval = setInterval(function() {
	function rgb2hex(rgb){
	 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	 return (rgb && rgb.length === 4) ? "#" +
	  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	}

	function doUndo(){
	  document.execCommand('undo', false, null);
	}

	function doRedo(){
	  document.execCommand('redo', false, null);
	}

	function create_delete(top, right, target){
		top-=17;
		right-=8;
		// console.log(browser.runtime.getURL("src/inject/img/delete.png"));
		return '<div id="delete" class="delete" style="top: '+top+'px; left: '+right+'px;"><img class="del" src="'+icon_delete+'" /></div>';
	}

	function create_editor(top, left, width=0){
		// top-=40;
		// var mid = left+(width/2);
		var mid = left;
		// var compicon = '<img id="fontcolor" class="icon fontcolor" src="'+icon_text_color+'" />'+
		// '<div class="icon_separator">&nbsp;</div>'+
		// '<img id="bgcolor" class="icon bgcolor" src="'+icon_bucket+'" />';

		fontcolor = $(target).css("color");
		bgcolor =  $(target).css("background-color");
		link = $(target).attr("href");

		var show_link = '<input id="editor_link" class="editor_link" value="'+link+'"></input>'+
		'<input id="editor_remove_link" type="button" value="remove link"></input>';

		var add_link = '<input id="editor_add_link" type="button" value="add link"></input>';

		var link_code = (link != undefined) ? show_link : add_link;

		return '<div id="editor" class="editor" style="top: '+top+'px; left: '+mid+'px;">'+
		// '<div id="editor_header">'+
		// '<input id="editor_undo" class="editor_undo" type="button" value="Undo">'+
		// '<input id="" type="button" value="Redo">'+
		// '</div>'+
		'<h1>Editor</h1>'+
		'<h2>Link:</h2>'+
		link_code+
		'<h2>Font color:</h2>'+
		'<input type="color" class="font-colorpicker colorpicker" id="font-colorpicker" value="'+rgb2hex(fontcolor)+'">'+
		'<h2>Background color:</h2>'+
		'<input type="color" class="bg-colorpicker colorpicker" id="bg-colorpicker" value="'+rgb2hex(bgcolor)+'">'+
		'<div id="editor_footer" class="editor_footer">'+
		'<input type="button" id="editor_clone_item" class="editor_clone_item" value="Clone"></input>'+
		'<input type="button" id="editor_delete" class="editor_delete" value="Delete"></input>'+
		'<input type="button" id="editor_close" class="editor_close" value="Close"></input>'+
		'</div>'+
		'</div>';
	}

	function clean(){
		console.log("clean");
		// $(".editor").remove();
		$(".delete").remove();
		if($(target) && target!=null){
			$(target).attr("contenteditable", false);
			$(target).removeClass("select");
			target = null;
		}
	}

	function update_status(){
		switch (page_edit_change_status) {
			case "none":

				break;
			case "element":

				break;
			case "new_element":
				console.log("new_element");
				clean();
				page_edit_status = "element"
				break;
			case "unfocus":
				$("#editor").remove();
				clean();
				break;
			case "menu":

				break;
			case "delete":
				console.log("delete");
				clean();
				$("#editor").remove();
				page_edit_status = "none";
				break;
		}
		page_edit_change_status = "none";
	}

	var page_edit_on = false;
	var target=null, fontcolor, bgcolor;
	var page_edit_status = "none", page_edit_change_status = "none";
	var page_edit_status_interval;
	var page_edit_elements = ["editor", "delete"];
	var page_edit_alowed_page_elements = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "span", "pre", "button", "a", "div"];

	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

		page_edit_status_interval = setInterval(update_status, 10);

		$(document).on("click", "p, h1, h2, h3, h4, h5, h6, span, pre, button, a, div", function(e){
			//e.preventDefault();
			id = e.target.id;
			tag = $(e.target)[0].nodeName.toLowerCase();

			// console.log("page_edit_on", page_edit_on);
			// console.log("e.target.id", id);
			// console.log("e.target", tag);
			// console.log("page_edit_elements", page_edit_elements.includes(e.target.id));

			if(page_edit_on && !page_edit_elements.includes(id) && page_edit_alowed_page_elements.includes(tag)) {

				console.log("click select");

				e.stopImmediatePropagation();
				e.stopPropagation();
				e.preventDefault();
				page_edit_change_status = "new_element";
				update_status();

				var top = $(this).offset().top;
				var left = $(this).offset().left;
				var width = $(this).width();
				$(this).addClass("select");
				target = this;
				$("body").append(create_delete(top, left+width));
				$("body").append(create_editor(0, 0, width));
				$(this).attr("contenteditable", true);
				$(this).focus();
				// console.log("this", this);
				return false;
			}
		});

		// $(document).on("focusout", ".select", function(e){
		// 	if(page_edit_on){
		//
		// 		console.log("focusout");
		// 		page_edit_change_status = "unfocus";
		// 		update_status();
		// 	}
		// });

		$(document).on("click", ".delete, .editor_delete", function(e){
			if(page_edit_on){
				console.log("delete");
				console.log("target", target);
				$(target).remove();
				page_edit_change_status = "delete";
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

		$(document).on("input", ".editor_link", function(e){
			if(page_edit_on){
				console.log("link change");
				link = $("#editor_link")[0].value;
				$(target).attr("href", link);
			}
		});

		$(document).on("click", ".editor_clone_item", function(e){
			if(page_edit_on){
				console.log("clone click");
				console.log(target, "'"+copy+"'");
				var copy = $(target).clone();
				$(copy).attr("contenteditable", false);
				$(copy).removeClass("select");
				$(copy).insertAfter($(target));
			}
		});

		$(document).on("click", ".editor_close", function(e){
			if(page_edit_on){
				console.log("editor close");
				page_edit_change_status = "unfocus";
				update_status();
			}
		});

		$(document).on("click", ".editor_undo", function(e){
			if(page_edit_on){
				console.log("editor undo");
				doUndo();
			}
		});
	}
}, 10);
// });
