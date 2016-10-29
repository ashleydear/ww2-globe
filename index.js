var xlsxtojson = require("xlsx-to-json-lc");

var fs = require('fs');


var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/process-data', function(req, res) {

	xlsxtojson({
		input: './public/data.xlsx', //the same path where we uploaded our file
        output: null, //since we don't need output.json
        lowerCaseHeaders:true

	}, function(err, result) {
		var data = [];

		var count = 0;
		
		for (var i = 0; i < result.length; i++) {
			if (result[i]['longitude'] == '' && count < 3) {

				data.push([
					result[i]['battle name'], []
				]);
				count++;
			}
			else {
				var lat        = result[i]['latitude'];
				var long       = result[i]['longitude'];
				var casualties = result[i]['casualties - high estimates'];

				if (lat.length > 0 && long.length > 0 && casualties.length > 0) {
					var index = data.length - 1;
					data[index][1].push(lat);
					data[index][1].push(long);
					data[index][1].push(casualties);
				}
			}
		}

		res.json(data);
	});

	// res.send('Success! :)');
});

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});