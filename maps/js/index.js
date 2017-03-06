//http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus/docs/reference.html

var maxMarkerCount = 30000;
var minClusterSize = 50;
var baseImageUrl = 'https://s3-ap-northeast-1.amazonaws.com/media.mymusictaste.com/temp/';
////////////////////////////

var getGoogleClusterInlineSvg = function (color) {
        var encoded = window.btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-100 -100 200 200"><defs><g id="a" transform="rotate(45)"><path d="M0 47A47 47 0 0 0 47 0L62 0A62 62 0 0 1 0 62Z" fill-opacity="0.7"/><path d="M0 67A67 67 0 0 0 67 0L81 0A81 81 0 0 1 0 81Z" fill-opacity="0.5"/><path d="M0 86A86 86 0 0 0 86 0L100 0A100 100 0 0 1 0 100Z" fill-opacity="0.3"/></g></defs><g fill="' + color + '"><circle r="42"/><use xlink:href="#a"/><g transform="rotate(120)"><use xlink:href="#a"/></g><g transform="rotate(240)"><use xlink:href="#a"/></g></g></svg>');

        return ('data:image/svg+xml;base64,' + encoded);
    };



var southWest = new google.maps.LatLng(40.744656, -74.005966);
    var northEast = new google.maps.LatLng(34.052234, -118.243685);
    var lngSpan = northEast.lng() - southWest.lng();
    var latSpan = northEast.lat() - southWest.lat();
    var datapoints = []
    var mapStyles = {
      default: null,

      night: [{
        elementType: 'geometry',
        stylers: [{
          color: '#242f3e'
        }]
      }, {
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#242f3e'
        }]
      }, {
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#746855'
        }]
      }, {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#d59563'
        }]
      }, {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#d59563'
        }]
      }, {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{
          color: '#263c3f'
        }]
      }, {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#6b9a76'
        }]
      }, {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{
          color: '#38414e'
        }]
      }, {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#212a37'
        }]
      }, {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#9ca5b3'
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{
          color: '#746855'
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#1f2835'
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#f3d19c'
        }]
      }, {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{
          color: '#2f3948'
        }]
      }, {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#d59563'
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: '#17263c'
        }]
      }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#515c6d'
        }]
      }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#17263c'
        }]
      }],

    };

    var clusterStyles = [
      [{
        // url: 'https://cdn.rawgit.com/MyMusicTaste/v3-utility-library/master/markerclustererplus/images/conv30.png',
        url: baseImageUrl+'1.png',
        width: 20,
        height: 20,
        textColor: '#00',
        textSize: 0
      }, {
        // url: 'https://cdn.rawgit.com/MyMusicTaste/v3-utility-library/master/markerclustererplus/images/conv40.png',
        url: baseImageUrl+'2.png',
        width: 50,
        height: 50,
        textColor: '#00',
        textSize: 0
      }, {
        url: baseImageUrl+'3.png',
        width: 100,
        height: 100,
        textColor: '#00',
        textSize: 0
      },{
      url: baseImageUrl+'4.png',
      width: 150,
      height: 150,
      textColor: '#00',
      textSize: 0
      },
      {
      url: baseImageUrl+'5.png',
      width: 70,
      height: 70,
      textColor: '#00',
      textSize: 12
      }, {
      url: baseImageUrl+'6.png',
      width: 85,
      height: 85,
      textColor: '#00',
      textSize: 12
      }, {
      url: baseImageUrl+'7.png',
      width: 100,
      height: 100,
      textColor: '#00',
      textSize: 12
      }
      ],
    ];

    var markerClusterer = null;
    var map = null;
    var imageUrl = 'https://s3-ap-northeast-1.amazonaws.com/media.mymusictaste.com/temp/0.png';
    google.maps.event.addDomListener(window, 'load', initialize);

    function refreshMap() {
      if (markerClusterer) {
        markerClusterer.clearMarkers();
      }
      var markers = [];
      var markerImage = new google.maps.MarkerImage(imageUrl,
        new google.maps.Size(24, 32));

      var zoom = parseInt(document.getElementById('zoom').value, 10);
      var size = parseInt(document.getElementById('size').value, 10);
      var datacont = parseInt(document.getElementById('datacount').value, 10);
      minClusterSize = parseInt(document.getElementById('minclustersize').value, 10);

      zoom = zoom == -1 ? null : zoom;
      size = size == -1 ? null : size;


      for (var i = 0; i < datacont; ++i) {
        var latLng = datapoints[i];
        var marker = new google.maps.Marker({
          position: latLng,
          icon: markerImage
        });
        markers.push(marker);
      }

      markerClusterer = new MarkerClusterer(map, markers, {
        maxZoom: zoom,
        gridSize: size,
        styles: clusterStyles[0],
        zoomOnClick: false,
        minimumClusterSize: minClusterSize
      });
    }

    function initialize() {

      var latlngLA = new google.maps.LatLng(34.052, -118.243);

      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: latlngLA,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      map.setOptions({
        styles: mapStyles['night']
      });


      var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: latlngLA,
      radius: 100000
    });



      for (var i = 0; i < maxMarkerCount; i++) {
        datapoints[i] = new google.maps.LatLng(southWest.lat() + latSpan * Math.random(), southWest.lng() + lngSpan * Math.random());
      }

      var refresh = document.getElementById('refresh');
      google.maps.event.addDomListener(refresh, 'click', refreshMap);
      var clear = document.getElementById('clear');
      google.maps.event.addDomListener(clear, 'click', clearClusters);
      refreshMap();
    }

    function clearClusters(e) {
      e.preventDefault();
      e.stopPropagation();
      markerClusterer.clearMarkers();
    }
