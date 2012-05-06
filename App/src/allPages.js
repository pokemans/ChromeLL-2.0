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