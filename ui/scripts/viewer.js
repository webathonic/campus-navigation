let baseUrl = "http://127.0.0.1:5501/ui";
let mainMap = null;
let poi_data;
let popover;

let LAT = 7.5162813;
let LON = 4.553;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      LON = pos.coords.longitude;
      LAT = pos.coords.latitude;
    },
    (err) => reject(err)
  );
} else {
  reject("Geolocation not supported");
}

const check_page = window.location.pathname.split("/").pop();
const idToken = localStorage.getItem("idToken");

function poi_call() {
  axios
    .get("http://localhost:5000/spatial/plots")
    .then((response) => {
      pois = response.data.data;
      // console.log("poi_data...", pois);

      pois.map((poi) =>
        mainMap.addLayer(marker(Number(poi.long), Number(poi.lat), poi))
      );
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}

function buildings_poly(points, identify = false) {
  const building = {
    type: "Feature",
    geometry: {
      type: "MultiPolygon",
      coordinates: points,
    },
  };

  const vectorSource = new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(building, {
      featureProjection: "EPSG:3857", // convert from WGS84 to Web Mercator
    }),
  });

  const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: identify ? "rgba(189, 234, 64, 1)" : "blue",
        width: 2,
      }),
      fill: new ol.style.Fill({
        color: identify ? "rgba(189, 234, 64, 1)" : "rgba(0, 0, 255, 0.3)",
      }),
    }),
  });

  return vectorLayer;
}

function roads_poly(coords) {
  const lineCoords = coords.map((c) => ol.proj.fromLonLat(c));

  const road = new ol.Feature({
    geometry: new ol.geom.LineString(lineCoords),
    name: "Main Road",
  });

  // Style the road
  road.setStyle(
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "brown",
        width: 1,
      }),
    })
  );

  // Add to vector source/layer
  const roadSource = new ol.source.Vector({
    features: [road],
  });

  const roadLayer = new ol.layer.Vector({
    source: roadSource,
  });

  return roadLayer;
}

