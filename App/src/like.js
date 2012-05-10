function insl(e){
    try{		var es = e.target.getElementsByClassName("message-top")[0];
        var ins = document.createElement('span');
        ins.innerHTML = ' | <a href="##like" onclick="like(this.parentNode);">Like</a>';
        if(es.getElementsByClassName('PostNumber')){
            es.insertBefore(ins, es.getElementsByClassName('PostNumber')[0]);
        }else{
            es.insertBefore(ins, null);
        }	}catch(er){
        //nothing?
    }
}
function like(el){
	var e = el.parentNode.parentNode;
	//if(e.getElementsByClassName("message-top").item(0) != null){
		var img = '<img src="http://i4.endoftheinter.net/i/n/f818de60196ad15c888b7f2140a77744/like.png" />';
		var username = document.getElementsByClassName('userbar')[0].getElementsByTagName('a')[0].innerHTML.replace(/ \((.*)\)$/, "");
		var ins = img + ' ' + username + ' likes ' + e.getElementsByTagName('a')[0].innerHTML + '\'s post';
		var text = document.getElementsByName('message').item(0).innerHTML;
		//var head = text.split('---')[0];
		var sigs = text.split('---');
		var sig = '';
		for(var i = 1; sigs[i]; i++){
			sig += sigs[i];
		}
		sig = '\n---' + sig;
		ins = ins/*.replace(/</g, '&lt;').replace(/>/g, '&gt;')*/ + sig;
		document.getElementsByName('message').item(0).value = ins;
		QuickPost.publish('quote', el);
	//}
}
document.addEventListener('DOMNodeInserted', insl, false);