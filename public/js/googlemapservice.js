var allMarkers = [];
var latIni = longIni = 0;
var map,
    currentPositionMarker,
    mapCenter = new google.maps.LatLng(40.575291, -3.927155),
    marker,
    infowindow = new google.maps.InfoWindow({content: 'Hello world'}),
    image = {
		url: 'http://46.101.3.22:3000/img/pin.png',
	    size: new google.maps.Size(100,99),
	    scaledSize: new google.maps.Size(30,30)
	};
 
function clearMarkers() {
  allMarkers.forEach(function (marker) {
    marker.setMap(null);
  });
  allMarkers = [];
}
 
function initializeMap()
{
    var mapOptions = {
    	zoom: 16,
      	center: mapCenter,
      	mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(latIni, longIni),
        map: map,
        animation: google.maps.Animation.DROP,
        icon: image
    });
}
 
function locError(error) {
    alert("No se ha podido encontrar la posición GPS");
}

function setCurrentPosition(pos) {
    currentPositionMarker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude
        ),
        icon: image,
        title: "Posición real"
    });
    map.panTo(new google.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude
        ));
}

function displayAndWatch(position) {
    setCurrentPosition(position);

    watchCurrentPosition();
}
 
function watchCurrentPosition() {
    var positionTimer = navigator.geolocation.watchPosition(
        function (position) {
            setMarkerPosition(
                currentPositionMarker,
                position
            );
        });
}

function setMarkerPosition(marker, position) {
    marker.setPosition(
        new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude)
    );
}

function initLocationProcedure() {
    initializeMap();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayAndWatch, locError);
    } else {
        alert("Tu dispositivo no acepta la localización por GPS :(");
    }
    
    google.maps.event.addListenerOnce(map, 'idle', function(){
      placeMarkers();
    });

    var throttleTimer;
    
    google.maps.event.addListener(map, 'center_changed', function() {
      clearTimeout(throttleTimer);
      throttleTimer = setTimeout(function () {
        placeMarkers();
      }, 100);
    });
}

function placeMarkers() {
    var bounds = map.getBounds();
    var url = '/api/hidrantes/'+bounds.getSouthWest().lat()+'/'+bounds.getSouthWest().lng()+'/'+bounds.getNorthEast().lat()+'/'+bounds.getNorthEast().lng();
    $.getJSON(url, function(data){
        clearMarkers();
        var iconBase = 'http://46.101.3.22:3000/img/hidrante.png';
        var res = "";
        $.each(data, function(k,v){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(v.loc[0],v.loc[1]),
                map: map,
                icon: iconBase,
                title: 'Ver detalle'
            });
            
            google.maps.event.addListener(marker, 'click', function() {
                $.getJSON('/api/hidrantes/' + v.id, function(data){
                    $.each(data, function(key,value){
                        var content = '<h3>Hidrante ' + value.tipo + '</h3>';
                        content += '<p>' + value.nombre_via + ', ' + value.ubicacion_via + '</p>';
                        content += '<img src="/img/' + value.id + '.jpg" />';
                        content += '<p><strong>Apertura:</strong> ' + value.apertura + '</p>';
                        if (value.salida45 > 0)
                            content += '<p><strong>' + value.salida45 + ' salida/s de 45</strong></p>';
                        if (value.salida70 > 0)
                            content += '<p><strong>' + value.salida70 + ' salida/s de 70</strong></p>';
                        if (value.salida100 > 0)
                            content += '<p><strong>' + value.salida100 + ' salida/s de 100</strong></p>';
                        if (value.presion > 0)
                        content += '<p><strong>Presión:</strong> ' + value.presion + ' bares</p>';
                        infowindow.setContent(content);
                        infowindow.open(map,marker);    
                    });
                })
            });

            allMarkers.push(marker);
        });
    });
}

$(document).ready(function(){
	initLocationProcedure();
	var alto = $(window).height() - parseInt($('#map-canvas').offset().top);
	$('#map-canvas').css({'height':alto});
});