var search = {
    sangreen: function(){
        document.addEventListener('keyup', function(evt){
            if(evt.target.value && evt.target.value.toLowerCase() === 'sangreen'){
                document.body.style.backgroundImage = 'url("http://i.imgur.com/SVCxE.gif")';
            }
        });
    }
}

search.sangreen();