var config = {};
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
    },
    dramalinks: function(){
        commonFunctions.getDrama();
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
    },
    insertDramalinks: function(dramas, hide){
        try{
        var divs=document.getElementsByTagName("div");
        var ticker=document.createElement("center");
        var update=document.createElement("center");
        //ticker.innerHTML="Dramalinks loading...";
        ticker.id="dramalinks_ticker";
        update.innerHTML="";
        update.id="dramalinks_update";
        for (var i=0; i<divs.length; i++){
            if (divs[i].className=="userbar"){
                divs[i].parentNode.insertBefore(ticker,divs[i]);
                divs[i].parentNode.insertBefore(update,divs[i]);
                break;
            }
        }
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