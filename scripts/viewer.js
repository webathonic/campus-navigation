let mainMap = null;
 
function init(){
    // Define the map view
    let mainView = new ol.View({
        extent: [500000, 830000, 510000, 850000], // Adjusted extent for OAU campus
        center: [503397.87, 839120.93], // OAU campus center
        minZoom: 2,
        maxZoom: 20, // Increased max zoom for better details
        zoom: 10 // Adjusted initial zoom level
    });    
    
    // Initialize the map
    mainMap = new ol.Map({
        controls: [],
        target: 'map', /* Set the target to the ID of the map*/
        view: mainView,
        controls: []
    });
    
    let baseLayer = getBaseMap("osm");
    
    mainMap.addLayer(baseLayer);
 
}
 
 
function getBaseMap(name){
    let baseMaps = {
        "osm": {
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: ''
        },        
        "arcgis": {
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attributions: '&copy; <a href="https://www.esri.com/">Esri</a>'
        }, 
        "otm": {
            url: 'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
            attributions: 'Kartendaten: © OpenStreetMap-Mitwirkende, SRTM | Kartendarstellung: © OpenTopoMap (CC-BY-SA)'
        },
        "esri_wtm": {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            attributions: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        },
        "stadia_outdoor": {
            url: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
            attributions: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
        }       
    }
 
    layer = baseMaps[name];
    if (layer === undefined) {
        layer = baseMaps["osm"]
    }
 
    return (
        new ol.layer.Tile({
            name: "base",
            source: new ol.source.TileImage(layer)
        })
    )
}   
    

$(document).ready(function() {
    $(".panel").hide(); // Ensure panels are hidden when the page loads
});
function hidePanels(){
    $(".panel").hide();
}
 
function showPanel(id){
    hidePanels();
    $("#" + id).show();
}
 
$('.close-icon').on('click',function() {
    $(this).closest('.card').fadeOut();
})
function removeLayerByName(map, layer_name){
    let layerToRemove = null;
    map.getLayers().forEach(function (layer) {
        if (layer.get('name') != undefined && layer.get('name') === layer_name) {
            layerToRemove = layer;
        }
    });
 
    map.removeLayer(layerToRemove);
}
 
$("input[name=basemap]").click(function(evt){
    removeLayerByName(mainMap, "base");
    let baseLayer = getBaseMap(evt.target.value);
    mainMap.addLayer(baseLayer);    
})