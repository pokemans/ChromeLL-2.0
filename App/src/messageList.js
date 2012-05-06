var config = {};
var messageList = {
    click_expand_thumbnail: function(){
        for (var j = 0; j < document.getElementsByClassName('img').length; j++){
            document.getElementsByClassName('img')[j].addEventListener("click", messageListHelper.expandThumbnail);
            document.getElementsByClassName('img')[j].getElementsByTagName('a')[0].removeAttribute('href');
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
    batch_uploader: function(){
        console.log('starting batch uploader');
        var ulBox = document.createElement('input');
        ulBox.type = 'file';
        ulBox.multiple = true;
        ulBox.value = "Batch Upload";
        ulBox.name = "batch_uploads";
        var ulButton = document.createElement('input');
        ulButton.type = "button";
        ulButton.value = "Batch Upload";
        document.getElementsByClassName('quickpost-body')[0].insertBefore(ulButton, null);
        document.getElementsByClassName('quickpost-body')[0].insertBefore(ulBox, ulButton);
    },
    post_title_notification: function(){
        document.addEventListener('scroll', messageListHelper.clearUnreadPosts);
    },
    quickpost_on_pgbottom: function(){
        //from foxlinks
        var cssCode = "body:not(.quickpost-expanded) form.quickpost {"+
        "display: block;"+
        "position: static;"+
        "}"+
        "body:not(.quickpost-expanded) form.quickpost a.quickpost-nub {"+
        "position: fixed;"+
        "}"+
        "body:not(.quickpost-expanded) form.quickpost div.quickpost-canvas {"+
        "display: block;"+
        "}";
        var styleElement = document.createElement("style");
        styleElement.type = "text/css";
        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = cssCode;
        } else {
            styleElement.appendChild(document.createTextNode(cssCode));
        }
    	document.getElementsByTagName("head")[0].appendChild(styleElement);
    },
    quickpost_tag_buttons: function(){
        var m = document.getElementsByClassName('quickpost-body')[0];
        var txt = document.getElementById('u0_13');
        if(window.location.href.indexOf('linkme.php') != -1){
            txt = document.getElementById('u0_25');
        }
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
        insU.addEventListener("click", messageListHelper.qpTagButtonn, false);
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
        m.insertBefore(insM, m.getElementsByTagName('br')[0]);
        m.insertBefore(insQ, insM);
        m.insertBefore(insS, insQ);
        m.insertBefore(insP, insS);
        m.insertBefore(insU, insP);
        m.insertBefore(insI, insU);
        m.insertBefore(insB, insI);
        m.insertBefore(document.createElement('br'), insB);
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
    number_posts: function(){
        var page;
        if(!window.location.href.match(/page=/)){
            page = 1;
        }else{
            page = window.location.href.match(/page=(\d+)/)[1];
        }
        var posts = document.getElementsByClassName('message-container');
        for(var i = 0; i < posts.length; i++){
            var postnum = document.createElement('span');
            postnum.className = "PostNumber";
            postnum.innerHTML = " | #" + ((i + 1) + (50 * (page - 1)));
            posts[i].getElementsByClassName('message-top')[0].insertBefore(postnum, null);
        }
    }
}
var messageListHelper = {
    expandThumbnail: function(evt){
        if(evt.target.tagName != "IMG" && !evt.target.src.match('/i/t/')){
            return;
        }
        var src = evt.target.src;
        var ext = evt.target.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('a')[1].innerText;
        var img = document.createElement('img');
        img.src = src.replace(/(http.*)\/i\/t\/(.*)\/.*/, "$1/i/n/$2/" + ext);
        evt.target.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(img, evt.target.parentNode.parentNode.parentNode.parentNode);
        evt.target.parentNode.parentNode.parentNode.parentNode.removeChild(evt.target.parentNode.parentNode.parentNode);
    },
    dragEvent: false,
    dragEventUpdater: function(evt){
        if(messageListHelper.dragEvent){
            console.log(evt);
        }
    },
    addNotebox: function(tops){
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
    clearUnreadPosts: function(evt){
        if(document.title.match(/\(\d+\)/)) document.title = document.title.replace(/\(\d+\) /, "");
    },
    init: function(){
        chrome.extension.sendRequest({need:"config"}, function(conf){
            config = conf.data;
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
        });
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
        if (evt.target.getElementsByClassName("message-top")[0]){
            for(var i in messageListLivelinks){
                if(config[i]){
                    try{
                        messageListLivelinks[i](evt.target);
                    }catch(err){
                        console.log("error in livelinks " + i + ":", err);
                    }
                }
            }
        }
    }
}
var messageListLivelinks = {
    click_expand_thumbnail: function(el){
        if(el.getElementsByClassName('img')){
            for (var j = 0; j < el.getElementsByClassName('img').length; j++){
                el.getElementsByClassName('img')[j].addEventListener("click", messageListHelper.expandThumbnail);
                el.getElementsByClassName('img')[j].getElementsByTagName('a')[0].removeAttribute('href');
            }
        }
    },
    user_notes: function(el){
        messageListHelper.addNotebox(el.getElementsByClassName('message-top'));
    },
    post_title_notification: function(el){
        var posts = 1;
        if(document.title.match(/\(\d+\)/)){
            posts = parseInt(document.title.match(/\((\d+)\)/)[1]);
            document.title = "(" + (posts + 1) + ") " + document.title.replace(/\(\d+\) /, "");
        }else{
            document.title = "(" + posts + ") " + document.title;
        }
    },
    number_posts: function(el){
        var lastPost = document.getElementsByClassName('PostNumber')[document.getElementsByClassName('PostNumber').length - 1];
        var number = lastPost.innerHTML.match(/#(\d+)/)[1];
        var post = document.createElement('span');
        post.className = "PostNumber";
        post.innerHTML = " | #" + (parseInt(number) + 1);
        el.getElementsByClassName('message-top')[0].insertBefore(post, null);
    }
}
messageListHelper.init();
document.addEventListener('DOMNodeInserted', messageListHelper.livelinks);