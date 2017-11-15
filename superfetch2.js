function superfetch(url, type, success, fail, settings) {
    
    var status;

    fetch(url, settings).then(respSucc).then(dataSucc).catch(badstuff);

    //---------------------------------
    function respSucc(response) {        
                
        status = response.status;        
        
        if (type == "text") {
            return response.text();
        }

        if (type == "json") {
            return response.json();
        }
    }    

    //---------------------------------
    function dataSucc(data) {
        
        if (status != 200 && fail != undefined) {
            fail(data);
        }
        else {
            success(data);
        }
    }

    //---------------------------------
    function badstuff(error) {

        if (fail != undefined) {
            //fail(error);
            
            fail(error);
        }

    }
}
