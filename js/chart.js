'use strict';
(function () {

    $(document).ready(function () {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        $('#container').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg,
                marginRight: 10,
                events: {
                    load: function () {

                        var series = this.series;
                        setInterval(function () {

                            var start_time = new Date().getTime();

                            $.ajax({
                                url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
                                data: {},
                                type: 'GET',
                                crossDomain: true,
                                dataType: 'jsonp',
                                success: function() {
                                    var request_time = new Date().getTime() - start_time;
                                    console.log("Success", request_time/1000);
                                    var x = (new Date()).getTime(),
                                    y = request_time/1000;
                                    series[0].addPoint([x, y], true, true);
                                },
                                error: function() { console.error('Failed!'); }
                            });

$.ajax({
    url: 'http://api.openweathermap.org/data/2.5/group?id=524901,703448,2643743&units=metric&appid=2de143494c0b295cca9337e1e96b00e0',
    data: {},
    type: 'GET',
    crossDomain: true,
    dataType: 'jsonp',
    success: function() {
        var request_time = new Date().getTime() - start_time;
        console.log("Success", request_time/1000);
        var x = (new Date()).getTime(),
        y = request_time/1000;
        series[1].addPoint([x, y], false, true);
    },
    error: function() { console.error('Failed!'); }
});

}, 3500);
}
}
},
title: {
    text: 'Response Time valleedordogne_v2'
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
series: [{
    name: 'Response time',
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
},
{
    name: 'Response time',
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
}]
});
});
})();