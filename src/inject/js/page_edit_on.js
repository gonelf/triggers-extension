console.log("page_edit_on", page_edit_on);
page_edit_on = true;
var boxes = "<box id='edit_box_left' class='edit_box edit_box_left'>&nbsp;</box>"+
"<box id='edit_box_top' class='edit_box_top edit_box'>&nbsp;</box>"+
"<box id='edit_box_bottom' class='edit_box_bottom edit_box'>&nbsp;</box>"+
"<box id='edit_box_right' class='edit_box_right edit_box'>&nbsp;</box>";
jq("body").append(boxes);
// jq("body").css("box-shadow", "inset 0px 0px 10px #800080");

var data = {"target":"msg_to_triggers", "data":{"id":triggers_ext_id, "msg": "oi"}};
var destination = document.getElementById("triggers_init").contentWindow;
destination.postMessage(data,'*');
