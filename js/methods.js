'use strict';

var endpoints = [];
var chart = $('#container').highcharts();

function showEPOutput (elem) {
    if($('#'+elem).is(':visible'))
    {
        $('#'+elem).hide(400);
    }
    else {
        $('#'+elem).show(400);
    }
}

function rebuildOutputs() {
    _.each($('.draggable'), function (elem, key) {
        if ($(elem).attr('id') !== ('output'+key)) {
            $(elem).attr('id', 'output'+key);
        }
    });

    _.each($('.oop'), function (elem, key) {
        if ($(elem).attr('onclick') !== ('showEPOutput(\"output'+key+'\");')) {
            $(elem).attr('onclick', 'showEPOutput(\"output'+key+'\");');
        }
    });
}

function removeEP (endpoint) {
    if (chart !== null) {
        var serieIndex = _.findIndex(endpoints, function (ep) {
          return ep == endpoint;
      });

        $('#output'+serieIndex).remove();

        if (serieIndex < (endpoints.length -1)) {
            rebuildOutputs();
        }

        _.remove(endpoints, function (ep) {
            return ep == endpoint;
        });

        chart.series[serieIndex].remove();
        chart.redraw();

        console.info('Endpoint successfuly removed !');
    }
}

function addEP () {
    if (endpoints.length < 5) {
        if ($('#endpoint').val() !== '' && !_.includes(endpoints, $('#endpoint').val())) {
            endpoints.push($('#endpoint').val());
            $(document).trigger('endpoint_added');
            $('.endpoints-list').append("<p><a target='_blank' href='"+$('#endpoint').val()+"'>"+hostname($('#endpoint').val())+"</a><button type='button' class='btn btn-default btn-xs' onclick='removeEP(\""+$('#endpoint').val()+"\"); $(this).parent().remove();'>Remove endpoint</button><button type='button' class='btn btn-primary btn-xs oop' onclick='showEPOutput(\"output"+(endpoints.length-1)+"\");'>Show endpoint output</button></p>");

            $('.output-group').append("<div id='output"+(endpoints.length-1)+"' class='ui-widget-content draggable'><span class='close'>X</span><span class='title'>"+hostname($('#endpoint').val())+"</span></div>");

            $('#endpoint').val('').focus();
            console.info('Endpoint successfuly added!', endpoints);
        }
        else {
            console.warn('You didn\'t enter any endpoint to watch or the endpoint is already being watched!');
        }
    }
    else {
        console.warn('You reach the limit of watchable endpoints!');
        $('#endpoint').val('');
    }
}

function watchEP (epList, endpoint, series, startTime) {
    var epIndex = _.findKey(epList, function (ep) { return ep == endpoint });
    $.ajax({
        url: endpoint,
        data: {},
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function(data) {
            var request_time = new Date().getTime() - startTime;
            // var x = (new Date()).getTime(),
            var x = startTime,
            y = request_time/1000;
            series[epIndex].addPoint([x, y], false, true);
            $('#output'+epIndex).append('<div class="response"><pre><code class="language-js">'+JSON.stringify(data)+'</code></pre></div>');
            //console.log("Success", request_time/1000);
        },
        error: function() { console.error('Failed!'); }
    });
}

function hostname(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if ( match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0 ) return match[2];
}

function sticky( _el ) {
  _el.parentElement.addEventListener("scroll", function(){
    _el.style.transform = "translateY("+this.scrollTop+"px)";
  });
}