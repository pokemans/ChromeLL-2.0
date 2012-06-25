var config = {};
var allPages = {
    remove_links: function(){
        var allowed = ["endoftheinter.net", "boards.endoftheinter.net", "wiki.endoftheinter.net", "archives.endoftheinter.net"];
        var menuSep = " | "
        var menuBar = document.getElementsByClassName("menubar")[0];
        var currentLinks = menuBar.getElementsByTagName("a");
        var newLinks = [];
        for (var index in currentLinks) {
            var link = currentLinks[index];
            for(var i = 0; allowed[i]; i++){
                var re = new RegExp("^http(s)?:\/\/" + allowed[i] + "(.*)", "i");
                if (link.href && link.href.match(re)){
                    newLinks.push(link);
                }
            }
        }
        while (menuBar.firstChild != null) {
            menuBar.removeChild(menuBar.firstChild);
        }
        for (var index in newLinks){
            var link = newLinks[index];
            if (menuBar.firstChild != null) {
                var textNode = document.createTextNode(menuSep);
                menuBar.appendChild(document.createTextNode(menuSep))
            }
            menuBar.appendChild(link);
        }
    },
    float_userbar: function(){
        var id = document.createElement('div');
        var userbar = document.getElementsByClassName('userbar')[0];
        var menubar = document.getElementsByClassName('menubar')[0];
        document.getElementsByClassName('body')[0].removeChild(userbar);
        document.getElementsByClassName('body')[0].removeChild(menubar);
        id.insertBefore(menubar, null);
        id.insertBefore(userbar, null);
        id.style.position = 'fixed';
        id.style.width = '100%';
        id.style.top = '0';
        userbar.style.marginTop = '-2px';
        userbar.style.borderBottomLeftRadius = '5px';
        userbar.style.borderBottomRightRadius = '5px';
        config.remove_links ? document.getElementsByTagName('h1')[0].style.paddingTop = '20px' : document.getElementsByTagName('h1')[0].style.paddingTop = '40px';
        document.getElementsByClassName('body')[0].insertBefore(id, null);
    },
    float_userbar_bottom: function(){
        document.getElementsByClassName('menubar')[0].style.position = "fixed";
        document.getElementsByClassName('menubar')[0].style.width = "99%";
        document.getElementsByClassName('menubar')[0].style.bottom = "-2px";
        document.getElementsByClassName('userbar')[0].style.position = "fixed";
        document.getElementsByClassName('userbar')[0].style.borderTopLeftRadius = '5px';
        document.getElementsByClassName('userbar')[0].style.borderTopRightRadius = '5px';
        document.getElementsByClassName('userbar')[0].style.width = "99%";
        document.getElementsByClassName('userbar')[0].style.bottom = "33px";
        document.getElementsByClassName('menubar')[0].style.marginRight = "20px";
        document.getElementsByClassName('menubar')[0].style.zIndex = '2';
        document.getElementsByClassName('userbar')[0].style.zIndex = '2';
    },
    short_title: function(){
        document.title = document.title.replace(/End of the Internet - /i, '');
    },
    user_info_popup: function(){
        chrome.extension.sendRequest({need: "insertcss", file:"Style/css/arrowbox.css"}, function(r){
            var links = ["PM", "GT", "BT", "STATS", "HIGHLIGHT", "UNHIGHLIGHT", "IGNORATE"];
            var popup = document.createElement('div');
            popup.id = "user-popup-div";
            var info = document.createElement('div');
            info.id = 'popup_info';
            var user = document.createElement('div');
            user.id = 'popup_user';
            for(var i = 0; links[i]; i++){
                var ins = document.createElement('span');
                ins.className = 'popup_link';
                ins.innerHTML = links[i];
                ins.addEventListener('click', commonFunctions.popupClick);
                info.insertBefore(ins, null);
            }
            popup.insertBefore(user, null);
            popup.insertBefore(info, null);
            document.body.insertBefore(popup, null);
            document.body.addEventListener('dblclick', commonFunctions.handlePopup);
            document.addEventListener('click', function(e){ if(e.target.className != 'popup_link') commonFunctions.hidePopup(e) });
            /*try{
                var arrow, arrow_user;
                for(var i = 1; document.getElementsByTagName('tr')[i]; i++){
                    arrow = document.createElement('span');
                    arrow.className = "arrow";
                    arrow_user = document.createElement('span');
                    arrow_user.className = "arrow";
                    document.getElementsByTagName('tr')[i].getElementsByTagName('td')[0].insertBefore(arrow, document.getElementsByTagName('tr')[i].getElementsByTagName('td')[0].getElementsByTagName('a')[0]);
                    document.getElementsByTagName('tr')[i].getElementsByTagName('td')[1].insertBefore(arrow_user, document.getElementsByTagName('tr')[i].getElementsByTagName('td')[1].getElementsByTagName('a')[0]);
                }
            }catch(e){
            }*/
        });
    },
    dramalinks: function(){
        if(config.hide_dramalinks_topiclist && !window.location.href.match('showtopics')) return;
        commonFunctions.getDrama();
    }
}

