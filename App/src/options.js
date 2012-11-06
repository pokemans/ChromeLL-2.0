$(document).ready(function(){
    $('.options_navigation_link').click(function() {
		toLink = $(this).attr('id').split('_link')[0];
		
		selectedPage = $('.navbar-item-selected').attr("id").split('_link')[0];
		
		if( toLink == selectedPage ) {
			// Already on the page, clicking does not refresh the page!
			return true;
		}
		
		$('#' + selectedPage + '_link').removeClass("navbar-item-selected");
		$('#' + toLink + '_link').addClass("navbar-item-selected");
		
		$('#' + selectedPage + '_page').removeClass("shown").addClass("hidden");
		$('#' + toLink + '_page').removeClass("hidden").addClass("shown");
		
		if( toLink == "supersecretabout" ) {
			$('body').css("background-color", "#000");
		} else {
			$('body').css("background-color", "transparent");
		}
	});
    // restore config settings
    if(localStorage['ChromeLL-Config'] == '' || localStorage['ChromeLL-Config'] == undefined){
        console.log("Blank Config. Rebuilding");
        localStorage['ChromeLL-Config'] = '{"float_userbar":false,"short_title":true,"show_secret_boards":true,"dramalinks":false,"hide_dramalinks":false,"hide_dramalinks_topiclist":false,"user_info_popup":true,"zebra_tables":false,"force_https":false,"sys_notifications":true,"close_notifications":false,"ignorator":false,"enable_user_highlight":false,"ignorator_topiclist":false,"userhl_topiclist":false,"page_jump_buttons":true,"ignore_keyword":false,"enable_keyword_highlight":false,"click_expand_thumbnail":true,"imagemap_on_infobar":false,"resize_imgs":false,"user_notes":true,"ignorator_messagelist":false,"userhl_messagelist":false,"no_user_highlight_quotes":false,"notify_userhl_post":false,"notify_quote_post":false,"new_page_notify":false,"number_posts":true,"like_button":true,"loadquotes":true,"post_title_notification":true,"filter_me":false,"expand_spoilers":false,"highlight_tc":false,"label_tc":true,"foxlinks_quotes":false,"quickpost_tag_buttons":false,"quickpost_on_pgbottom":false,"post_before_preview":false,"batch_uploader":false,"drop_batch_uploader":true,"sort_history":false,"history_expand_search":false,"ignorator_topiclist_pm":false,"userhl_topiclist_pm":false,"page_jump_buttons_pm":true,"click_expand_thumbnail_pm":true,"user_notes_pm":false,"userhl_messagelist_pm":false,"pm_title_pm":true,"number_posts_pm":true,"loadquotes_pm":true,"post_title_notification_pm":true,"quickpost_tag_buttons_pm":false,"quickpost_on_pgbottom_pm":false,"post_before_preview_pm":false,"batch_uploader_pm":false,"drop_batch_uploader_pm":true,"debug":false,"zebra_tables_color":"D7DEE8","close_notification_time":"5","ignorator_list":"","ignore_keyword_list":"","":"0","img_max_width":"1440","tc_highlight_color":"ffff00","tc_label_color":"","foxlinks_quotes_color":"","user_highlight_data":{},"keyword_highlight_data":{}, "tag_highlight_data":{}}';
        if(localStorage['chromeLL_userhighlight'] && localStorage['chromeLL_userhighlight'] != '') restoreV1Cfg();
        else restoreConfig();
    }else{
        restoreConfig();
    }
});

