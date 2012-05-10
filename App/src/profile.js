var profile = {
    sort_history: function(){
        var el = document.getElementsByTagName('table')[0].getElementsByTagName('a');
        for(var i = 0; el[i]; i++){
            if(el[i].href.indexOf('history.php') != -1){
                el[i].href = el[i].href + "?b";
            }
        }
    },
    history_expand_search: function(){
        document.getElementById('search_bar').style.display = 'block';
    },
    page_jump_buttons: function(){
        var trs = document.getElementsByTagName('table')[0].getElementsByTagName('tr');
        var insert;
        var tmp;
        for(var i = 1; trs[i]; i++){
            insert = document.createElement('span');
            insert.style.float = 'right';
            insert.addEventListener('click', profileHelper.jumpHandler, false);
            tmp = trs[i].getElementsByTagName('td')[1].getElementsByTagName('a')[0].href.match(/topic=([0-9]+)/)[1];
            insert.innerHTML = '<a href="##' + tmp + '" id="jumpWindow">#</a> <a href="##' + tmp + '" id="jumpLast">&gt;</a>';
            trs[i].getElementsByTagName('td')[1].insertBefore(insert, null);
        }
    }
}
var profileHelper = {
    jumpHandler: function(ev){
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
        window.location = ev.srcElement.parentNode.parentNode.parentNode.getElementsByTagName('td')[1].getElementsByTagName('a')[0].href + '&page=' + pg;
    },
    init: function(){
        chrome.extension.sendRequest({need:"config"}, function(conf){
            config = conf.data;
            for(var i in profile){
                if(config[i]){
                    try{
                        profile[i]();
                    }catch(err){
                        console.log("error in " + i + ":", err);
                    }
                }
            }
        });
    }
}
profileHelper.init();