var commonFunctions = {
    foxlinks_quote: function(){
        var mcol = "#" + config['foxlinks_quotes_color'];
        var m = document.getElementsByClassName('quoted-message');
        var n;
        for(var i = 0; m[i]; i++){
			m[i].style.borderStyle = 'solid';
            m[i].style.borderWidth = '2px';
            m[i].style.borderRadius = '5px';
            m[i].style.marginRight = '30px';
            m[i].style.marginLeft = '10px';
            m[i].style.paddingBottom = '10px';
            m[i].style.marginTop = '0px';
            m[i].style.borderColor = mcol;
            n = m[i].getElementsByClassName('message-top')[0];
            if(n){
                if(n.style.background == ''){
                    n.style.background = mcol;
                }else{
                    m[i].style.borderColor = n.style.background;
                }
                n.style.marginTop = '0px';
                n.style.paddingBottom = '2px';
                n.style.marginLeft = '-6px';
            }
        }
    },
    asyncUpload: function(tgt, i){
        if(!i) var i = 0;
        var xh = new XMLHttpRequest();
        xh.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                var tmp = document.createElement('div');
                tmp.innerHTML = this.responseText;
                var update_ul;
                if(window.location.href.match('postmsg')){
                    update_ul = document.getElementsByTagName('form')[0].getElementsByTagName('b')[2];
                }else{
                    update_ul = document.getElementsByClassName('quickpost-body')[0].getElementsByTagName('b')[0];
                }
                var current = update_ul.innerHTML.match(/Uploading: (\d+)\/(\d+)\)/);
                if(tmp.getElementsByClassName('img')[0].getElementsByTagName('input')[0].value){		
                    if(tmp.getElementsByClassName('img')[0].getElementsByTagName('input')[0].value.substring(0, 4) == '<img'){
                        commonFunctions.quickReplyInsert(tmp.getElementsByClassName('img')[0].getElementsByTagName('input')[0].value);
                        if((i + 1) == current[2]){
                            update_ul.innerHTML = "Your Message";
                        }else{
                            update_ul.innerHTML = "Your Message (Uploading: " + (i + 2) + "/" + current[2] + ")";
                        }
                    }
                }
                i++;
                if(i < tgt.length){
                    commonFunctions.asyncUpload(tgt, i);
                }
            }
        };
        var http = 'https';
        if(window.location.href.indexOf('https:') == -1) http = 'http';
        xh.open('post', http + '://u.endoftheinter.net/u.php', true);
        var formData = new FormData();
        formData.append('file',tgt[i]);
        xh.withCredentials = "true";
        xh.send(formData);
	},
    handlePopup: function(evt){
        try{
            var user = false;
            if(evt.target.parentNode.parentNode.parentNode.parentNode.className === "message-container"){
                user = evt.target.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('a')[0];
            }else{
                user = evt.target.getElementsByTagName('a')[0];
            }
            commonFunctions.currentUser = user.innerHTML;
            commonFunctions.currentID = user.href.match(/user=(\d+)/)[1];
            var gs = '';
            if (commonFunctions.currentID > 22682) {
                gs = ' (gs)\u2076';
            }
            else if (commonFunctions.currentID > 21289) {
                gs = ' (gs)\u2075';
            }
            else if (commonFunctions.currentID > 20176) {
                gs = ' (gs)\u2074';
            }
            else if (commonFunctions.currentID > 15258) {
                gs = ' (gs)\u00B3';
            }
            else if (commonFunctions.currentID > 13498) {
                gs = ' (gs)\u00B2';
            }
            else if (commonFunctions.currentID > 10088) {
                gs = ' (gs)';
            }
            document.getElementById('popup_user').innerHTML = commonFunctions.currentUser + gs + ' <span class="popup_uid">' + commonFunctions.currentID + '</span>';
            var mTop = 10;
            var mLeft = -35;
            document.getElementById('user-popup-div').style.top = (evt.pageY + mTop) + "px";
            document.getElementById('user-popup-div').style.left = (evt.pageX + mLeft) + "px";
            document.getElementById('user-popup-div').style.display = 'block';
            if (document.selection)
                document.selection.empty();
            else if (window.getSelection)
                window.getSelection().removeAllRanges();
            
        }catch(e){
            //ignore - element not useful for user data
        }
    },
    hidePopup: function(){
        document.getElementById('user-popup-div').style.display = 'none';
    },
    popupClick: function(evt){
        var type = evt.target.innerHTML;
        if(config.debug) console.log(type, commonFunctions.currentUser);
        switch(type){
            case "IGNORATE?":
                if(!config.ignorator_list || config.ignorator_list == ''){
                    config.ignorator_list = commonFunctions.currentUser;
                }else{
                    config.ignorator_list += ", " + commonFunctions.currentUser;
                }
                chrome.extension.sendRequest({need:"save", name:"ignorator_list", data:config.ignorator_list});
                if(typeof(messageList) != 'undefined') messageList.ignorator_messagelist();
                else topicList.ignorator_topiclist();
                commonFunctions.hidePopup();
                evt.target.innerHTML = "IGNORATE";
                break;
            case "IGNORATE":
                evt.target.innerHTML = "IGNORATE?";
                break;
            case "PM":
                chrome.extension.sendRequest({need:"opentab", url:"http://endoftheinter.net/postmsg.php?puser=" + commonFunctions.currentID});
                commonFunctions.hidePopup();
                break;
            case "GT":
                chrome.extension.sendRequest({need:"opentab", url:"http://endoftheinter.net/token.php?type=2&user=" + commonFunctions.currentID});
                commonFunctions.hidePopup();
                break;
            case "BT":
                chrome.extension.sendRequest({need:"opentab", url:"http://endoftheinter.net/token.php?type=1&user=" + commonFunctions.currentID});
                commonFunctions.hidePopup();
                break;
            case "STATS":
                chrome.extension.sendRequest({need:"opentab", url:"http://endoftheinter.net/loser.php?userid=" + commonFunctions.currentID});
                commonFunctions.hidePopup();
                break;
            case "HIGHLIGHT":
                var user = commonFunctions.currentUser.toLowerCase();
                config.user_highlight_data[user] = {};
                config.user_highlight_data[user].bg = Math.floor(Math.random()*16777215).toString(16);
                config.user_highlight_data[user].color = Math.floor(Math.random()*16777215).toString(16);
                chrome.extension.sendRequest({need:"save", name:"user_highlight_data", data:config.user_highlight_data});
                if(typeof(messageList) != 'undefined'){
                    messageList.userhl_messagelist();
                    if(config.foxlinks_quotes) commonFunctions.foxlinks_quote();
                }
                else{
                    topicList.userhl_topiclist();
                }
                break;
            case "UNHIGHLIGHT":
                delete config.user_highlight_data[commonFunctions.currentUser.toLowerCase()];
                chrome.extension.sendRequest({need:"save", name:"user_highlight_data", data:config.user_highlight_data});
                commonFunctions.hidePopup();
                if(typeof(messageList) != 'undefined'){
                    for(var i = 0; document.getElementsByClassName('message-top')[i]; i++){
                        document.getElementsByClassName('message-top')[i].style.background = '';
                        document.getElementsByClassName('message-top')[i].style.color = '';
                        for(var j = 0; document.getElementsByClassName('message-top')[i].getElementsByTagName('a')[j]; j++)
                            document.getElementsByClassName('message-top')[i].getElementsByTagName('a')[j].style.color = '';
                    }
                    messageList.userhl_messagelist();
                    if(config.foxlinks_quotes) commonFunctions.foxlinks_quote();
                }else{
                    for(var i = 0; document.getElementsByTagName('td')[i]; i++){
                        document.getElementsByTagName('td')[i].style.background = '';
                        document.getElementsByTagName('td')[i].style.color = '';
                        for(var j = 0; document.getElementsByTagName('td')[i].getElementsByTagName('a')[j]; j++)
                            document.getElementsByTagName('td')[i].getElementsByTagName('a')[j].style.color = '';
                    }
                    topicList.userhl_topiclist();
                    if(config.zebra_tables) topicList.zebra_tables();
                }
                break;                
        }
    },
    quickReplyInsert: function(text){
        var quickreply = document.getElementsByTagName('textarea')[0];
        var qrtext = quickreply.value;
        var oldtxt = qrtext.split('---');
        var newtxt = '';
        for(var i = 0; i < oldtxt.length - 1; i++){
            newtxt += oldtxt[i];
        }
        newtxt += text + "\n---" + oldtxt[oldtxt.length - 1];
        quickreply.value = newtxt;
    },
    getDrama: function(){
        chrome.extension.sendRequest({need:"dramalinks"}, function(response){
            commonFunctions.insertDramalinks(response.data, config.hide_dramalinks);
            if(config.hide_dramalinks) commonFunctions.hideDrama();
        });
    },
    hideDrama: function(){
        var t = document.getElementById("dramalinks_ticker");
        try{
            var color = t.getElementsByTagName('div')[0].style.background;
            document.getElementsByTagName('h1')[0].style.color = color;
            document.getElementsByTagName('h1')[0].ondblclick = commonFunctions.switchDrama;
        }catch(e){
            //dramalinks ticker did not load for some reason, ignore it
        }
    },
    switchDrama: function(){
        document.getElementById("dramalinks_ticker").style.display == 'none' ? document.getElementById("dramalinks_ticker").style.display = 'block': document.getElementById("dramalinks_ticker").style.display = 'none';
        if (document.selection)
            document.selection.empty();
        else if (window.getSelection)
            window.getSelection().removeAllRanges();
    },
    insertDramalinks: function(dramas, hide){
        try{
        var ticker=document.createElement("center");
        var update=document.createElement("center");
        //ticker.innerHTML="Dramalinks loading...";
        ticker.id="dramalinks_ticker";
        update.innerHTML="";
        update.id="dramalinks_update";
        var h1 = document.getElementsByTagName('h1')[0];
        if(config.dramalinks_below_topic && document.getElementsByTagName('h2')[0]) h1 = document.getElementsByTagName('h2')[0];
        h1.parentNode.insertBefore(ticker,h1.nextSibling);
        h1.parentNode.insertBefore(update,h1.nextSibling);
        if(hide){
            document.getElementById("dramalinks_ticker").style.display = 'none';
        }
        document.getElementById("dramalinks_ticker").innerHTML=dramas;
        }catch(e){
        }
    }
}
    
chrome.extension.sendRequest({need:"config"}, function(response){
    config = response.data;
    for(var i in allPages){
            if(response.data[i]){
                try{
                    allPages[i]();
                }catch(err){
                    console.log("error in " + i + ":", err);
                }
            }
    }
});