let mainMap = null;
let poi_data;
let popover;

function poi_call() {
  axios
    .get("http://localhost:5000/spatial/plots")
    .then(function (response) {
      pois = response.data.data;
      console.log("poi_data...", pois);

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

function marker(long, lat, data) {
  console.log(data.placepageu);
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
  const markeLrayer = new ol.layer.Vector({
    source: vectorSource,
  });

  return markeLrayer;
}

function init() {
  // Define the map view
  let mainView = new ol.View({
    extent: [500000, 830000, 510000, 850000], // Adjusted extent for OAU campus
    center: [503397.87, 839120.93], // OAU campus center
    minZoom: 2,
    maxZoom: 20, // Increased max zoom for better details
    zoom: 10, // Adjusted initial zoom level
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

  poi_call();
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
  poi_call();
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
