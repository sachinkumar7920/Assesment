require([
    "esri/Map",
    "esri/views/MapView",
    "esri/geometry/geometryEngine",
    "esri/Graphic"
], function(Map, MapView, geometryEngine, Graphic) {

    // Create the map
    var map = new Map({
        basemap: "topo-vector"
    });

    // Create the MapView
    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-100.33, 43.69], // Initial map center
        zoom: 4
    });

    // Variables to store points
    let point1, point2;

    // Listen for map click event
    view.on("click", function(event) {
        if (!point1) {
            point1 = event.mapPoint;
            addPoint(point1);
        } else if (!point2) {
            point2 = event.mapPoint;
            addPoint(point2);
            measureDistance(point1, point2);
        } else {
            // Reset points
            point1 = event.mapPoint;
            point2 = null;
            view.graphics.removeAll();
            addPoint(point1);
        }
    });

    // Function to add a point graphic on the map
    function addPoint(point) {
        const pointGraphic = new Graphic({
            geometry: point,
            symbol: {
                type: "simple-marker",
                color: "red",
                size: "8px"
            }
        });
        view.graphics.add(pointGraphic);
    }

    // Function to measure and display the geodesic distance
    function measureDistance(p1, p2) {
        const distance = geometryEngine.geodesicLength({
            type: "polyline",
            paths: [
                [p1.x, p1.y],
                [p2.x, p2.y]
            ]
        }, "kilometers");

        // Display the distance on the map
        const lineGraphic = new Graphic({
            geometry: {
                type: "polyline",
                paths: [
                    [p1.x, p1.y],
                    [p2.x, p2.y]
                ]
            },
            symbol: {
                type: "simple-line",
                color: "blue",
                width: "2px"
            }
        });

        const textGraphic = new Graphic({
            geometry: p2,
            symbol: {
                type: "text",
                color: "black",
                text: distance.toFixed(2) + " km",
                xoffset: 3,
                yoffset: 3,
                font: {
                    size: 12,
                    family: "sans-serif"
                }
            }
        });

        view.graphics.add(lineGraphic);
        view.graphics.add(textGraphic);
    }
});
