#!/usr/bin/env node
var request = require('request');
var dateFormat = require('dateformat');

var moduleName = process.argv[2];
var baseUrl = 'https://api.npmjs.org/downloads/point/';
var today = new Date();

var formattedDate = dateFormat(today, "yyyy-mm-dd");

function downloadCount(period, displayMsg, callback){
	updatedUrl = baseUrl + period + '/' + moduleName;
	request(updatedUrl, function (error, response, body) {
		if(error) {
			console.log('npmjs API server down. Please try again later.')
			process.exit();
		}
		else{
			if(JSON.parse(body).error) {
				console.log('Please enter a valid npm module name');
				process.exit();
			}
			console.log(JSON.parse(body).downloads + displayMsg);
			if(callback) callback();
		}
	});
}

if(!process.argv[2]){
	console.log('Please specify a module name.')
	process.exit();
}

console.log('\nModule Name :: ',moduleName);
downloadCount('last-day',' downloads in the last day', function(){
	downloadCount('last-week',' downloads in the last week', function(){
		downloadCount('last-month',' downloads in the last month', function(){
			downloadCount('2009-01-01:' + formattedDate,' total downloads till date');
		});
	});	
});