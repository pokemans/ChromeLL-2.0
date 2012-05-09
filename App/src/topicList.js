var config;
var topicList = {
    ignorator_topiclist: function(){
        if(!config.ignorator) return;
        var s;
        var ignores = config.ignorator_list.split(',');
        ignores = topicListHelper.handleCsv(ignores);
        var g = document.getElementsByTagName('tr');
        var title;
        for(var i = 1; g[i]; i++){
            if(g[i].getElementsByTagName('td')[1]){
                title = g[i].getElementsByTagName('td')[1];
                    for(var f = 0; f < ignores.length; f++){
                        if(title.getElementsByTagName('a')[0].innerHTML.toLowerCase() == ignores[f]){
                            if(config.debug) console.log('found topic to remove: \"' + g[i].getElementsByTagName('td')[0].getElementsByTagName('a')[0].innerHTML.toLowerCase() + "\" author: " + ignores[f] + " topic: " + i);
                            title.parentNode.style.display = 'none';				
                        }
                    }
            }
        }
    },
    ignore_keyword: function(){
        if(config.ignore_keyword_list == "" || config.ignore_keyword_list == undefined) return;
        var keywords;
        var re = false;
        try{
            keywords = JSON.parse(config.ignore_keyword_list);
            if(config.debug) console.log("JSON keywords");
            re = true;
        }catch(e){
            keywords = config.ignore_keyword_list.split(',');
            keywords = topicListHelper.handleCsv(keywords);
        }
        if(config.debug) console.log(keywords);
        var g = topicListHelper.getTopics();
        var title;
        var match = false;
        var reg;
        for(var i = 1; g[i]; i++){
            if(g[i].getElementsByTagName('td')[0]){
                title = g[i].getElementsByTagName('td')[0];
                    for(var f = 0; f < keywords.length; f++){
                        if(re){
                            if(keywords[f].substring(0, 1) == '/'){
                                reg = new RegExp(keywords[f].substring(1, keywords[f].lastIndexOf('/')), keywords[f].substring(keywords[f].lastIndexOf('/') + 1, keywords[f].length));
                            }else{
                                reg = keywords[f];
                            }
                            match = title.getElementsByTagName('a')[0].innerHTML.match(reg);
                        }else{
                            match = title.getElementsByTagName('a')[0].innerHTML.toLowerCase().match(keywords[f].toLowerCase());
                        }
                        if(match){
                            if(config.debug) console.log('found topic to remove: \"' + g[i].getElementsByTagName('td')[0].getElementsByTagName('a')[0].innerHTML.toLowerCase() + "\" keyword: " + keywords[f] + " topic: " + i);
                            title.parentNode.style.display = 'none';
                            //break;
                        }
                    }
            }
        }
    },
    page_jump_buttons: function(){
        var trs = topicListHelper.getTopics();
        var insert;
        var tmp, topic;
        for(var i = 1; trs[i]; i++){
            if(trs[i].getElementsByTagName('td')[0]){
                insert = document.createElement('span');
                insert.style.float = 'right';
                insert.addEventListener('click', topicListHelper.jumpHandlerTopic, false);
                try{
                    topic = trs[i].getElementsByTagName('td')[0].getElementsByTagName('a');
                    tmp = topic[0].href.match(/(topic|thread)=([0-9]+)/)[2];
                    insert.innerHTML = '<a href="##' + tmp + '" id="jumpWindow">#</a> <a href="##' + tmp + '" id="jumpLast">&gt;</a>';
                    trs[i].getElementsByTagName('td')[0].insertBefore(insert, null);
                }catch(e){
                    if(config.debug) console.log('locked topic?');
                    topic = trs[i].getElementsByTagName('td')[0].getElementsByTagName('span')[0].getElementsByTagName('a');
                    tmp = topic[0].href.match(/(topic|thread)=([0-9]+)/)[2];
                    insert.innerHTML = '<a href="##' + tmp + '" id="jumpWindow">#</a> <a href="##' + tmp + '" id="jumpLast">&gt;</a>';
                    trs[i].getElementsByTagName('td')[0].insertBefore(insert, null);
                }
            }
        }
    },
    enable_keyword_highlight: function(){
        var topics = topicListHelper.getTopics();
        var title;
        var keys = {};
        var re = false;
        for(var j = 0; config.keyword_highlight_data[j]; j++){
            try{
                keys[j] = {};
                keys[j].match = JSON.parse(config.keyword_highlight_data[j].match);
                keys[j].bg = config.keyword_highlight_data[j].bg;
                keys[j].color = config.keyword_highlight_data[j].color;
                re = true;
            }catch(e){
                keys[j] = {};
                keys[j].match = config.keyword_highlight_data[j].match.split(',');
                keys[j].match = topicListHelper.handleCsv(keys[j].match);
                keys[j].bg = config.keyword_highlight_data[j].bg;
                keys[j].color = config.keyword_highlight_data[j].color;
            }
        }
        var reg;
        for(var i = 1; topics[i]; i++){
            title = topics[i].getElementsByTagName('td')[0].getElementsByTagName('a')[0].innerHTML;
            for(var j = 0; keys[j]; j++){
                for(var k = 0; keys[j].match[k]; k++){
                    if(keys[j].match[k].substring(0, 1) == '/'){
                        reg = new RegExp(keys[j].match[k].substring(1, keys[j].match[k].lastIndexOf('/')), keys[j].match[k].substring(keys[j].match[k].lastIndexOf('/') + 1, keys[j].match[k].length));
                        match = title.match(reg);
                    }else{
                        reg = keys[j].match[k].toLowerCase();
                        match = title.toLowerCase().match(reg);
                    }
                    if(match){
                        topics[i].getElementsByTagName('td')[0].style.background = '#' + keys[j].bg;
                        topics[i].getElementsByTagName('td')[0].style.color = '#' + keys[j].color;
                        for(var m = 0; topics[i].getElementsByTagName('td')[0].getElementsByTagName('a')[m]; m++){
                            topics[i].getElementsByTagName('td')[0].getElementsByTagName('a')[m].style.color = '#' + keys[j].color;
                        }
                        if(config.debug) console.log('highlight topic ' + title + ' keyword ' + reg);
                    }
                }
            }
        }
    },
    userhl_topiclist: function(){
        if(!config.enable_user_highlight) return;
        var topics = topicListHelper.getTopics();
        var user;
        for(var i = 1; topics[i]; i++){
            user = topics[i].getElementsByTagName('td')[1].getElementsByTagName('a')[0].innerHTML.toLowerCase();
            if(config.user_highlight_data[user]){
                if(config.debug)  console.log('highlighting topic by ' + user);
                for(var j = 0; topics[i].getElementsByTagName('td')[j]; j++){
                    topics[i].getElementsByTagName('td')[j].style.background = '#' + config.user_highlight_data[user].bg;
                    topics[i].getElementsByTagName('td')[j].style.color = '#' + config.user_highlight_data[user].color;
                }
                for(var j = 0; topics[i].getElementsByTagName('a')[j]; j++){
                    topics[i].getElementsByTagName('a')[j].style.color = '#' + config.user_highlight_data[user].color;
                }
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
    getTopics: function(){
        return document.getElementsByClassName('grid')[0].getElementsByTagName('tr');
    },
    handleCsv: function(ignores){
        for(var r = 0; r < ignores.length; r++){
            var d = 0;
            while(ignores[r].substring(d, d + 1) == ' '){
                d++;
            }
            ignores[r] = ignores[r].substring(d,ignores[r].length);
        }
        return ignores;
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