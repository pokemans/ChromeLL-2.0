var allPages = {
    float_userbar: function(){
        document.getElementsByClassName('menubar')[0].style.position = "fixed";
        document.getElementsByClassName('menubar')[0].style.width = "99%";
        document.getElementsByClassName('menubar')[0].style.marginTop = "-10px";
        document.getElementsByTagName('h1')[0].style.paddingTop = '40px';
        document.getElementsByClassName('userbar')[0].style.position = "fixed";
        document.getElementsByClassName('userbar')[0].style.borderBottomLeftRadius = '5px';
        document.getElementsByClassName('userbar')[0].style.borderBottomRightRadius = '5px';
        document.getElementsByClassName('userbar')[0].style.width = "99%";
        document.getElementsByClassName('userbar')[0].style.top = "33px";
        document.getElementsByClassName('menubar')[0].style.marginRight = "20px";
    },
    short_title: function(){
        document.title = document.title.replace(/End of the Internet - /i, '');
    }
}

var commonFunctions = {
    asyncUpload: function(tgt){
        var xh = new XMLHttpRequest();
        xh.onreadystatechange = function(){
            if(this.readyState != 4){
                return;
            }
            var tmp = document.createElement('div');
            tmp.innerHTML = this.responseText;
            var update_ul;
            if(window.location.href.match('postmsg')){
                update_ul = document.getElementsByTagName('form')[0].getElementsByTagName('b')[2];
            }else{
                update_ul = document.getElementsByClassName('quickpost-body')[0].getElementsByTagName('b')[0];
            }
            var current = update_ul.innerHTML.match(/Uploading: (\d+)\/(\d+)\)/);
            for(var k = 0; k < 8; k++){
                if(tmp.getElementsByTagName('input')[k].value){			
                    if(tmp.getElementsByTagName('input')[k].value.substring(0, 4) == '<img'){
                        commonFunctions.quickReplyInsert(tmp.getElementsByTagName('input')[k].value);
                        if((parseInt(current[1])) == current[2]){
                            update_ul.innerHTML = "Your Message";
                        }else{
                            update_ul.innerHTML = "Your Message (Uploading: " + (parseInt(current[1]) + 1) + "/" + current[2] + ")";
                        }
                        break;
                    }
                }
            }
        };
        var http = 'https';
        if(window.location.href.indexOf('https:') == -1) http = 'http';
        xh.open('post', http + '://u.endoftheinter.net/u.php', true);
        var formData = new FormData();
        formData.append('upload',tgt);
        xh.withCredentials = "true";
        xh.send(formData);
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
    }
}
    
chrome.extension.sendRequest({need:"config"}, function(response){
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