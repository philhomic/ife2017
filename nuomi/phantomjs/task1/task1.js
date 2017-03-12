var page = require('webpage').create();
var system = require('system');
var url, keyword;
var result = {
	code: 0,
	msg: '抓取失败',
	word: '',
	time: 'N/A',
	dataList: []
};
var t = Date.now();

if(system.args.length == 1){
	console.log('Usage: phantomjs test.js <some keyword>');
	phantom.exit();
}

keyword = system.args[1];
result.word = keyword;
url = 'http://www.baidu.com/s?wd=' + keyword;

page.open(url, function(status){
	if(status !== 'success'){
		return result;
	} else {
		result.code = 1;
		result.msg = '抓取成功';

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
