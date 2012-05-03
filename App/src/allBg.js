var allBg = {
    activeListeners: { "force_https": false, "batch_uploader": false},
    init_listener: function(cfg){
        if(cfg.force_https){
            allBg.activeListeners.force_https = true;
            chrome.webRequest.onBeforeRequest.addListener(allBg.handle_redirect, {"urls":["http://*.endoftheinter.net/*"]}, ['blocking']);
        }

        if(!cfg.force_https && allBg.activeListeners.force_https){
            chrome.webRequest.onBeforeRequest.removeListener(allBg.handle_redirect);
            allBg.activeListeners.force_https = false;
        }

        if(cfg.batch_uploader){
            chrome.webRequest.onBeforeSendHeaders.addListener(allBg.handle_batch_uploader, {"urls":["http://u.endoftheinter.net/*", "https://u.endoftheinter.net/*"]}, ['blocking', 'requestHeaders']);
            allBg.activeListeners.batch_uploader = true;
        }
        
        if(!cfg.batch_uploader && allBg.activeListeners.batch_uploader){
            chrome.webRequest.onBeforeSendHeaders.removeListener(allBg.handle_batch_uploader);
            allBg.activeListeners.batch_uploader = false;
        }
    },
    handle_batch_uploader: function(dest){
        var headers = dest.requestHeaders;
        var response = {};
        console.log(headers);
        for(var i in headers){
            if(headers[i].name == "Referer"){
                headers[i].value = "http://u.endoftheinter.net/u.php";
                break;
            }
        }
        response.requestHeaders = headers;
        return response;
    },
    handle_redirect: function(dest){
        return { redirectUrl: dest.url.replace(/^http/i, "https")};
    }
}