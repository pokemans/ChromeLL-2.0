var config = Array();
var ignorated = {total_ignored: 0, data:{users:{}}};
var messageList = {
    click_expand_thumbnail: function(){
        for (var j = 0; document.getElementsByClassName('imgs')[j]; j++){
            for(var k = 0; document.getElementsByClassName('imgs')[j].getElementsByTagName('a')[k]; k++){
                if(document.getElementsByClassName('imgs')[j].getElementsByTagName('a')[k].className === '' && parseInt(document.getElementsByClassName('imgs')[j].getElementsByTagName('a')[k].getElementsByTagName('span')[0].style.width) <= 150){
                    document.getElementsByClassName('imgs')[j].addEventListener("click", messageListHelper.expandThumbnail);
                    document.getElementsByClassName('imgs')[j].getElementsByTagName('a')[k].className = 'thumbnailed_image';
                    document.getElementsByClassName('imgs')[j].getElementsByTagName('a')[k].setAttribute('oldHref', document.getElementsByClassName('imgs')[j].getElementsByTagName('a')[k].href);
                    document.getElementsByClassName('imgs')[j].getElementsByTagName('a')[k].removeAttribute('href');
                }
            }
        }
    },
    drag_resize_image: function(){
        //console.log(document.getElementsByClassName('img'));
    },
    user_notes: function(){
        if (!config.usernote_notes) config.usernote_notes = {};
        document.addEventListener('click', function(tgt){
            if(tgt.target.id == 'notebook'){
                messageListHelper.openNote(tgt.target);
            }
        });
        messageListHelper.addNotebox(document.getElementsByClassName('message-top'));
    },
    ignorator_messagelist: function(){
        if(!config.ignorator) return;
        var s;
        ignorated.total_ignored = 0;
        messageListHelper.ignores = config.ignorator_list.split(',');
        for(var r = 0; r < messageListHelper.ignores.length; r++){
            var d = 0;
            while(messageListHelper.ignores[r].substring(d, d + 1) == ' '){
                d++;
            }
            messageListHelper.ignores[r] = messageListHelper.ignores[r].substring(d,messageListHelper.ignores[r].length).toLowerCase();
        }
        for(var j = 0; document.getElementsByClassName('message-top')[j]; j++){
            s = document.getElementsByClassName('message-top').item(j);
            for(var f = 0; messageListHelper.ignores[f]; f++){
                if(s.getElementsByTagName('a').item(0).innerHTML.toLowerCase() == messageListHelper.ignores[f]){
                    s.parentNode.style.display = 'none';
                    if(config.debug) console.log('removed post by ' + messageListHelper.ignores[f]);
                    ignorated.total_ignored++;
                    if(!ignorated.data.users[messageListHelper.ignores[f]]){
                        ignorated.data.users[messageListHelper.ignores[f]] = {};
                        ignorated.data.users[messageListHelper.ignores[f]].total = 1;
                        ignorated.data.users[messageListHelper.ignores[f]].trs = [j];
                    }else{
                        ignorated.data.users[messageListHelper.ignores[f]].total++;
                        ignorated.data.users[messageListHelper.ignores[f]].trs.push(j);
                    }
                }
            }
        }
        messageListHelper.globalPort.postMessage({action: 'ignorator_update', ignorator: ignorated, scope: "messageList"});
    },
    imagemap_on_infobar: function(){
        function getUrlVars(urlz){
            var vars = [], hash;
            var hashes = urlz.slice(urlz.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++){
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
                if (hash[1]!=null && hash[1].indexOf("#")>=0){
                    vars[hash[0]]=hash[1].slice(0,hash[1].indexOf("#"));
                }
            }
            return vars;
        }

        var divs=document.getElementsByClassName("infobar")[0];
        var get=getUrlVars(window.location.href);
        var page=location.pathname;

        if (page=="/imagemap.php"&&get["topic"]!=undefined){
            var as2=divs.getElementsByTagName("a");
            for (var j=0; j<as2.length; j++){
                if (as2[j].href.indexOf("imagemap.php?")>0){
                    as2[j].href=as2[j].href+"&board="+get["board"];
                }
            }
            divs.innerHTML=divs.innerHTML+" | <a href='/showmessages.php?board="+get["board"]+"&topic="+get["topic"]+"' title='Back to Topic'>Back to Topic</a>";
        }else if (page=="/showmessages.php"){
            divs.innerHTML=divs.innerHTML+" | <a href='/imagemap.php?board="+get["board"]+"&topic="+get["topic"]+"' title='Imagemap'>Imagemap</a>";
        }
    },
    batch_uploader: function(){
        var ulBox = document.createElement('input');
        ulBox.type = 'file';
        ulBox.multiple = true;
        //ulBox.value = "Batch Upload";
        ulBox.id = "batch_uploads";
        var ulButton = document.createElement('input');
        ulButton.type = "button";
        ulButton.value = "Batch Upload";
        ulButton.addEventListener('click', messageListHelper.startBatchUpload);
        document.getElementsByClassName('quickpost-body')[0].insertBefore(ulBox, null);
        document.getElementsByClassName('quickpost-body')[0].insertBefore(ulButton, ulBox);
    },
    post_title_notification: function(){
        document.addEventListener('scroll', messageListHelper.clearUnreadPosts);
        document.addEventListener('mousemove', messageListHelper.clearUnreadPosts);
    },
    quickpost_on_pgbottom: function(){
        chrome.extension.sendRequest({need: "insertcss", file:"Style/css/quickpost_on_pgbottom.css"});
    },
    resize_imgs: function(){
        for(var i = 0; document.getElementsByTagName('img')[i]; i++){
            messageListHelper.resizeImg(document.getElementsByTagName('img')[i]);
        }
    },
    loadquotes: function(){
        function getElementsByClass(searchClass,node,tag) {
            var classElements = new Array();
            if (node == null)
                node = document;
            if ( tag == null)
                tag = '*';
            var els = node.getElementsByTagName(tag);
            var elsLen = els.length;
            for (var i = 0, j = 0; i < elsLen; i++) {
                if (els[i].className == searchClass) {
                    classElements[j] = els[i];
                    j++;
                }
            }
            return classElements;
        }

        function imagecount() {
            var imgs = document.getElementsByTagName('img').length;
            return imgs;
        }

        if (document.location.href.indexOf("https") == -1) {
            var url = "http";
        } else {
            var url = "https";
        }
        
        function coolCursor() {
            this.style.cursor = 'pointer';
        }

        function processPage(XML, element) {
            var newPage = document.createElement("div");
            newPage.innerHTML = XML;
            var newmessage = getElementsByClass('message', newPage, null)[0];
            var scripttags = newmessage.getElementsByTagName('script');
            for (var i = 0; i < scripttags.length; i++) {
                var jsSource = scripttags[i].innerHTML.replace(/onDOMContentLoaded\(function\(\)\{new ImageLoader\(\$\("u0_1"\), "\\\/\\\//gi, '').replace(/\\/gi, '').replace(/\)\}\)/gi, '').split(',');
                var replacement = new Image();
                replacement.src = url + '://' + jsSource[0].replace(/"$/gi, '');
                replacement.className = 'expandimagesLOL';
                scripttags[i].parentNode.replaceChild(replacement, scripttags[i]);
                i--;
            }
            if (newmessage.innerHTML.indexOf('---') != -1) {
                var j = 0;
                while (newmessage.childNodes[j]) {
                    if (newmessage.childNodes[j].nodeType == 3 && newmessage.childNodes[j].nodeValue.indexOf('---') != -1) {
                        while (newmessage.childNodes[j]) {
                            newmessage.removeChild(newmessage.childNodes[j]);	
                        }
                    }
                    j++;
                }
            }
            element.parentNode.appendChild(newmessage);
        }

        function loadMessage() {	
            var mssgurl = this.id;
            var newSpan = document.createElement('span');
            newSpan.innerHTML = 'Loading message...';
            var loadingImg = new Image();
            loadingImg.src = 'data:image/gif;base64,' +
                'R0lGODlhEAAQAPIAAP///2Zm/9ra/o2N/mZm/6Cg/rOz/r29/iH/C05FVFNDQVBFMi4wAwEAAAAh/hpD' +
                'cmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZ' +
                'nAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi6' +
                '3P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAs' +
                'AAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKp' +
                'ZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8D' +
                'YlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJU' +
                'lIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe8' +
                '2p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAAD' +
                'Mgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAA' +
                'LAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsR' +
                'kAAAOwAAAAAAAAAAAA==';
            this.parentNode.insertBefore(newSpan, this);
            this.parentNode.replaceChild(loadingImg, this);
            var ajax = new XMLHttpRequest();
            ajax.open('GET', url + '://boards.endoftheinter.net/message.php?' + mssgurl, true);
            ajax.send(null);
            ajax.onreadystatechange = function() {
                if (ajax.readyState == 4) {
                    if (ajax.status == 200) {
                        processPage(ajax.responseText, newSpan);
                        loadingImg.parentNode.removeChild(loadingImg);
                        newSpan.parentNode.removeChild(newSpan);
                    } else {
                        alert("An error occurred loading the message. Fuck shit.");
                    }
                }
            }
        }

        function findQuotes() {
            var quotes = getElementsByClass('quoted-message', document, 'div');
            for (var i = 0; i < quotes.length; i++) {
                var anchors = quotes[i].getElementsByTagName('a');
                for (var j = 0; j < anchors.length; j++) {
                    if (anchors[j].innerHTML == '[quoted text omitted]') {
                        anchors[j].removeAttribute('href');
                        var parts = anchors[j].parentNode.getAttribute('msgid').split(',');
                        var secondsplit = parts[2].split('@');
                        anchors[j].id = 'id=' + secondsplit[0] + '&topic=' + parts[1] + '&r=' + secondsplit[1];
                        anchors[j].addEventListener('click', loadMessage, true);
                        anchors[j].style.textDecoration='underline';
                        anchors[j].title = 'Click to load the omitted message';
                        anchors[j].addEventListener('mouseover', coolCursor, true);
                    }
                }	
            }
        }

        var currentMessages = 0;

        function checkMssgs() {
            var mssgs = getElementsByClass('message-container', document.getElementById('u0_1'), 'div').length;
            if (mssgs > currentMessages) {
                findQuotes();
                currentMessages = mssgs;
            }
        }
        var interval = window.setInterval(checkMssgs, 1000);
    },
    quickpost_tag_buttons: function(){
        var m = document.getElementsByClassName('quickpost-body')[0];
        var txt = document.getElementById('u0_13');
        var insM = document.createElement('input');
        insM.value = 'Mod';
        insM.name = 'Mod';
        insM.type = 'button';
        insM.id = 'mod';
        insM.addEventListener("click", messageListHelper.qpTagButton, false);
        var insA = document.createElement('input');
        insA.value = 'Admin';
        insA.name = 'Admin';
        insA.type = 'button';
        insA.addEventListener("click", messageListHelper.qpTagButton, false);
        insA.id = 'adm';
        var insQ = document.createElement('input');
        insQ.value = 'Quote';
        insQ.name = 'Quote';
        insQ.type = 'button';
        insQ.addEventListener("click", messageListHelper.qpTagButton, false);
        insQ.id = 'quote';
        var insS = document.createElement('input');
        insS.value = 'Spoiler';
        insS.name = 'Spoiler';
        insS.type = 'button';
        insS.addEventListener("click", messageListHelper.qpTagButton, false);
        insS.id = 'spoiler';
        var insP = document.createElement('input');
        insP.value = 'Preformated';
        insP.name = 'Preformated';
        insP.type = 'button';
        insP.addEventListener("click", messageListHelper.qpTagButton, false);
        insP.id = 'pre';
        var insU = document.createElement('input');
        insU.value = 'Underline';
        insU.name = 'Underline';
        insU.type = 'button';
        insU.addEventListener("click", messageListHelper.qpTagButton, false);
        insU.id = 'u';
        var insI = document.createElement('input');
        insI.value = 'Italic';
        insI.name = 'Italic';
        insI.type = 'button';
        insI.addEventListener("click", messageListHelper.qpTagButton, false);
        insI.id = 'i';
        var insB = document.createElement('input');
        insB.value = 'Bold';
        insB.name = 'Bold';
        insB.type = 'button';
        insB.addEventListener("click", messageListHelper.qpTagButton, false);
        insB.id = 'b';
        m.insertBefore(insM, m.getElementsByTagName('textarea')[0]);
        m.insertBefore(insQ, insM);
        m.insertBefore(insS, insQ);
        m.insertBefore(insP, insS);
        m.insertBefore(insU, insP);
        m.insertBefore(insI, insU);
        m.insertBefore(insB, insI);
        m.insertBefore(document.createElement('br'), insB);
    },
    filter_me: function(){
        var me = '&u=' + document.getElementsByClassName('userbar')[0].getElementsByTagName('a')[0].href.match(/\?user=([0-9]+)/)[1];
        var txt = 'Filter Me';
        var topic = window.location.href.match(/topic=([0-9]+)/)[1];
        var fmh;
        if(window.location.href.indexOf(me) == -1){
            fmh = window.location.href.split('?')[0] + '?topic=' + topic + me;
        }else{
            fmh = window.location.href.replace(me, '');
            txt = 'Unfilter Me';
        }
        document.getElementsByClassName('infobar')[0].innerHTML += ' | <a href="' + fmh + '">' + txt + '</a>';
    },
    expand_spoilers: function(){
        var ains = document.createElement('span');
        ains.id = 'chromell_spoilers';
        document.addEventListener('click', messageListHelper.toggleSpoilers, false);
        ains.innerHTML = ' | <a href="##" id="chromell_spoiler">Expand Spoilers</a>';
        var la = document.getElementsByClassName('infobar')[0].getElementsByClassName('a');
        document.getElementsByClassName('infobar')[0].insertBefore(ains, la[la.size]);
    },
    drop_batch_uploader: function(){
        var quickreply = document.getElementsByTagName('textarea')[0];
        quickreply.addEventListener('drop', function(evt){
            evt.preventDefault();
            if(evt.dataTransfer.files.length == 0){
                console.log(evt);
                return;
            }
            document.getElementsByClassName('quickpost-body')[0].getElementsByTagName('b')[0].innerHTML += " (Uploading: 1/" + evt.dataTransfer.files.length + ")";
            commonFunctions.asyncUpload(evt.dataTransfer.files);
        });
    },
    highlight_tc: function(){
        var tcs = messageListHelper.getTcMessages();
        if(!tcs) return;
        for(var i = 0; i < tcs.length; i++){
            tcs[i].getElementsByTagName('a')[0].style.color = '#' + config.tc_highlight_color;
        }
    },
    label_tc: function(){
        var tcs = messageListHelper.getTcMessages();
        if(!tcs) return;
        var ipx, inner;
        for(var i = 0; i < tcs.length; i++){
            ipx = document.createElement('span');
            inner = ' | <b>TC</b>';
            if(config.tc_label_color && config.tc_label_color != '') inner = ' | <font color="#' + config.tc_label_color + '"><b>TC</b></font>';
            ipx.innerHTML = inner;
            tcs[i].insertBefore(ipx, tcs[i].getElementsByTagName('a')[0].nextSibling);
        }
    },
    post_before_preview: function(){
        var m = document.getElementsByClassName('quickpost-body')[0].getElementsByTagName('input');
        var preview;
        var post;
        for(var i = 0; m[i]; i++){
            if(m[i].name == 'preview'){
                preview = m[i];
            }
            if(m[i].name == 'post'){
                post = m[i];
            }
        }
        post.parentNode.removeChild(post);
        preview.parentNode.insertBefore(post, preview);
    },
    like_button: function(){
        if(window.location.href.match('archives')) return;
        var headID = document.getElementsByTagName("head")[0];         
		var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.src = chrome.extension.getURL('App/src/like.js');
		headID.appendChild(newScript);
		for(var i = 0; document.getElementsByClassName('message-top').item(i); i++){
			if(document.getElementsByClassName('message-top').item(i).getElementsByTagName('a')[2]){
				document.getElementsByClassName('message-top').item(i).innerHTML += ' | <a href="##like' + i + '" onclick="like(this);">Like</a>';
			}
		}
    },
    hide_deleted: function(){
        var msgs = document.getElementsByClassName('message-container');
        for(var i = 0; msgs[i]; i++){
            if(msgs[i].getElementsByClassName('message-top')[0].getElementsByTagName('em')[0] && msgs[i].getElementsByClassName('message-top')[0].getElementsByTagName('em')[0].innerHTML !== 'Moderator'){
                msgs[i].getElementsByClassName('message-body')[0].style.display = 'none';
                var a = document.createElement('a');
                a.href = '##' + i;
                a.innerHTML = 'Show Message';
                a.addEventListener('click', function(evt){
                    var msg = evt.target.parentNode.parentNode.getElementsByClassName('message-body')[0];
                    console.log(evt.target);
                    msg.style.display === 'none' ? msg.style.display = 'block': msg.style.display = 'none';
                });
                msgs[i].getElementsByClassName('message-top')[0].innerHTML += ' | ';
                msgs[i].getElementsByClassName('message-top')[0].insertBefore(a, null);
            }
        }
    },
    number_posts: function(){
        var page;
        if(!window.location.href.match(/page=/)){
            page = 1;
        }else{
            page = window.location.href.match(/page=(\d+)/)[1];
        }
        var posts = document.getElementsByClassName('message-container');
        var id;
        for(var i = 0; posts[i]; i++){
            var postnum = document.createElement('span');
            postnum.className = "PostNumber";
            id = ((i + 1) + (50 * (page - 1)));
            if(id < 1000) id = "0" + id;
            if(id < 100) id = "0" + id;
            if(id < 10) id = "0" + id;
            postnum.innerHTML = " | #" + id;
            postnum.id = "message-number";
            posts[i].getElementsByClassName('message-top')[0].insertBefore(postnum, null);
        }
    },
    post_templates: function(){
        var sep, sepIns, qr;
        var cDiv = document.createElement('div');
        cDiv.style.display = 'none';
        cDiv.id = 'cdiv';
        document.body.insertBefore(cDiv, null);
        messageListHelper.postEvent = document.createEvent('Event');
        messageListHelper.postEvent.initEvent('postTemplateInsert', true, true);
        var newScript = document.createElement('script');
		newScript.type = 'text/javascript';
		newScript.src = chrome.extension.getURL('App/src/topicPostTemplate.js');
		document.getElementsByTagName('head')[0].appendChild(newScript);
        for(var i = 0; document.getElementsByClassName('message-top')[i]; i++){
            if(document.getElementsByClassName('message-top')[i].parentNode.className != 'quoted-message'){
                sep = document.createElement('span');
                sep.innerHTML = " | ";
                sep.className = "post_template_holder";
                sepIns = document.createElement('span');
                sepIns.className = 'post_template_opts';
                sepIns.innerHTML = '[';
                qr = document.createElement('a');
                qr.href = "##" + i;
                qr.innerHTML = "&gt;"
                qr.className = "expand_post_template";
                sepIns.addEventListener("click", messageListHelper.postTemplateAction);
                sepIns.insertBefore(qr, null);
                sepIns.innerHTML += ']';
                sep.insertBefore(sepIns, null);
                document.getElementsByClassName('message-top')[i].insertBefore(sep, null);
            }
        }
    },
    userhl_messagelist: function(){
        if(!config.enable_user_highlight) return;
        var messages = document.getElementsByClassName('message-container');
        var user;
        if(!config.no_user_highlight_quotes){
            for(var i = 0; messages[i]; i++){
                for(var k = 0; messages[i].getElementsByClassName('message-top')[k]; k++){
                    try{
                        user = messages[i].getElementsByClassName('message-top')[k].getElementsByTagName('a')[0].innerHTML.toLowerCase();
                    }
                    catch(e){
                        break;
                    }
                    if(config.user_highlight_data[user]){
                        if(config.debug) console.log('highlighting post by ' + user);
                        messages[i].getElementsByClassName('message-top')[k].style.background = '#' + config.user_highlight_data[user].bg;
                        messages[i].getElementsByClassName('message-top')[k].style.color = '#' + config.user_highlight_data[user].color;
                        for(var j = 0; messages[i].getElementsByClassName('message-top')[k].getElementsByTagName('a')[j]; j++){
                            messages[i].getElementsByClassName('message-top')[k].getElementsByTagName('a')[j].style.color = '#' + config.user_highlight_data[user].color;
                        }
                    }
                }
            }
        }else{
            for(var i = 0; messages[i]; i++){
                user = messages[i].getElementsByClassName('message-top')[0].getElementsByTagName('a')[0].innerHTML.toLowerCase();
                if(config.user_highlight_data[user]){
                    if(config.debug) console.log('highlighting post by ' + user);
                    messages[i].getElementsByClassName('message-top')[0].style.background = '#' + config.user_highlight_data[user].bg;
                    messages[i].getElementsByClassName('message-top')[0].style.color = '#' + config.user_highlight_data[user].color;
                    for(var j = 0; messages[i].getElementsByClassName('message-top')[0].getElementsByTagName('a')[j]; j++){
                        messages[i].getElementsByClassName('message-top')[0].getElementsByTagName('a')[j].style.color = '#' + config.user_highlight_data[user].color;
                    }
                }
            }
        }
    },
    foxlinks_quotes: function(){
        commonFunctions.foxlinks_quote();
    },
    load_next_page: function(){
        document.getElementById('u0_3').addEventListener('dblclick', messageListHelper.loadNextPage);
    },
    pm_title: function(){
        var me = document.getElementsByClassName('userbar')[0].getElementsByTagName('a')[0].innerHTML.match(/(.*) \(\d+\)/)[1];
        var other = '';
        for(var i = 0; document.getElementsByClassName('message-top')[i]; i++){
            if(document.getElementsByClassName('message-top')[i].getElementsByTagName('a')[0].innerHTML !== me){
                other = document.getElementsByClassName('message-top')[i].getElementsByTagName('a')[0].innerHTML;
                break;
            }
        }
        document.title = "PM - " + other;
    }
}
var messageListHelper = {
    ignores: {},
    startBatchUpload: function(evt){
        var chosen = document.getElementById('batch_uploads');
        if(chosen.files.length == 0){
                alert('Select files and then click "Batch Upload"');
                return;
        }
        document.getElementsByClassName('quickpost-body')[0].getElementsByTagName('b')[0].innerHTML += " (Uploading: 1/" + chosen.files.length + ")";
        commonFunctions.asyncUpload(chosen.files, 0);
    },
    postTemplateAction: function(evt){
        if(evt.target.className === "expand_post_template"){
            var ins = evt.target.parentNode;
            ins.removeChild(evt.target);
            var ia = document.createElement('a');
            ia.innerHTML = "&lt;"
            ia.className = "shrink_post_template";
            ia.href = '##';
            ins.innerHTML = '[';
            ins.insertBefore(ia, null);
            for(var i in config.post_template_data){
                var title = document.createElement('a');
                title.href = '##' + i;
                title.className = 'post_template_title';
                title.innerHTML = i;
                var titleS = document.createElement('span');
                titleS.style.paddingLeft = '3px';
                titleS.innerHTML = '[';
                titleS.insertBefore(title, null);
                titleS.innerHTML += ']';
                titleS.className = i;
                ins.insertBefore(titleS, null);
            }
            ins.innerHTML += ']';
        }
        if(evt.target.className === "shrink_post_template"){
            var ins = evt.target.parentNode;
            evt.target.parentNode.removeChild(evt.target);
            var ia = document.createElement('a');
            ia.innerHTML = "&gt;"
            ia.className = "expand_post_template";
            ia.href = '##';
            ins.innerHTML = '[';
            ins.insertBefore(ia, null);
            ins.innerHTML += ']';
        }
        if(evt.target.className === "post_template_title"){
            evt.target.id = 'post_action';
            var cdiv = document.getElementById('cdiv');
            var d = {};
            d.text = config.post_template_data[evt.target.parentNode.className].text;
            cdiv.innerText = JSON.stringify(d);
            cdiv.dispatchEvent(messageListHelper.postEvent);
        }
    },
    getTcMessages: function(){
        if(!config.tcs) config.tcs = {};
        var tcs = Array();
        var topic = window.location.href.match(/topic=(\d+)/)[1];
        var heads = document.getElementsByClassName('message-top');
        var tc;
        var haTopic;
        if(document.getElementsByClassName('message-top')[0].innerHTML.indexOf("> Human") !== -1) {
            haTopic = true;
            tc = "human #1";
        }
        else if((!window.location.href.match('page') || window.location.href.match('page=1($|&)')) && !window.location.href.match(/u=(\d+)/))
            tc = heads[0].getElementsByTagName('a')[0].innerHTML.toLowerCase();
        else{
            if(!config.tcs[topic]){
                console.log('Unknown TC!');
                return;
            }
            tc = config.tcs[topic].tc;
        }
        if(!config.tcs[topic]){
            config.tcs[topic] = {};
            config.tcs[topic].tc = tc;
            config.tcs[topic].date = new Date().getTime();
        }
        for(var i = 0; i < heads.length; i++){
            if(haTopic && heads[i].innerHTML.indexOf("\">Human") == -1){
                heads[i].innerHTML = heads[i].innerHTML.replace(/Human #(\d+)/, "<a href=\"#" + i + "\">Human #$1</a>");
            }
            if(heads[i].getElementsByTagName('a')[0].innerHTML.toLowerCase() == tc){
                tcs.push(heads[i]);
            }
        }
        messageListHelper.saveTcs();
        return tcs;
    },
    toggleSpoilers: function(el){
        if(el.srcElement.id != 'chromell_spoiler'){
            return;
        }
        var spans = document.getElementsByClassName('spoiler_on_close');
        var nnode;	
        for(var i = 0; spans[i]; i++){
            nnode = spans[i].getElementsByTagName('a')[0];
            messageListHelper.toggleSpoiler(nnode);
        }
    },
    toggleSpoiler: function(obj){
       while (!/spoiler_(?:open|close)/.test(obj.className)){
            obj=obj.parentNode;
        }
        obj.className=obj.className.indexOf('closed') != -1 ? obj.className.replace('closed', 'opened') : obj.className.replace('opened', 'closed');	
        return false;
    },
    expandThumbnail: function(evt){
    	if (config.debug) console.log("in expandThumbnail");
         var num_children = evt.target.parentNode.parentNode.childNodes.length;
        //first time expanding - only span
        if( num_children == 1) {
        	if (config.debug) console.log("first time expanding - build span, load img");
        	
            //build new span
            var newspan = document.createElement('span');
            newspan.setAttribute("class", "img-loaded");
            newspan.setAttribute("id", evt.target.parentNode.getAttribute('id') + "_expanded");
            //build new img child for our newspan
            var newimg = document.createElement('img');
            //find fullsize image url
            var fullsize = evt.target.parentNode.parentNode.getAttribute('imgsrc');
            //set proper protocol
            if (window.location.protocol == "https:") {
            	fullsize = fullsize.replace(/^http:/i, "https:");
            }
            newimg.src = fullsize;
            newspan.insertBefore(newimg);
            evt.target.parentNode.parentNode.insertBefore(newspan, evt.target.parentNode);
            evt.target.parentNode.style.display="none"; //hide old img	
        }
        //has been expanded before - just switch which node is hidden
        else if (num_children == 2){
        	if (config.debug) console.log("not first time expanding - toggle display status");
        	
        	//toggle their display statuses
        	var children = evt.target.parentNode.parentNode.childNodes
        	for(var i = 0; i < children.length; i++){
        		if( children[i].style.display == "none"){
        			children[i].style.display = '';
        		}
        		else {
        			children[i].style.display = "none";
        		}
        	}
        }
        else if(config.debug) console.log("I don't know what's going on with this image - weird number of siblings");
    },
    dragEvent: false,
    dragEventUpdater: function(evt){
        if(messageListHelper.dragEvent){
            console.log(evt);
        }
    },
    addNotebox: function(tops){
        if(!tops[0].getElementsByTagName('a')[0].href.match(/user=(\d+)$/i)){
            if(config.debug) console.log('HA Topic - skipping usernotes');
            return;
        }
        var top;
		for(var i=0; top = tops[i]; i++){
			var notebook = document.createElement('a');
			notebook.id = 'notebook';
			top.innerHTML += " | ";
			var tempID = top.getElementsByTagName('a')[0].href.match(/user=(\d+)$/i)[1];
			notebook.innerHTML = (config.usernote_notes[tempID] != undefined && config.usernote_notes[tempID] != '') ? 'Notes*' : 'Notes';
			notebook.href = "##note" + tempID;
			top.appendChild(notebook);
		}
    },
    openNote: function(el){
        var userID = el.href.match(/note(\d+)$/i)[1];
		if(document.getElementById("notepage")){
			var pg = document.getElementById('notepage');
			userID = pg.parentNode.getElementsByTagName('a')[0].href.match(/user=(\d+)$/i)[1];
			config.usernote_notes[userID] = pg.value;
			pg.parentNode.removeChild(pg);
            messageListHelper.saveNotes();
		}else{
			var note = config.usernote_notes[userID];
			page = document.createElement('textarea');
			page.id='notepage';
			page.value = (note == undefined) ? "" : note;
			page.style.width="100%";
			page.style.opacity = '.6';
			el.parentNode.appendChild(page);
		}
	},
    saveNotes: function(){
        chrome.extension.sendRequest({need:"save", name:"usernote_notes", data:config.usernote_notes}, function(rsp){
            console.log(rsp);
        });
    },
    resizeImg: function(el){
        //console.log(el.width, config.img_max_width);
        var width = el.width;
        if(width > config.img_max_width){
            if(config.debug) console.log('resizing:', el);
            el.height = (el.height / (el.width / config.img_max_width));
            el.parentNode.style.height = el.height + 'px';
            el.width = config.img_max_width;
            el.parentNode.style.width = config.img_max_width + 'px';
        }
    },
    saveTcs: function(){
        var max = 40;
        var lowest = Infinity;
        var lowestTc;
        var numTcs = 0;
        for(var i in config.tcs){
            if(config.tcs[i].date < lowest){
                lowestTc = i;
                lowest = config.tcs[i].date;
            }
            numTcs++;
        }
        if(numTcs > max) delete config.tcs[lowestTc];
        chrome.extension.sendRequest({need:"save", name:"tcs", data:config.tcs});
    },
    clearUnreadPosts: function(evt){
        if(messageListHelper.hasJustScrolled){
            messageListHelper.hasJustScrolled = false;
            return;
        }
        if(document.title.match(/\(\d+\+?\)/)){
            var newTitle = document.title.replace(/\(\d+\+?\) /, "");
            document.title = newTitle;
            
            // chrome bug, title does not always update on windows
            //setTimeout(function(){
            //    document.title = newTitle;
            //}, 500);
        }
    },
    init: function(){
        chrome.extension.sendRequest({need:"config", tcs:true}, function(conf){
            messageListHelper.globalPort = chrome.extension.connect();
            config = conf.data;
            config.tcs = conf.tcs;
            var pm = '';
            if(window.location.href.match('inboxthread')) pm = "_pm";
            for(var i in messageList){
                if(config[i + pm]){
                    try{
                        messageList[i]();
                    }catch(err){
                        console.log("error in " + i + ":", err);
                    }
                }
            }
            messageListHelper.globalPort.onMessage.addListener(function(msg){
                switch(msg.action){
                    case "ignorator_update":
                        messageListHelper.globalPort.postMessage({action: 'ignorator_update', ignorator: ignorated, scope: "messageList"});
                        break;
                    case "focus_gained":
                        //chrome bug, disabled for now
                        //messageListHelper.clearUnreadPosts();
                        break;
                    case "showIgnorated":
                        if(config.debug) console.log("showing hidden msg", msg.ids);
                        var tr = document.getElementsByClassName('message-top');
                        for(var i; i = msg.ids.pop();){
                            console.log(tr[i]);
                            tr[i].parentNode.style.display = 'block';
                            tr[i].parentNode.style.opacity = '.7';
                        }
                        break;
                    default:
                        if(config.debug) console.log('invalid action', msg);
                        break;
                }
            });
        });
    },
    loadNextPage: function(){
        var page = 1;
        if(window.location.href.match('asyncpg')){
            page = parseInt(window.location.href.match('asyncpg=(\d+)')[1]);
        }else if(window.location.href.match('page')){
            page = parseInt(window.location.href.match('page=(\d+)')[1]);
        }
        page++;
        var topic = window.location.href.match('topic=(\d+)')[1];
    },
    qpTagButton: function(e){
        if(e.target.tagName != 'INPUT'){
            return 0;
        }
        //from foxlinks
        var tag = e.target.id;
        var open = new RegExp("\\*", "m");
        var ta = e.target.nextSibling;

        while (ta.nodeName.toLowerCase() != "textarea")
            ta = ta.nextSibling;

        var st   = ta.scrollTop;
        var before = ta.value.substring(0, ta.selectionStart);
        var after  = ta.value.substring(ta.selectionEnd, ta.value.length);
        var select = ta.value.substring(ta.selectionStart, ta.selectionEnd);

        if (ta.selectionStart == ta.selectionEnd) {
            if (open.test(e.target.value)) {
                e.target.value = e.target.name;
                var focusPoint = ta.selectionStart + tag.length + 3;
                ta.value = before + "</" + tag + ">" + after;
            } else {
                e.target.value = e.target.name + "*";
                var focusPoint = ta.selectionStart + tag.length + 2;
                ta.value = before + "<" + tag + ">" + after;
            }

            ta.selectionStart = focusPoint;
        } else {
            var focusPoint = ta.selectionStart + (tag.length * 2) + select.length + 5;
            ta.value = before + "<" + tag + ">" + select + "</" + tag + ">" + after;
            ta.selectionStart = before.length;
        }

        ta.selectionEnd = focusPoint;
        ta.scrollTop = st;
        ta.focus();
    },
    livelinks: function(evt){
        if (!evt.target.getElementsByClassName) return;
        var pm = '';
        if(window.location.href.match('inboxthread')) pm = "_pm";
        if (evt.target.getElementsByClassName("message-top")[0]){
            for(var i in messageListLivelinks){
                if(config[i + pm]){
                    try{
                        messageListLivelinks[i](evt.target);
                    }catch(err){
                        console.log("error in livelinks " + i + ":", err);
                    }
                }
            }
        }else if(evt.target.width){
            if(config.resize_imgs){
                messageListLivelinks.resize_imgs(evt.target.parentNode);
            }
        }
    }
}
var messageListLivelinks = {
    click_expand_thumbnail: function(el){
        if(el.getElementsByClassName('imgs')[0] && el.getElementsByClassName('quoted-message')[0]){
            var qm = el.getElementsByClassName('quoted-message');
            for(var i = 0; qm[i]; i++){
                for (var j = 0; qm[i].getElementsByClassName('imgs')[j]; j++){
                    if(qm[i].getElementsByClassName('imgs')[j].getElementsByTagName('a')[0].className === ''){
                        qm[i].getElementsByClassName('imgs')[j].addEventListener("click", messageListHelper.expandThumbnail);
                        qm[i].getElementsByClassName('imgs')[j].getElementsByTagName('a')[0].className = qm[i].getElementsByClassName('imgs')[j].getElementsByTagName('a')[0].href.match(/imap\/.*\/(.*)$/)[1];
                        qm[i].getElementsByClassName('imgs')[j].getElementsByTagName('a')[0].removeAttribute('target');
                        qm[i].getElementsByClassName('imgs')[j].getElementsByTagName('a')[0].removeAttribute('href');
                    }
                }
            }
        }
    },
    ignorator_messagelist: function(el){
        if(!config.ignorator) return;
        var m = el.getElementsByClassName('message-top');
        for(var i = 0; m[i]; i++){
            for(var f = 0; messageListHelper.ignores[f]; f++){
                if(m[i].getElementsByTagName('a')[0].innerHTML.toLowerCase() == messageListHelper.ignores[f]){
                    el.style.display = "none";
                    if(config.debug) console.log('removed livelinks post by ' + messageListHelper.ignores[f]);
                    ignorated.total_ignored++;
                    if(!ignorated.data.users[messageListHelper.ignores[f]]){
                        ignorated.data.users[messageListHelper.ignores[f]] = 1;
                    }else{
                        ignorated.data.users[messageListHelper.ignores[f]]++;
                    }
                    messageListHelper.globalPort.postMessage({action: 'ignorator_update', ignorator: ignorated});
                }
            }
        }
    },
    resize_imgs: function(el){
        for(var i = 0; el.getElementsByTagName('img')[i]; i++){
            messageListHelper.resizeImg(el.getElementsByTagName('img')[i]);
        }
    },
    user_notes: function(el){
        messageListHelper.addNotebox(el.getElementsByClassName('message-top'));
    },
    autoscroll_livelinkss: function(el){
        var page = 1;
        if(window.location.href.match('page='))
            page = window.location.href.match(/page=(\d+)/)[1];
        var pages = document.getElementById('u0_2').getElementsByTagName('span')[0].innerHTML;
        if(page != pages){
            window.location.href.match('page=') ? document.location = document.location.replace('page=' + page, 'page=' + pages) : document.location = document.location + '&page=' + pages;
        }
        messageListHelper.hasJustScrolled = true;
        window.scrollTo(0, (document.body.scrollHeight - 1000));
    },
    post_title_notification: function(el){
        if(el.style.display === "none"){
            if(config.debug) console.log('not updating for ignorated post');
            return;
        }
        if(el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[0].innerHTML == document.getElementsByClassName('userbar')[0].getElementsByTagName('a')[0].innerHTML.replace(/ \((\d+)\)$/, "")) return;
        var posts = 1;
        var ud = '';
        if(document.getElementsByClassName('message-container')[49]){
            ud = ud + "+";
            if(config.new_page_notify){
                chrome.extension.sendRequest({need: "notify", title: "New Page Created", message: document.title});
            }
        }
        if(document.title.match(/\(\d+\)/)){
            posts = parseInt(document.title.match(/\((\d+)\)/)[1]);
            document.title = "(" + (posts + 1) + ud + ") " + document.title.replace(/\(\d+\) /, "");
        }else{
            document.title = "(" + posts + ud + ") " + document.title;
        }
    },
    notify_quote_post: function(el){
        if(!el.getElementsByClassName('quoted-message')) return;
        if(el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[0].innerHTML == document.getElementsByClassName('userbar')[0].getElementsByTagName('a')[0].innerHTML.replace(/ \((\d+)\)$/, "")) return;
        var not = false;
        var msg = el.getElementsByClassName('quoted-message');
        for(var i = 0; msg[i]; i++){
            if(msg[i].getElementsByClassName('message-top')[0].getElementsByTagName('a')[0].innerHTML == document.getElementsByClassName('userbar')[0].getElementsByTagName('a')[0].innerHTML.replace(/ \((.*)\)$/, "")){
                if(msg[i].parentNode.className != 'quoted-message') not = true;
            }
        }
        if(not){
            chrome.extension.sendRequest({need:"notify", title:"Quoted by " + el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[0].innerHTML, message:document.title.replace(/End of the Internet - /i, '')}, function(data){ console.log(data); });
        }
    },
    highlight_tc: function(el){
        var topic = window.location.href.match(/topic=(\d+)/)[1];
        if(el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[0].innerHTML.toLowerCase() == config.tcs[topic].tc){
            el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[0].style.color = '#' + config.tc_highlight_color;
        }
    },
    label_tc: function(el){
        var topic = window.location.href.match(/topic=(\d+)/)[1];
        if(el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[0].innerHTML.toLowerCase() == config.tcs[topic].tc){
            ipx = document.createElement('span');
            inner = ' | <b>TC</b>';
            if(config.tc_label_color && config.tc_label_color != '') inner = ' | <font color="#' + config.tc_label_color + '"><b>TC</b></font>';
            ipx.innerHTML = inner;
            el.getElementsByClassName('message-top')[0].insertBefore(ipx, el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[0].nextSibling);
        }
    },
    like_button: function(el){
        if(el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[2]){
            el.getElementsByClassName('message-top')[0].innerHTML += ' | <a href="##like" onclick="like(this);">Like</a>';
        }
    },
    number_posts: function(el){
        var lastPost = document.getElementsByClassName('PostNumber')[document.getElementsByClassName('PostNumber').length - 1];
        var number = lastPost.innerHTML.match(/#(\d+)/)[1];
        var post = document.createElement('span');
        var id = (parseInt(number, 10) + 1);
        if(id < 1000) id = "0" + id;
        if(id < 100) id = "0" + id;
        if(id < 10) id = "0" + id;
        post.className = "PostNumber";
        post.innerHTML = " | #" + id;
        el.getElementsByClassName('message-container')[0].getElementsByClassName('message-top')[0].insertBefore(post, null);
    },
    userhl_messagelist: function(el){
        if(!config.enable_user_highlight) return;
        if(!config.no_user_highlight_quotes){
            for(var k = 0; el.getElementsByClassName('message-top')[k]; k++){
                try{
                    user = el.getElementsByClassName('message-top')[k].getElementsByTagName('a')[0].innerHTML.toLowerCase();
                }
                catch(e){
                    break;
                }
                if(config.user_highlight_data[user]){
                    if(config.debug) console.log('highlighting post by ' + user);
                    el.getElementsByClassName('message-top')[k].style.background = '#' + config.user_highlight_data[user].bg;
                    el.getElementsByClassName('message-top')[k].style.color = '#' + config.user_highlight_data[user].color;
                    for(var j = 0; el.getElementsByClassName('message-top')[k].getElementsByTagName('a')[j]; j++){
                        el.getElementsByClassName('message-top')[k].getElementsByTagName('a')[j].style.color = '#' + config.user_highlight_data[user].color;
                    }
                    if(k == 0 && config.notify_userhl_post && el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[0].innerHTML != document.getElementsByClassName('userbar')[0].getElementsByTagName('a')[0].innerHTML.replace(/ \((\d+)\)$/, "")){
                        chrome.extension.sendRequest({need:"notify", message:document.title.replace(/End of the Internet - /i, ''), title:"Post by " + el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[0].innerHTML}, function(data){ console.log(data); });
                    }
                }
            }
        }else{
            user = el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[0].innerHTML.toLowerCase();
            if(config.user_highlight_data[user]){
                if(config.debug) console.log('highlighting post by ' + user);
                el.getElementsByClassName('message-top')[0].style.background = '#' + config.user_highlight_data[user].bg;
                el.getElementsByClassName('message-top')[0].style.color = '#' + config.user_highlight_data[user].color;
                for(var j = 0; el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[j]; j++){
                    el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[j].style.color = '#' + config.user_highlight_data[user].color;
                }
                if(config.notify_userhl_post && el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[0].innerHTML != document.getElementsByClassName('userbar')[0].getElementsByTagName('a')[0].innerHTML.replace(/ \((\d+)\)$/, "")){
                    chrome.extension.sendRequest({need:"notify", message:document.title.replace(/End of the Internet - /i, ''), title:"Post by " + el.getElementsByClassName('message-top')[0].getElementsByTagName('a')[0].innerHTML}, function(data){ console.log(data); });
                }
            }
        }
    },
    foxlinks_quotes: function(el){
        messageList.foxlinks_quotes();
    }
}
messageListHelper.init();
document.addEventListener('DOMNodeInserted', messageListHelper.livelinks);