function restoreConfig(){
    console.log('loading config');
    var config = JSON.parse(localStorage['ChromeLL-Config']);
    var checkboxes = $(":checkbox");
    for(var i in checkboxes){
        checkboxes[i].checked = config[checkboxes[i].id];
    }
    var textboxes = $(":text");
    for(var i in textboxes){
        if(textboxes[i].name && (textboxes[i].name.match('(user|keyword|tag)_highlight_') || textboxes[i].name.match('post_template'))){
            //console.log('found a textbox to ignore: ' + textboxes[i]);
        }else if(config[textboxes[i].id]){
            textboxes[i].value = config[textboxes[i].id];
        }
    }
    for(var j in config.user_highlight_data){
        document.getElementsByClassName('user_name')[document.getElementsByClassName('user_name').length - 1].value = j;
        document.getElementsByClassName('header_bg')[document.getElementsByClassName('header_bg').length - 1].value = config.user_highlight_data[j].bg;
        document.getElementsByClassName('header_color')[document.getElementsByClassName('header_color').length - 1].value = config.user_highlight_data[j].color;
        addUserHighlightDiv();
    }
    for(var j = 0; config.keyword_highlight_data[j]; j++){
        document.getElementsByClassName('keyword')[document.getElementsByClassName('keyword').length - 1].value = config.keyword_highlight_data[j].match;
        document.getElementsByClassName('keyword_bg')[document.getElementsByClassName('keyword_bg').length - 1].value = config.keyword_highlight_data[j].bg;
        document.getElementsByClassName('keyword_color')[document.getElementsByClassName('keyword_color').length - 1].value = config.keyword_highlight_data[j].color;
        addKeywordHighlightDiv();
    }
    for(var j = 0; config.tag_highlight_data[j]; j++){
        document.getElementsByClassName('tag')[document.getElementsByClassName('tag').length - 1].value = config.tag_highlight_data[j].match;
        document.getElementsByClassName('tag_bg')[document.getElementsByClassName('tag_bg').length - 1].value = config.tag_highlight_data[j].bg;
        document.getElementsByClassName('tag_color')[document.getElementsByClassName('tag_color').length - 1].value = config.tag_highlight_data[j].color;
        addTagHighlightDiv();
    }
    for(var j in config.post_template_data){
        document.getElementsByClassName('template_text')[document.getElementsByClassName('template_text').length - 1].value = config.post_template_data[j].text;
        document.getElementsByClassName('template_title')[document.getElementsByClassName('template_title').length - 1].value = j;
        addPostTemplateDiv();
    }
    //add a listener to add userhighlight boxes
    document.addEventListener('keyup', function(evt){
        if(!evt.target.name) return;
        if(evt.target.name == "user_highlight_username"){
            var datas = document.getElementById('user_highlight').getElementsByClassName('user_name');
            var empty = false;
            for(var i = 1; datas[i]; i++){
                if(datas[i].value == '') empty = true;
            }
            if(!empty) addUserHighlightDiv();
        }
        if(evt.target.name == "post_template_title"){
            var datas = document.getElementById('post_template').getElementsByClassName('template_title');
            var empty = false;
            for(var i = 1; datas[i]; i++){
                if(datas[i].value == '') empty = true;
            }
            if(!empty) addPostTemplateDiv();
        }
        if(evt.target.name == "keyword_highlight_keyword"){
            var datas = document.getElementById('keyword_highlight').getElementsByClassName('keyword');
            var empty = false;
            for(var i = 1; datas[i]; i++){
                if(datas[i].value == '') empty = true;
            }
            if(!empty) addKeywordHighlightDiv();
        }
        if(evt.target.name == "tag_highlight_keyword"){
            var datas = document.getElementById('tag_highlight').getElementsByClassName('tag');
            var empty = false;
            for(var i = 1; datas[i]; i++){
                if(datas[i].value == '') empty = true;
            }
            if(!empty) addTagHighlightDiv();
        }
    });
    
    // show version
    var app = chrome.app.getDetails();
    document.getElementById('version').innerText = app.version;
    document.getElementById('ignorator').addEventListener('click', ignoratorClick);
    document.getElementById('enable_user_highlight').addEventListener('click', highlightClick);
    document.getElementById('showcfg').addEventListener('click', showcfg);
    document.getElementById('loadcfg').addEventListener('click', loadcfg);
    setColorPicker();
    saveConfig();
}
function setColorPicker(){
    $('.color').ColorPicker({onChange: function(hsb, hex, rgb, el) {
        el.value = hex;
        saveConfig();
	},
    onSubmit: function(hsb, hex, rgb, el) {
		$(el).val(hex);
		$(el).ColorPickerHide();
        saveConfig();
	},
    livePreview: true,
    color: "",
    onBeforeShow: function () {
		$(this).ColorPickerSetColor(this.value);
	}});
}

