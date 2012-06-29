var board = Array();
var cfg, currentTab;
var drama = {};
var tabPorts = {};
var ignoratorInfo = {};
var scopeInfo = {};
var defaultConfig = '{"float_userbar":false,"short_title":true,"show_secret_boards":true,"dramalinks":false,"hide_dramalinks":false,"hide_dramalinks_topiclist":false,"user_info_popup":true,"zebra_tables":false,"force_https":false,"sys_notifications":true,"close_notifications":false,"ignorator":false,"enable_user_highlight":false,"ignorator_topiclist":false,"userhl_topiclist":false,"page_jump_buttons":true,"ignore_keyword":false,"enable_keyword_highlight":false,"click_expand_thumbnail":true,"imagemap_on_infobar":false,"resize_imgs":false,"user_notes":true,"ignorator_messagelist":false,"userhl_messagelist":false,"no_user_highlight_quotes":false,"notify_userhl_post":false,"notify_quote_post":false,"new_page_notify":false,"number_posts":true,"like_button":true,"loadquotes":true,"post_title_notification":true,"filter_me":false,"expand_spoilers":false,"highlight_tc":false,"label_tc":true,"foxlinks_quotes":false,"quickpost_tag_buttons":false,"quickpost_on_pgbottom":false,"post_before_preview":false,"batch_uploader":false,"drop_batch_uploader":true,"sort_history":false,"history_expand_search":false,"ignorator_topiclist_pm":false,"userhl_topiclist_pm":false,"page_jump_buttons_pm":true,"click_expand_thumbnail_pm":true,"user_notes_pm":false,"userhl_messagelist_pm":false,"pm_title_pm":true,"number_posts_pm":true,"loadquotes_pm":true,"post_title_notification_pm":true,"quickpost_tag_buttons_pm":false,"quickpost_on_pgbottom_pm":false,"post_before_preview_pm":false,"batch_uploader_pm":false,"drop_batch_uploader_pm":true,"debug":false,"zebra_tables_color":"D7DEE8","close_notification_time":"5","ignorator_list":"","ignore_keyword_list":"","":"0","img_max_width":"1440","tc_highlight_color":"ffff00","tc_label_color":"","foxlinks_quotes_color":"","user_highlight_data":{},"keyword_highlight_data":{},"context_menu":true}';

if(localStorage['ChromeLL-Config'] == undefined){
    localStorage['ChromeLL-Config'] = defaultConfig;
}
cfg = JSON.parse(localStorage['ChromeLL-Config']);

// Set config defaults on upgrade
function upgradeConfig(){
    var configJS = JSON.parse(defaultConfig);
    for(var i in configJS){
        if(cfg[i] === undefined){
            cfg[i] = configJS[i];
            console.log("upgrade diff!", i, cfg[i]);
        }
    }
    localStorage['ChromeLL-Config'] = JSON.stringify(cfg);
}
upgradeConfig();

if(localStorage['ChromeLL-TCs'] == undefined) localStorage['ChromeLL-TCs'] = "{}";

var app = chrome.app.getDetails();
if(localStorage['ChromeLL-Version'] != app.version && localStorage['ChromeLL-Version'] != undefined && cfg.sys_notifications){
    console.log('ChromeLL updated! Old v: ' + localStorage['ChromeLL-Version'] + " New v: " + app.version);
    var notification = webkitNotifications.createNotification(
                    'Style/images/lueshi_48.png',
                    "ChromeLL has been updated",
                    'Old v: ' + localStorage['ChromeLL-Version'] + " New v: " + app.version);
    notification.show();
    localStorage['ChromeLL-Version'] = app.version;
}
if(localStorage['ChromeLL-Version'] == undefined){
    localStorage['ChromeLL-Version'] = app.version;
}
if(cfg.sort_history){
    boards['Misc.']['Message History'] = 'http://boards.endoftheinter.net/history.php?b';
}

