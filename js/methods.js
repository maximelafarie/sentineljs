var endpoints = [];

function removeEP (endpoint) {
    _.remove(endpoints, function (ep) {
        return ep == endpoint;
    });
    console.info('Endpoint removed sucessfuly!', endpoints);
};

function addEP () {
    if (endpoints.length < 5) {
        if ($('#endpoint').val() !== '') {
            endpoints.push($('#endpoint').val());
            $('.endpoints-list').append("<p><span>"+$('#endpoint').val()+"</span><button type='button' onclick='removeEP(\""+$('#endpoint').val()+"\")' class='btn btn-default'><span class='glyphicon glyphicon-minus'></span></button></p>");

            $('#endpoint').val('').focus();
            console.info('Endpoint added sucessfuly!', endpoints);
        }
        else {
            console.warn('You didn\'t enter any endpoint to watch!')
        }
    }
    else {
        console.warn('You reach the limit of watchable endpoints!');
        $('#endpoint').val('');
    }
}

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