$(document).change(saveConfig);
document.addEventListener('keyup', saveConfig);

function addUserHighlightDiv(){
    var ins = document.getElementById('user_highlight').getElementsByClassName('user_name')[0].parentNode.parentNode.cloneNode(true);
    ins.className = "user_highlight_data";
    ins.style.display = "block";
    document.getElementById('user_highlight').insertBefore(ins, null);
    setColorPicker();
}
function addKeywordHighlightDiv(){
    var ins = document.getElementById('keyword_highlight').getElementsByClassName('keyword')[0].parentNode.parentNode.cloneNode(true);
    ins.className = "keyword_highlight_data";
    ins.style.display = "block";
    document.getElementById('keyword_highlight').insertBefore(ins, null);
    setColorPicker();
}
function addTagHighlightDiv(){
    var ins = document.getElementById('tag_highlight').getElementsByClassName('tag')[0].parentNode.parentNode.cloneNode(true);
    ins.className = "tag_highlight_data";
    ins.style.display = "block";
    document.getElementById('tag_highlight').insertBefore(ins, null);
    setColorPicker();
}
function addPostTemplateDiv(){
    var ins = document.getElementById('post_template').getElementsByClassName('template_text')[0].parentNode.parentNode.cloneNode(true);
    ins.className = "post_template_data";
    ins.style.display = "block";
    document.getElementById('post_template').insertBefore(ins, null);
}
function saveConfig(){
    var cfg = JSON.parse(localStorage['ChromeLL-Config']);
    inputs = $(":checkbox");
    for(var i in inputs){
        cfg[inputs[i].id] = inputs[i].checked;
    }
    var textboxes = $(":text");
    for(var i in textboxes){
        if(textboxes[i].name && textboxes[i].name.match('user_highlight_')){
            //textboxes[i].ColorPicker();
        }else{
            cfg[textboxes[i].id] = textboxes[i].value;
        }
    }
    var userhlData = document.getElementById('user_highlight').getElementsByClassName('user_highlight_data');
    var name;
    cfg.user_highlight_data = {};
    for(var i = 0; userhlData[i]; i++){
        name = userhlData[i].getElementsByClassName('user_name')[0].value.toLowerCase();
        if(name != ''){
            cfg.user_highlight_data[name] = {};
            cfg.user_highlight_data[name].bg = userhlData[i].getElementsByClassName('header_bg')[0].value;
            userhlData[i].getElementsByClassName('user_name')[0].style.background = '#' + cfg.user_highlight_data[name].bg;
            cfg.user_highlight_data[name].color = userhlData[i].getElementsByClassName('header_color')[0].value;
            userhlData[i].getElementsByClassName('user_name')[0].style.color = '#' + cfg.user_highlight_data[name].color;
        }
    }
    userhlData = document.getElementById('keyword_highlight').getElementsByClassName('keyword_highlight_data');
    cfg.keyword_highlight_data = {};
    var j = 0;
    for(var i = 0; userhlData[i]; i++){
        name = userhlData[i].getElementsByClassName('keyword')[0].value.toLowerCase();
        if(name != ''){
            cfg.keyword_highlight_data[j] = {};
            cfg.keyword_highlight_data[j].match = name;
            cfg.keyword_highlight_data[j].bg = userhlData[i].getElementsByClassName('keyword_bg')[0].value;
            userhlData[i].getElementsByClassName('keyword')[0].style.background = '#' + cfg.keyword_highlight_data[j].bg;
            cfg.keyword_highlight_data[j].color = userhlData[i].getElementsByClassName('keyword_color')[0].value;
            userhlData[i].getElementsByClassName('keyword')[0].style.color = '#' + cfg.keyword_highlight_data[j].color;
            j++;
        }
    }
    userhlData = document.getElementById('tag_highlight').getElementsByClassName('tag_highlight_data');
    cfg.tag_highlight_data = {};
    var j = 0;
    for(var i = 0; userhlData[i]; i++){
        name = userhlData[i].getElementsByClassName('tag')[0].value.toLowerCase();
        if(name != ''){
            cfg.tag_highlight_data[j] = {};
            cfg.tag_highlight_data[j].match = name;
            cfg.tag_highlight_data[j].bg = userhlData[i].getElementsByClassName('tag_bg')[0].value;
            userhlData[i].getElementsByClassName('tag')[0].style.background = '#' + cfg.tag_highlight_data[j].bg;
            cfg.tag_highlight_data[j].color = userhlData[i].getElementsByClassName('tag_color')[0].value;
            userhlData[i].getElementsByClassName('tag')[0].style.color = '#' + cfg.tag_highlight_data[j].color;
            j++;
        }
    }
    var userhlData = document.getElementById('post_template').getElementsByClassName('post_template_data');
    cfg.post_template_data = {};
    for(var i = 0; userhlData[i]; i++){
        name = userhlData[i].getElementsByClassName('template_title')[0].value;
        if(name != ''){
            cfg.post_template_data[name] = {};
            cfg.post_template_data[name].text = userhlData[i].getElementsByClassName('template_text')[0].value;
        }
    }
    cfg.last_saved = new Date().getTime();
    localStorage['ChromeLL-Config'] = JSON.stringify(cfg);
    allBg.init_listener(cfg);
}

