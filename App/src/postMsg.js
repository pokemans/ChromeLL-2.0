var postMsg = {
    batch_uploader: function(){
        var ulBox = document.createElement('input');
        ulBox.type = 'file';
        ulBox.multiple = true;
        ulBox.value = "Batch Upload";
        ulBox.id = "batch_uploads";
        var ulButton = document.createElement('input');
        ulButton.type = "button";
        ulButton.value = "Batch Upload";
        ulButton.addEventListener('click', postMsgHelper.startBatchUpload);
        document.getElementsByTagName('form')[0].insertBefore(ulBox, null);
        document.getElementsByTagName('form')[0].insertBefore(ulButton, ulBox);
    },
    post_before_preview: function(){
        var post, preview;
        var m = document.getElementsByTagName('form')[document.getElementsByTagName('form').length - 1].getElementsByTagName('input');
        for(var i = 0; i < m.length; i++){
            if(m[i].name == 'preview'){
                preview = m[i];
            }
            if(m[i].name == 'submit'){
                post = m[i];
            }
        }
        post.parentNode.removeChild(post);
        preview.parentNode.insertBefore(post, preview);
    },
    quickpost_tag_buttons: function(){
        var m = document.getElementsByTagName('form')[document.getElementsByTagName('form').length - 1];
        var txt = document.getElementById('u0_25');
        var insM = document.createElement('input');
        insM.value = 'Mod';
        insM.name = 'Mod';
        insM.type = 'button';
        insM.id = 'mod';
        insM.addEventListener("click", postMsgHelper.qpTagButton, false);
        var insA = document.createElement('input');
        insA.value = 'Admin';
        insA.name = 'Admin';
        insA.type = 'button';
        insA.addEventListener("click", postMsgHelper.qpTagButton, false);
        insA.id = 'adm';
        var insQ = document.createElement('input');
        insQ.value = 'Quote';
        insQ.name = 'Quote';
        insQ.type = 'button';
        insQ.addEventListener("click", postMsgHelper.qpTagButton, false);
        insQ.id = 'quote';
        var insS = document.createElement('input');
        insS.value = 'Spoiler';
        insS.name = 'Spoiler';
        insS.type = 'button';
        insS.addEventListener("click", postMsgHelper.qpTagButton, false);
        insS.id = 'spoiler';
        var insP = document.createElement('input');
        insP.value = 'Preformated';
        insP.name = 'Preformated';
        insP.type = 'button';
        insP.addEventListener("click", postMsgHelper.qpTagButton, false);
        insP.id = 'pre';
        var insU = document.createElement('input');
        insU.value = 'Underline';
        insU.name = 'Underline';
        insU.type = 'button';
        insU.addEventListener("click", postMsgHelper.qpTagButton, false);
        insU.id = 'u';
        var insI = document.createElement('input');
        insI.value = 'Italic';
        insI.name = 'Italic';
        insI.type = 'button';
        insI.addEventListener("click", postMsgHelper.qpTagButton, false);
        insI.id = 'i';
        var insB = document.createElement('input');
        insB.value = 'Bold';
        insB.name = 'Bold';
        insB.type = 'button';
        insB.addEventListener("click", postMsgHelper.qpTagButton, false);
        insB.id = 'b';
        m.insertBefore(insM, m.getElementsByTagName('textarea')[0]);
        m.insertBefore(insQ, insM);
        m.insertBefore(insS, insQ);
        m.insertBefore(insP, insS);
        m.insertBefore(insU, insP);
        m.insertBefore(insI, insU);
        m.insertBefore(insB, insI);
        m.insertBefore(document.createElement('br'), m.getElementsByTagName('textarea')[0]);
    },
    drop_batch_uploader: function(){
        var quickreply = document.getElementsByTagName('textarea')[0];
        quickreply.addEventListener('drop', function(evt){
            evt.preventDefault();
            document.getElementsByTagName('form')[0].getElementsByTagName('b')[2].innerHTML += " (Uploading: 1/" + evt.dataTransfer.files.length + ")";
            for(var i = 0; evt.dataTransfer.files[i]; i++){
                commonFunctions.asyncUpload(evt.dataTransfer.files[i]);
            }
        });
    },
}

var postMsgHelper = {
    startBatchUpload: function(evt){
        var chosen = document.getElementById('batch_uploads');
        if(chosen.files.length == 0){
                alert('Select files and then click "Batch Upload"');
                return;
        }
        document.getElementsByTagName('form')[0].getElementsByTagName('b')[2].innerHTML += " (Uploading: 1/" + chosen.files.length + ")";
        for(var i = 0; chosen.files[i]; i++){
            commonFunctions.asyncUpload(chosen.files[i]);
        }
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
    init: function(){
        chrome.extension.sendRequest({need:"config"}, function(conf){
            config = conf.data;
            var pm = '';
            if(!window.location.href.match('boards')) pm = "_pm";
            for(var i in postMsg){
                if(config[i + pm]){
                    try{
                        postMsg[i]();
                    }catch(err){
                        console.log("error in " + i + ":", err);
                    }
                }
            }
        });
    }
}

postMsgHelper.init();