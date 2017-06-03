 var socket = io.connect('http://localhost:3001');
 var KPI = io.connect('http://localhost:3003');
 var HostName = "http://localhost:3000";

 var globalData;
 var tempoVal;
 KPI.on('test', function(msg) {

 	globalData = msg;
 	var message = msg;
 	google.charts.load('current', {
 		'packages': ['corechart']
 	});


 	google.charts.setOnLoadCallback(function() {

 		console.log(message);
 		if (tempoVal) {
 			dataInfo(message, tempoVal)
 		}

 	});

 }); //KPI.on End 


 /********************************Function to Show the Chart to the User******************************************************************************/

 function showChart(i) {
 	id = 'mychart' + i;
 	tempoVal = i;
 	dataInfo(globalData, i);

 	if (document.getElementById(id).style.display == "none") {
 		document.getElementById(id).style.display = 'block';
 	} else {
 		document.getElementById(id).style.display = 'none';
 	}
 } //showChart End


 /********************************Function to draw the Chart of the current data******************************************************************************/
 function dataInfo(message, j) {

 	var rob_number = "ROB" + j + "_Availability";
 	var ROB_AvailabilityData = google.visualization.arrayToDataTable([
 		['Task', 'Hours per Day'],
 		['Busy', message["Availability"][j - 1][rob_number]],
 		['Idle', 100 - message["Availability"][j - 1][rob_number]]
 	]);
 	var options1 = {
 		title: rob_number,
 		pieSliceText: 'label',
 		is3D: true,
 		slices: {
 			0: {
 				offset: 0.2
 			}
 		},
 	};
 	var chart1 = new google.visualization.PieChart(document.getElementById('piechart' + j));
 	chart1.draw(ROB_AvailabilityData, options1);

 } //dataInfo End