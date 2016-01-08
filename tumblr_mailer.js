var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var csvFile = fs.readFileSync('friend_list.csv','utf-8');
var emailTemplate = fs.readFileSync('email_template.ejs', 'utf-8');

function csvParse(csvFile) {
	var formattedArray = [];
	var splitCsv = csvFile.split('\n');
	for (var i = 1; i < splitCsv.length; i++) {
		var currentArray = splitCsv[i].split(",");
		formattedArray.push({
			firstName: currentArray[0],
			lastName: currentArray[1],
			numMonthsSinceContact: currentArray[2],
			emailAddress: currentArray[3]
		});
	}

	return formattedArray;
}

var friendList = csvParse(csvFile);

function getRecentPosts(posts) {
	var recentPosts = [];
	var currentDate = new Date();
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

	for(var i = 0; i < posts.length; i++) {
		var postDate = new Date(posts[i]["date"]);
		var diffDays = Math.round(Math.abs((currentDate.getTime() - postDate.getTime())/(oneDay)));
		if (diffDays <= 7) {
			recentPosts.push(posts[i]);
		}
	}

	return recentPosts;
}

var client = tumblr.createClient({
  consumer_key: '****',
  consumer_secret: '****',
  token: '****',
  token_secret: '****'
});

client.posts('colandrea.tumblr.com', function(err, blog){
  //console.log(blog);
  var customizedTemplate = ejs.render(emailTemplate, 
	{
		firstName: friendList[0]["firstName"],
		numMonthsSinceContact: friendList[0]["numMonthsSinceContact"],
		latestPosts: getRecentPosts(blog.posts)
	});
  	console.log(customizedTemplate);
});








