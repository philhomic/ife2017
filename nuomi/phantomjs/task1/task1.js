var page = require("webpage").create(); 
var system = require("system"); 

if(system.args.length === 1){
    console.log("Usage: phantomjs task4.js <some keyword>"); 
    phantom.exit(); 
}
 
var result = {
       code: 0, 
       msg: "",
       word: system.args[1],
       time: Date.now(), 
       dataList: []
}


var url = "https://baidu.com/s?wd=" + result.word; 

page.open(url, function(status){
    if(status !== "success"){
        result.msg = "capture failed"; 
        result.time = -1; 
        console.log(JSON.stringify(result)); 
        phantom.exit(); 

    }
    else{
        
        result.time = Date.now() - result.time; 
        result.dataList = page.evaluate(function(){
            var containers = document.getElementsByClassName("c-container"); 
            var dataList = new Array(); 
            for(var i = 0; i < containers.length; i++){
                var ele = containers[i];  
                var link = ele.getElementsByClassName("t")[0].getElementsByTagName("a")[0]; 
                var abstract = ele.getElementsByClassName("c-abstract")[0] || new Object(); 
                var pic = ele.getElementsByClassName("c-img")[0]; 
                if(pic){
                    pic = pic.getAttribute("src"); 
                }
                dataList.push({
                    title: link.innerText || "", 
                    info: abstract.innerText || "",
                    link: link.getAttribute("href") || "", 
                    pic: pic || ""
                });
            } 
            return dataList; 
        }); 
        result.code = 1; 
        result.msg = "capture success"; 
        console.log(JSON.stringify(result)); 
        phantom.exit();  
        }
}); 
