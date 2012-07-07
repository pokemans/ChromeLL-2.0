document.getElementById('cdiv').addEventListener('postTemplateInsert', function(){
    var data = JSON.parse(this.innerHTML);
    console.log(data);
    qp(data.text, document.getElementById('post_action').parentNode.parentNode);
    document.getElementById('post_action').id = '';
});

function qp(title, element){
	var f = element.parentNode.parentNode.getElementsByTagName('a').item(0).innerHTML;
	var uib = element.parentNode.parentNode.getElementsByTagName('a').item(0).href.indexOf('user=');
	var uid = element.parentNode.parentNode.getElementsByTagName('a').item(0).href;
	var ui = uid.substring(uib + 5, uid.length);
	var u = document.getElementsByClassName('userbar').item(0).getElementsByTagName('a').item(0).innerHTML.split('(')[0];
	u = u.substring(0, u.length - 1);
	var text = document.getElementsByName('message').item(0).innerHTML;
	var sigs = text.split('---');
	var sig = '';
	for(var i = 1; sigs[i]; i++){
		sig += sigs[i];
	}
	sig = '\n---' + sig;
    console.log(title, element.parentNode);
	title = title.replace('%f', f).replace(/%u/g, u).replace('&lt;', '<').replace('&gt;', '>').replace(/%i/ig, ui) + sig;
	if(title.indexOf('%q') == -1){
		QuickPost.publish('quote', element.parentNode);
		document.getElementsByName('message')[0].value = title;
        console.log('noquote', title);
	}
	else{
        document.getElementsByName('message')[0].value = title.replace('%q ', '').replace('%q', '');
        QuickPost.publish('quote', element.parentNode);
	}
}