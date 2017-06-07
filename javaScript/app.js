var token = 'Bearer AAAAAAAAAAAAAAAAAAAAACuS0wAAAAAA2s5TNT5STESnlAzvW8P8OdEf0Vw%3DgHl0L5VI1kbDEgALJbRuBPPG49mKI4c2PkrXf5nc7Pm7XKT7ZM';

var $;
var createMarkers = createMarkers, pinsArray = [], map = map, turf = turf, lastDestination;

// $.ajax({
//   type: "GET",
//   url: "requests.php",
//   success:(data) => {

//   	var twitterLocations = JSON.parse(data);

// 		twitterLocations.forEach((item) => {

// 			const obj = {
//         "type": "Feature",
//         "properties": {
//             "message": item.text,
//             "iconSize": [50, 50],
//             "url": 'url("http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png")'
//         },
//         "geometry": {
//             "type": "Point",
//             "coordinates": [item.lng, item.lat]
//         }
//     	};
    	
//     	pinsArray.push(obj);
//     	return createMarkers(obj);
// 		});
//   },
//   error: (data) => {
//   	console.log(data);
//   }
// });

var moveToLocation = (ele) => {
	
	var latLong = ele.id;

	if(lastDestination) {

		map.removeLayer('point1');
		map.removeSource('point1');
		map.removeLayer('route1');
		map.removeSource('route1');
	}

	// return map.flyTo({
		        
 //      center: latLong.split(", ").map(Number),
 //      zoom: 16,
 //      pitch: 75,
 //      bearing: 80,
 //      speed: 1.25,
 //      curve: 0.5
 //     //  easing: (t) => {
 //     //    return t * (2 - t);
 //    	// }
 //  });

	return pointAnimate(latLong.split(", ").map(Number));
};


var pointAnimate = (latLong) => {

	var origin = lastDestination || map.getCenter().wrap().toArray();

	var destination = latLong;
	lastDestination = destination;

	var route1 = {
	    "type": "FeatureCollection",
	    "features": [{
	        "type": "Feature",
	        "geometry": {
	            "type": "LineString",
	            "coordinates": [
	                origin,
	                destination
	            ]
	        }
	    }]
	};

	var point1 = {
	    "type": "FeatureCollection",
	    "features": [{
	        "type": "Feature",
	        "geometry": {
	            "type": "Point",
	            "coordinates": origin
	        }
	    }]
	};

	// Calculate the distance in kilometers between route1 start/end point.
	var lineDistance = turf.lineDistance(route1.features[0], 'kilometers');

	var arc = [], speed = 200;

	// Draw an arc between the `origin` & `destination` of the two points
	for (var i = 0; i < lineDistance; i++) {
	    var segment = turf.along(route1.features[0], i / speed * lineDistance, 'kilometers');
	    arc.push(segment.geometry.coordinates);
	}

	// Update the route1 with calculated arc coordinates
	route1.features[0].geometry.coordinates = arc;

	// Used to increment the value of the point measurement against the route1.
	var counter = 0;

    // Add a source and layer displaying a point which will be animated in a circle.
    map.addSource('route1', {
        "type": "geojson",
        "data": route1
    });

    map.addSource('point1', {
        "type": "geojson",
        "data": point1
    });

    map.addLayer({
        "id": "route1",
        "source": "route1",
        "type": "line",
        "paint": {
            "line-width": 5,
            "line-color": "#007cbf"
        }
    });

    map.addLayer({
        "id": "point1",
        "source": "point1",
        "type": "symbol",
        "layout": {
            "icon-image": "airport-15",
            "icon-rotate": 90
        }
    });

    function animate() {

    	 map.flyTo({center: route1.features[0].geometry.coordinates[speed], speed: 1, curve: 1, zoom: 6});
    	console.log(0.0011 * lineDistance);
        // Update point geometry to a new position based on counter denoting
        // the index to access the arc.
        point1.features[0].geometry.coordinates = route1.features[0].geometry.coordinates[counter];

        // Update the source with this new data.
        map.getSource('point1').setData(point1);

        // Request the next frame of animation so long as destination has not
        // been reached.
        if (point1.features[0].geometry.coordinates[0] !== destination[0]) {
            requestAnimationFrame(animate);
        }
        else {

        	map.flyTo({center: route1.features[0].geometry.coordinates[speed], zoom: 15, curve: 2});
        }

        counter = counter + 1;
    }

    // document.getElementById('replay').addEventListener('click', function() {
    //     // Set the coordinates of the original point back to origin
    //     point1.features[0].geometry.coordinates = origin;

    //     // Update the source layer
    //     map.getSource('point1').setData(point1);

    //     // Reset the counter
    //     counter = 0;

    //     // Restart the animation.
    //     animate(counter);
    // });

    // Start the animation.
    animate(counter);
};