var messageList = {
    click_expand_thumbnail: function(){
        for (var j = 0; j < document.getElementsByClassName('img').length; j++){
            document.getElementsByClassName('img')[j].addEventListener("click", messageListHelper.expandThumbnail);
            document.getElementsByClassName('img')[j].getElementsByTagName('a')[0].removeAttribute('href');
        }
    },
    drag_resize_image: function(){
        console.log(document.getElementsByClassName('img'));
    },
}
var messageListHelper = {
    expandThumbnail: function(evt){
        if(evt.target.tagName != "IMG" && !evt.target.src.match('/i/t/')){
            return;
        }
        var src = evt.target.src;
        var ext = evt.target.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('a')[1].innerText;
        var img = document.createElement('img');
        img.src = src.replace(/(http.*)\/i\/t\/(.*)\/.*/, "$1/i/n/$2/" + ext);
        evt.target.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(img, evt.target.parentNode.parentNode.parentNode.parentNode);
        evt.target.parentNode.parentNode.parentNode.parentNode.removeChild(evt.target.parentNode.parentNode.parentNode);
    },
    dragEvent: false,
    dragEventUpdater: function(evt){
        if(messageListHelper.dragEvent){
            console.log(evt);
        }
    }
}
chrome.extension.sendRequest({need:"config"}, function(response){
    for(var i in messageList){
            if(response.data[i]){
                try{
                    messageList[i]();
                }catch(err){
                    console.log("error in " + i + ":", err);
                }
            }
    }
});