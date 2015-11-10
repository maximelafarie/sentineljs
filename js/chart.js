(function () {
	'use strict';

    endpoints.push('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys');
    endpoints.push('http://api.openweathermap.org/data/2.5/group?id=524901,703448,2643743&units=metric&appid=2de143494c0b295cca9337e1e96b00e0');

    //Another ep to test
    //https://api.instagram.com/v1/tags/malmoefestival/media/recent?client_id=c1302f417cda4e09968eaec958fe0ae2

	$(document).ready(function () {
		Highcharts.setOptions({
			global: {
				useUTC: false
			}
		});

		var chart = new Highcharts.Chart({
			chart: {
				renderTo: 'container',
				type: 'spline',
				animation: Highcharts.svg,
				marginRight: 10,
				events: {
					load: function () {

						var series = this.series;
						setInterval(function () {

							var start_time = new Date().getTime();

							_.each(endpoints, function (ep) {
								watchEP(endpoints, ep, series, start_time);
							});

							chart.redraw();

						}, 3500);
					}
				}
			},
			title: {
				text: 'SentinelJS'
			},
			xAxis: {
				type: 'datetime',
				tickPixelInterval: 150
			},
			yAxis: {
				title: {
					text: 'Response time in seconds'
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			tooltip: {
				formatter: function () {
					return '<b>' + this.series.name + '</b><br/>' +
					Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
					Highcharts.numberFormat(this.y, 2) + ' s';
				}
			},
			legend: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
			series: []
		}, function (ch){
			$(chart).ready(function() {
				_.each(endpoints, function (ep, key) {
					ch.addSeries({
						name: hostname(ep),
						data: (function () {
							var data = [],
							time = (new Date()).getTime(),
							i;

							for (i = -19; i <= 0; i += 1) {
								data.push({
									x: time + i * 1000,
									y: 0
								});
							}
							return data;
						}())
					});
				});
				ch.redraw();

				$(document).on('endpoint_added', function() {
					ch.addSeries({
						name: hostname(endpoints[endpoints.length-1]),
						data: (function () {
							var data = [],
							time = (new Date()).getTime(),
							i;

							for (i = -19; i <= 0; i += 1) {
								data.push({
									x: time + i * 1000,
									y: 0
								});
							}
							return data;
						}())
					});
					ch.redraw();
				});
			});
		});
	});
})();