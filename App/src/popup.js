function openBoard(evt){
    window.open("http://boards.endoftheinter.net/showtopics.php?board=" + document.boards.board.value);
}
function openOptions(){
    window.open(chrome.extension.getURL('options.html'));
}
window.onload = function(){
    document.getElementById('board_select').addEventListener('change', openBoard);
    document.getElementById('options').addEventListener('click', openOptions);
    chrome.extension.sendRequest({need:"config", sub:"sort_history"}, function(response){
        console.log(response);
        if(response.data === true){
            document.getElementById('a_msg_history').href = 'http://boards.endoftheinter.net/history.php?b';
        }
    });
    var insert;
    chrome.extension.sendRequest({need:"getIgnored"}, function(response){
        console.log(response.ignorator);
        console.log(response.ignorator.data.users);
        if(response.ignorator.data.users){
            for(var i in response.ignorator.data.users){
                console.log('user', i);
                insert = document.createElement('div');
                insert.className = 'user_ignore';
                insert.innerHTML = '<span class="rm_num">' + response.ignorator.data.users[i] + '</span>' + i;
                document.getElementById('js_insert').insertBefore(insert, null);
            }
        }
        if(response.ignorator.data.keywords){
            for(var i in response.ignorator.data.keywords){
                console.log('keyword', i);
                insert = document.createElement('div');
                insert.className = 'keyword_ignore';
                insert.innerHTML = '<span class="rm_num">' + response.ignorator.data.keywords[i] + '</span>' + i;
                document.getElementById('js_insert').insertBefore(insert, null);
            }
        }
    });
};