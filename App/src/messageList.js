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
    init: function(){
        chrome.extension.sendRequest({need:"config"}, function(conf){
            config = conf.data;
            for(var i in messageList){
                if(config[i]){
                    //try{
                        messageList[i]();
                    //}catch(err){
                    //    console.log("error in " + i + ":", err);
                    //}
                }
            }
        });
    },
    livelinks: function(evt){
        if (!evt.target.getElementsByClassName) return;
        if (evt.target.getElementsByClassName("message-top")[0]){
            for(var i in messageListLivelinks){
                if(config[i]){
                    //try{
                        messageListLivelinks[i](evt.target);
                    //}catch(err){
                    //    console.log("error in livelinks " + i + ":", err);
                    //}
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
    }
}
messageListHelper.init();
document.addEventListener('DOMNodeInserted', messageListHelper.livelinks);