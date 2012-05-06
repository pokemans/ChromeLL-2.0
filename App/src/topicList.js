var config;
var topicList = {
    ignorator_topiclist: function(){
        if(!config.ignorator) return;
        var s;
        var ignores = config.ignorator_list.split(',');
        for(var r = 0; r < ignores.length; r++){
            var d = 0;
            while(ignores[r].substring(d, d + 1) == ' '){
                d++;
            }
            ignores[r] = ignores[r].substring(d,ignores[r].length);
        }
        var g = document.getElementsByTagName('tr');
        var title;
        for(var i = 1; g[i]; i++){
            if(g[i].getElementsByTagName('td')[1]){
                title = g[i].getElementsByTagName('td')[1];
                    for(var f = 0; f < ignores.length; f++){
                        if(title.getElementsByTagName('a').item(0).innerHTML.toLowerCase() == ignores[f]){
                            console.log('found topic to remove: \"' + g.item(i).getElementsByTagName('td').item(0).getElementsByTagName('a').item(0).innerHTML.toLowerCase() + "\" author: " + ignores[f] + " topic: " + i);
                            title.parentNode.style.display = 'none';				
                        }
                    }
            }
        }
    },
    page_jump_buttons: function(){
        var trs = document.getElementsByTagName('table')[0].getElementsByTagName('tr');
        if(document.getElementsByTagName('table')[1]){
            trs = document.getElementsByTagName('table')[1].getElementsByTagName('tr');
        }	
        var insert;
        var tmp;
        for(var i = 1; trs[i]; i++){
            if(trs[i].getElementsByTagName('td')[0]){
            insert = document.createElement('span');
            insert.style.float = 'right';
            insert.addEventListener('click', topicListHelper.jumpHandlerTopic, false);
            tmp = trs[i].getElementsByTagName('td')[0].getElementsByTagName('a')[0].href.match(/(topic|thread)=([0-9]+)/)[2];
            insert.innerHTML = '<a href="##' + tmp + '" id="jumpWindow">#</a> <a href="##' + tmp + '" id="jumpLast">&gt;</a>';
            trs[i].getElementsByTagName('td')[0].insertBefore(insert, trs[i].getElementsByTagName('td')[0].getElementsByTagName('a')[0]);
            }
        }
    }
}

var topicListHelper = {
    jumpHandlerTopic: function(ev){
        var a = ev.srcElement.parentNode.parentNode.parentNode.getElementsByTagName('td')[2]
        var last = Math.ceil(a.innerHTML.split('<')[0] / 50);
        if(ev.srcElement.id == 'jumpWindow'){
            pg = prompt("Page Number (" + last + " total)","Page");
            if(pg == undefined || pg == "Page"){
                return 0;
            }
        }else{
            pg = last;
        }
        window.location = ev.srcElement.parentNode.parentNode.parentNode.getElementsByTagName('td')[0].getElementsByTagName('a')[2].href + '&page=' + pg;
    },
    init: function(){
        chrome.extension.sendRequest({need:"config"}, function(conf){
            config = conf.data;
            var pm = '';
            if(window.location.href.match('inbox.php')) pm = "_pm";
            for(var i in topicList){
                if(config[i + pm]){
                    try{
                        topicList[i]();
                    }catch(err){
                        console.log("error in " + i + ":", err);
                    }
                }
            }
        });
    }
}

topicListHelper.init();