function buildContextMenu(){
    board = null;
    board = Array();
    var id;
    var menu = chrome.contextMenus.create({"title": "ETI", "contexts":["page", "image"] });
    chrome.contextMenus.create({"title": "Transload image", "parentId": menu, "onclick":imageTransloader, "contexts":["image"]});
    for(var i in boards){
        if(boards[i] != boards[0]){
            chrome.contextMenus.create({"type":"separator", "parentId":menu, "contexts":["page", "image"]});
        }
        for(var j in boards[i]){
            id = chrome.contextMenus.create({"title": j, "parentId": menu, "onclick":handleContext, "contexts":["page", "image"]});
            board[id] = boards[i][j];
        }
    }
}

function handleContext(info){
    if(board[info.menuItemId] % 1 === 0){
        chrome.tabs.create({"url":"http://boards.endoftheinter.net/showtopics.php?board=" + board[info.menuItemId]});
    }else{
        var url = board[info.menuItemId].replace("%extension%", chrome.extension.getURL("/"));
        chrome.tabs.create({"url":url});
    }
}
function getDrama() {
    if(cfg.debug) console.log('fetching dramalinks from wiki...');
    var dramas;
    var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://wiki.endoftheinter.net/index.php?title=Dramalinks/current&action=raw&section=0&maxage=30", true);	
    xhr.withCredentials = "true";
	xhr.send();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4) {
			var t = xhr.responseText;
            t=t.replace(/\[\[(.+?)(\|(.+?))\]\]/g,"<a href=\"http://wiki.endoftheinter.net/index.php/$1\">$3</a>");
			t=t.replace(/\[\[(.+?)\]\]/g,"<a href=\"http://wiki.endoftheinter.net/index.php/$1\">$1</a>");
			t=t.replace(/\[(.+?)\]/g,"<a href=\"$1\" style=\"padding-left: 0px\"><img src=\"http://wiki.endoftheinter.net/skins/monobook/external.png\"></a>");
			t=t.replace(/href="\/index\.php/g,"href=\"http://wiki.endoftheinter.net/index.php");
			t=t.replace(/style=/gi,"");
			t=t.replace(/<script/gi,"<i");
			t=t.replace(/(on)([A-Za-z]*)(=)/gi,"");
			t=t.slice(t.indexOf("<!--- NEW STORIES GO HERE --->")+29);
			dramas=t.slice(0,t.indexOf("<!--- NEW STORIES END HERE --->"));
			t=t.slice(t.indexOf("<!--- CHANGE DRAMALINKS COLOR CODE HERE --->"));
			t=t.slice(t.indexOf("{{")+2);
			var bgcol=t.slice(0,t.indexOf("}}"));
			var col;
			var kermit=false;
			switch (bgcol.toLowerCase()){
                case "kermit":
                    document.getElementById("dramalinks_ticker").style.border="2px solid #990099";
					bgcol="black";
					kermit=true;
                case "black":
				case "blue":
				case "green":
                    col="white";
					break;
                default:
					col="black";
					break;
			}
            if (!kermit)				{
				dramas="<span style='text-transform:capitalize'>Current Dramalinks Level: <font color='" + bgcol + "'>" + bgcol + "</font></span><div style='background-color: "+bgcol+"; color: "+col+";'>" + dramas.slice(2).replace(/\*/g,"&nbsp;&nbsp;&nbsp;&nbsp;")+"</div>";
            }else{
                dramas="Current Dramalinks Level: <blink><font color='" + bgcol + "'>CODE KERMIT</font></blink><div style='background-color: "+bgcol+"; color: "+col+";'>" + dramas.slice(2).replace(/\*/g,"&nbsp;&nbsp;&nbsp;&nbsp;")+"</div>";
            }
            drama.txt = dramas;
            drama.time = parseInt(new Date().getTime() + (1800 * 1000));
        }
    }
    //return drama;
}
if(cfg.context_menu) buildContextMenu();
function handleHttpsRedirect(dest){
    return { redirectUrl: dest.url.replace(/^http:/i, "https:")}
}