function restoreV1Cfg(oC){
    var cfg = JSON.parse(localStorage['ChromeLL-Config']);
    var hls = oC.conf['chromeLL_userhighlight'].split(';');
    var hl = Array();
    cfg.user_highlight_data = {};
    for(var i = 0; hls[i]; i++){
        hl = hls[i].split(':');
        console.log(hl[0]);
        cfg.user_highlight_data[hl[0]] = {};
        cfg.user_highlight_data[hl[0]].bg = hl[1];
        cfg.user_highlight_data[hl[0]].color = hl[3];
    }
    var boolSettings = {"force_https":"chromeLL_forcehttps",
                        "short_title":"chromeLL_shorttitle",
                        "float_userbar":"chromeLL_floatbars",
                        "ignorator":"chromeLL_ignoretopicsbyon",
                        "ignorator_list":"chromeLL_ignoretopicsby",
                        "enable_user_highlight":"chromeLL_userhighlighton",
                        "number_posts":"chromeLL_numberposts",
                        "enable_user_highlight":"chromeLL_userhighlighton"}
    for(var i in boolSettings){
        if(oC.conf[i] == "true") cfg[i] = true;
    }
    cfg.ignorator_list = oC.conf['chromeLL_ignoretopicsby'];
    cfg.ignore_keyword_list = oC.conf['chromeLL_ignoretopics'];
    cfg.last_saved = new Date().getTime();
    console.log(cfg);
    localStorage['ChromeLL-Config'] = JSON.stringify(cfg);                   
}
function ignoratorClick(evt){
    document.getElementById('ignorator_messagelist').checked = evt.target.checked;
    document.getElementById('ignorator_topiclist').checked = evt.target.checked;
    saveConfig();
}
function highlightClick(evt){
    document.getElementById('userhl_messagelist').checked = evt.target.checked;
    document.getElementById('userhl_topiclist').checked = evt.target.checked;
    saveConfig();
}
function showcfg(){
    document.getElementById('cfg_ta').value = localStorage['ChromeLL-Config'];
}
function loadcfg(){
    if(document.getElementById('cfg_ta').value != ''){
        try{
            var newCfg = JSON.parse(document.getElementById('cfg_ta').value);
            var myCfg = JSON.parse(localStorage['ChromeLL-Config']);
            for(var i in newCfg){
                myCfg[i] = newCfg[i];
            }
            myCfg.last_saved = new Date().getTime();
            localStorage['ChromeLL-Config'] = JSON.stringify(myCfg);
        }catch(e){
            console.log('This doesnt look like a config', e);
            restoreV1Cfg(decodeBase64(document.getElementById('cfg_ta').value));
        }
        location.reload();
    }
}
function decodeBase64(cfg){
	var Base64 = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
	}
	return JSON.parse(Base64.decode(cfg));
}