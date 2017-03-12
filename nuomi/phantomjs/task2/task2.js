var page = require('webpage').create();
var system = require('system');
var url, keyword, deviceInfo, deviceName;
var result = {
	code: 0,
	msg: '抓取失败',
	word: '',
	time: 'N/A',
	device: '',
	dataList: []
};
var t = Date.now();
var devices = {
	iphone5: {
		userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3',
		viewportSize: {
			width: 320,
			height: 568
		}
	},
	iphone6: {
		userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
		viewportSize: {
			width: 375,
			height: 667
		}
	},
	ipad: {
		userAgent: 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
		viewportSize: {
			width: 768,
			height: 1024
		}
	}
}

if(system.args.length <= 2){
	console.log('Usage: phantomjs test.js <one keyword> <useragent: iphone5 | iphone6 | ipad>');
	phantom.exit();
}

keyword = system.args[1];
deviceName = system.args[2];
deviceInfo = devices[deviceName];

if(!deviceInfo){
	console.log('Plz input valid device: iphone5 | iphone6 | ipad');
	phantom.exit();
}

url = 'http://www.baidu.com/s?wd=' + keyword;

//page.settings.userAgent = deviceInfo.userAgent;
page.viewportSize = deviceInfo.viewportSize;
page.open(url, function(status){
	if(status !== 'success'){
		return result;
	} else {
		result.code = 1;
		result.msg = '抓取成功';
		result.word = keyword;
		result.device = deviceName;

		page.includeJs('https://code.jquery.com/jquery-2.2.4.min.js', function(){

			var info, length, i;

			length = page.evaluate(function(){
				return $('div.c-container').length;
			});

			for(i = 1; i <= length; i++){
				info = page.evaluate(function(index){
					var title = $('#' + index + '>h3').text();
					var link = $('#' + index + '>h3>a').attr('href');
					var abstract = $('#' + index + '>.c-abstract').text() || '';
					var pic = $('#' + index + ' .c-img').attr('src') || '';
					return {
						title: title,
						info: abstract,
						link: link,
						pic: pic
					}
				}, i);

				result.dataList.push(info);	
			}

			t = Date.now() - t;
			result.time = t;

			console.log(JSON.stringify(result));
			phantom.exit();
							
		})
	}
})