for(var i in allBg.activeListeners){
    allBg.activeListeners[i] = cfg[i];
    console.log('setting listener: ' + i + " " + allBg.activeListeners[i]);
}
allBg.init_listener(cfg);
chrome.tabs.onActivated.addListener(function(tab){
    if(!tabPorts[tab.tabId]) return;
    currentTab = tab.tabId;
    //console.log(tabPorts, tab.tabId, tabPorts[tab.tabId]);
    //console.log(tabPorts);
    tabPorts[tab.tabId].postMessage({action: 'focus_gained'});
    tabPorts[tab.tabId].postMessage({action: 'ignorator_update'});
});
chrome.tabs.onRemoved.addListener(function(tab){
    if(tabPorts[tab.tabId]){
        delete tabPorts[tab.tabId];
        delete ignoratorInfo[tab.tabId];
        delete scopeInfo[tab.tabId];
    }
});
chrome.extension.onConnect.addListener(function(port){
    tabPorts[port.sender.tab.id] = {};
    tabPorts[port.sender.tab.id] = port;
    tabPorts[port.sender.tab.id].onMessage.addListener(function(msg){ messagePort.handleIgnoratorMsg(port.sender.tab.id, msg);});
});
var messagePort = {
    handleIgnoratorMsg: function(tab, msg){
        switch(msg.action){
            case "ignorator_update":
                ignoratorInfo[tab] = msg.ignorator;
                scopeInfo[tab] = msg.scope;
                if(msg.ignorator.total_ignored > 0){
                    chrome.browserAction.setBadgeBackgroundColor({tabId: tab, color: "#ff0000"});
                    chrome.browserAction.setBadgeText({tabId: tab, text: "" + msg.ignorator.total_ignored});
                }
                break;
            default:
                console.log('no', msg);
                break;
        }
    }
}

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        switch(request.need){
            case "config":
                cfg = JSON.parse(localStorage['ChromeLL-Config']);
                if(request.sub){
                    sendResponse({"data": cfg[request.sub]});
                }else if(request.tcs){
                    var tcs = JSON.parse(localStorage['ChromeLL-TCs']);
                    sendResponse({"data": cfg, "tcs": tcs});
                }else{
                    sendResponse({"data": cfg});
                }
                break;
            case "save":
                if(request.name === "tcs"){
                    localStorage['ChromeLL-TCs'] = JSON.stringify(request.data);
                }else{
                    cfg[request.name] = request.data;
                    localStorage['ChromeLL-Config'] = JSON.stringify(cfg);
                }
                if(cfg.debug) console.log('saving ', request.name, request.data);
                break;
            case "notify":
                var notification = webkitNotifications.createNotification(
                    'Style/images/lueshi_48.png',
                    request.title,
                    request.message);
                notification.show();
                if(cfg.close_notifications){
                    setTimeout(function(){notification.cancel();}, (parseInt(cfg.close_notification_time) * 1000));
                }
                break;
            case "dramalinks":
                var time = parseInt(new Date().getTime());
                if(drama.time && (time < drama.time)){
                    if(cfg.debug) console.log('returning cached dramalinks. cache exp: ' + drama.time + ' current: ' + time);
                    sendResponse({"data": drama.txt});
                }else{
                    getDrama();
                    sendResponse({"data":drama.txt});
                }
                break;
            case "insertcss":
                if(cfg.debug) console.log('inserting css ', request.file);
                chrome.tabs.insertCSS(sender.tab.id, {file: request.file});
                sendResponse({});
                break;
            case "opentab":
                if(cfg.debug) console.log('opening tab ', request.url);
                chrome.tabs.create({url: request.url});
                break;
            case "getIgnored":
                chrome.tabs.getSelected(function(tab){
                    sendResponse({"ignorator": ignoratorInfo[tab.id], "scope": scopeInfo[tab.id]});
                });
                break;
            case "showIgnorated":
                chrome.tabs.getSelected(function(tab){
                    tabPorts[tab.id].postMessage({action: 'showIgnorated', ids: request.ids});
                });
                if(cfg.debug) console.log('showing hidden data', request);
                break;
            default:
                if(cfg.debug) console.log("Error in request listener - undefined parameter?", request);
                break;
        }
    });
