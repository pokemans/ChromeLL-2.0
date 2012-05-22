function like(el){
	var e = el.parentNode.parentNode;
    var img = '<img src="http://i4.endoftheinter.net/i/n/f818de60196ad15c888b7f2140a77744/like.png" />';
    var username = document.getElementsByClassName('userbar')[0].getElementsByTagName('a')[0].innerHTML.replace(/ \((\d+)\)$/, "");
    var ins = img + ' ' + username + ' likes ' + e.getElementsByTagName('a')[0].innerHTML + '\'s post';
    var quickreply = document.getElementsByTagName('textarea')[0];
    var qrtext = quickreply.value;
    var oldtxt = '', newtxt = '';
    var sig = true;
    if(qrtext.match('---')){
        oldtxt = qrtext.split('---');
        console.log('sig');
        for(var i = 0; i < oldtxt.length - 1; i++){
            newtxt += oldtxt[i];
        }
    }else{
        sig = false;
        newtxt = qrtext;
    }
    if(sig) newtxt += ins + '\n---' + oldtxt[oldtxt.length - 1];
    else newtxt += ins;
    console.log(newtxt, oldtxt, ins);
    quickreply.value = newtxt;
	QuickPost.publish('quote', el);
}