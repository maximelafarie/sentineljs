(function () {
	'use strict';

	// Make all divs with this class draggable

  endpoints.push('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys');
  endpoints.push('http://api.openweathermap.org/data/2.5/group?id=524901,703448,2643743&units=metric&appid=2de143494c0b295cca9337e1e96b00e0');
  endpoints.push('https://api.instagram.com/v1/tags/malmoefestival/media/recent?client_id=c1302f417cda4e09968eaec958fe0ae2');
  endpoints.push('https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&page=pizza&format=json');

  if (endpoints.length > 0) {
  	var index = 0;
  	_.each(endpoints, function (ep) {
  		$('.endpoints-list').append("<p><a target='_blank' href='"+ep+"'>"+hostname(ep)+"</a><button type='button' class='btn btn-default btn-xs' onclick='removeEP(\""+ep+"\"); $(this).parent().remove();'>Remove endpoint</button><button type='button' class='btn btn-primary btn-xs oop' onclick='showEPOutput(\"output"+index+"\");'>Show endpoint output</button></p>");

  		$('.output-group').append("<div id='output"+(index)+"' class='ui-widget-content draggable'><span class='close'>X</span><span class='title'>"+hostname(ep)+"</span></div>");

  		index++;
  	});
  }

	$(document).ready(function () {

		$(".draggable").draggable().resizable();

		$(".oop").on("remove", function () {
			setTimeout(function () {
				rebuildOutputs();
			}, 500);
		});

		$('#addEP').on('click', function() {
    	addEP();
		});

		$('#endpoint').bind("enterKey",function(e){
		    addEP();
		});

		$('#endpoint').keyup(function(e){
		    if(e.keyCode == 13)
		    {
		        $(this).trigger("enterKey");
		    }
		});

		$('.close').on('click', function(event) {
		    $(event.target).parent().hide(400);
		});

		Highcharts.setOptions({
			global: {
				useUTC: false
			},
			showInLegend: true
		});

		chart = new Highcharts.Chart({
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

						}, 2500);
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
				// formatter: function () {
				// 	return '<b>' + this.series.name + '</b><br/>' +
				// 	Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
				// 	Highcharts.numberFormat(this.y, 2) + ' s';
				// },
				shared: true,
				pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} s</b><br/>',
        crosshairs: true
			},
			legend: {
				enabled: true
			},
			exporting: {
				enabled: false
			},
			scrollbar: {
        enabled: true
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