function buildings_call() {
  axios
    .get("http://localhost:5000/spatial/buildings")
    .then((response) => {
      buildings = response.data.data;

      buildings.map((building) => {
        const v = building.geometry.split("coordinates").slice(-1);
        const myformat = v[0]
          .replace("'", "")
          .replace(":", "")
          .replace('"', "")
          .replace("}", "");

        return mainMap.addLayer(buildings_poly(JSON.parse(myformat)));
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}

function roads_call() {
  axios
    .get("http://localhost:5000/spatial/roads")
    .then((response) => {
      roads = response.data.data;
      // console.log("road_data...", roads);

      roads.map((road) => {
        const v = road.geometry.split("coordinates").slice(-1);
        const myformat = v[0]
          .replace("'", "")
          .replace(":", "")
          .replace('"', "")
          .replace("}", "");

        const myformat_road = JSON.parse(myformat)[0];

        return mainMap.addLayer(roads_poly(myformat_road));
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}

function marker(long, lat, data) {
  // <img src="${data.placepageu}" alt="${data.name}" />
  const marker = new ol.Feature({
    // geometry: new ol.geom.Point(ol.proj.fromLonLat([4.5228, 7.5194])),
    geometry: new ol.geom.Point(ol.proj.fromLonLat([long, lat])),
    name: `<div>
    <div id="card-body">
      <div class="flx">
        <img src="./images/locationicon.png" height="12px" />
        <span>${data.name}</span>
      </div>
      <img src="${data.imagelink}" alt="${data.name}" />
    `,
  });
  marker.setStyle(
    new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: "./images/marker.png",
        // scale: 0.03,
        scale: 0.2,
      }),
    })
  );

  const vectorSource = new ol.source.Vector({
    features: [marker],
  });
  const markerLayer = new ol.layer.Vector({
    source: vectorSource,
  });

  return markerLayer;
}

function init() {
  // Define the map view
  let mainView = new ol.View({
    extent: [500000, 830000, 510000, 850000], // Adjusted extent for OAU campus
    center: [503397.87, 839120.93], // OAU campus center
    minZoom: -200,
    maxZoom: 50, // Increased max zoom for better details
    zoom: 50, // Adjusted initial zoom level
  });

  // Initialize the map
  mainMap = new ol.Map({
    controls: [],
    target: "map" /* Set the target to the ID of the map*/,
    view: mainView,
    controls: [],
  });

  let baseLayer = getBaseMap("osm");

  mainMap.addLayer(baseLayer);

  showPointDetails(mainMap);

  roads_call();
  idToken ? buildings_call() : "";
  poi_call();
  myCurrentLocation(mainMap);
}

function getBaseMap(name) {
  let baseMaps = {
    osm: {
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attributions: "",
    },
    arcgis: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attributions: '&copy; <a href="https://www.esri.com/">Esri</a>',
    },
    otm: {
      url: "https://b.tile.opentopomap.org/{z}/{x}/{y}.png",
      attributions:
        "Kartendaten: © OpenStreetMap-Mitwirkende, SRTM | Kartendarstellung: © OpenTopoMap (CC-BY-SA)",
    },
    esri_wtm: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      attributions:
        "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
    },
    stadia_outdoor: {
      url: "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png",
      attributions:
        "Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",
    },
  };

  layer = baseMaps[name];
  if (layer === undefined) {
    layer = baseMaps["osm"];
  }

  return new ol.layer.Tile({
    name: "base",
    source: new ol.source.TileImage(layer),
  });
}

function zoomToLocation(lon, lat) {
  const view = markerLayer.getView();
  view.animate({
    center: ol.proj.fromLonLat([lon, lat]),
    zoom: 16, // set zoom level
    duration: 1000, // smooth animation (in ms)
  });
}

function myCurrentLocation(mainMap) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        // const lat = LAT;
        // const lon = LON;
        console.log("Latitude:", lat, "Longitude:", lon);
        const center = ol.proj.fromLonLat([lon, lat]);

        const marker = new ol.Feature({
          geometry: new ol.geom.Point(center),
          name: `<div>
    <div id="card-body">
      <div class="flx">
        <img src="./images/locationicon.png" height="12px" />
        <span>Your Location</span>
      </div>
    `,
        });
        marker.setStyle(
          new ol.style.Style({
            image: new ol.style.Icon({
              anchor: [0.5, 1],
              src: "./images/locationicon.png",
              // scale: 0.03,
              scale: 0.1,
            }),
          })
        );

        const vectorSource = new ol.source.Vector({
          features: [marker],
        });
        const markerLayer = new ol.layer.Vector({
          source: vectorSource,
        });

        mainMap.addLayer(markerLayer);
        // zoomToLocation(lon, lat);

        mainMap.getView().animate({
          center,
          zoom: 10,
          duration: 1000,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true, // request GPS if available
        timeout: 10000, // wait up to 10 seconds
        maximumAge: 0, // do not use cached location
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

$(document).ready(function () {
  $(".panel").hide(); // Ensure panels are hidden when the page loads
});
function hidePanels() {
  $(".panel").hide();
}

function showPanel(id) {
  hidePanels();
  $("#" + id).show();
}

$(".close-icon").on("click", function () {
  $(this).closest(".card").fadeOut();
});

function removeLayerByName(map, layer_name) {
  let layerToRemove = null;
  map.getLayers().forEach(function (layer) {
    if (layer.get("name") != undefined && layer.get("name") === layer_name) {
      layerToRemove = layer;
    }
  });

  map.removeLayer(layerToRemove);
}

$("input[name=basemap]").click(async function (evt) {
  removeLayerByName(mainMap, "base");
  let baseLayer = getBaseMap(evt.target.value);
  mainMap.addLayer(baseLayer);
  roads_call();
  idToken ? buildings_call() : "";
  poi_call();
  myCurrentLocation(mainMap);
});

function disposePopover() {
  if (popover) {
    popover.dispose();
    popover = undefined;
  }
}

function showPointDetails(mainMap) {
  mainMap.on("click", function (evt) {
    const element = document.getElementById("popup");
    const popup = new ol.Overlay({
      element: element,
      positioning: "bottom-center",
      stopEvent: false,
    });
    mainMap.addOverlay(popup);

    const feature = mainMap.forEachFeatureAtPixel(
      evt.pixel,
      function (feature) {
        return feature;
      }
    );

    disposePopover();
    if (!feature) {
      return;
    }
    popup.setPosition(evt.coordinate);
    popover = new bootstrap.Popover(element, {
      placement: "top",
      html: true,
      content: feature.get("name"),
    });
    popover.show();
  });
}
