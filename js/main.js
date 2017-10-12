/*$(document).click(function (e) {
    if (!$(e.target).is('a')) {
        $('.navbar-collapse').collapse('hide');
    }
});*/


$(document).ready(function(){
    $(".nav-tabs a").click(function (e) {
  e.preventDefault()
  $(this).tab('show')
    });
});

/*
$(document).ready(function dynamicTitle(){
    var x = document.URL;
    var title = "Spectrographies of the territory"
    var titre =  "Spectrographies du territoire"

    if (x == 'www.spectrographies.org/newyork/') {
        return document.getElementById("dynamicTitle").innerHTML = title;
    }
    else {
        return true
    };

});*/



$(function () {


    var map = L.map('map', {
        center: [place.lat, place.lon],
        zoom: place.zoom,
        zoomControl: false
    });

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    var mapBoxBW = L.tileLayer('https://api.mapbox.com/styles/v1/clementg123/cj7t110a70sfy2snvbs73dnsk/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2xlbWVudGcxMjMiLCJhIjoiY2o2M3ZhODh3MWxwNDJxbnJnaGZxcWNoMiJ9.YroDniTcealGFJgHtQ2hDg').addTo(map);

    var markerCluster = L.markerClusterGroup({

        iconCreateFunction: function (cluster) {
            var markerCluster = cluster.getAllChildMarkers();
            var html = '<div class="circle">' + markerCluster.length + '</div>';
            return L.divIcon({html: html, className: 'mycluster', iconSize: L.point(25, 25)});
        },
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
        removeOutsideVisibleBounds: true,
        maxClusterRadius: 6
    });

    fbFunction = function fbshareCurrentPage() {
        window.open("https://www.facebook.com/sharer/sharer.php?u=" + escape(window.location.href) + "&t=" + document.title, '',
            'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
        return false;
    }

    tweetFunction = function tweetCurrentPage() {
        window.open("https://twitter.com/intent/tweet?title=" + document.title + '&text= Spectrographies du territoire' + escape(window.location.href), '',
            'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
        return false;
    }

    var group = L.layerGroup();
    var marker = L.geoJSON();

    function getGeoJSON() {
        $.when(
            $.getJSON('https://web.fulcrumapp.com/shares/3a4bbd0435c58166.geojson')).done(function (theGeoJSON) {


            /**
             * Remove null values from the Fulcrum API Endpoint
             *
             **/

            (function removeNull(o) {
                for (var key in o) {
                    if (null === o[key]) o[key] = '';
                    if (typeof o[key] === 'object') removeNull(o[key]);
                }
            })(theGeoJSON);

            geojsonMarkerOptions = {};


            /**
             * Create the geoJSON container for the first time
             **/
            var markers = theGeoJSON.features;
            marker = L.geoJson(markers, {



                //** create a custom marker **//
                pointToLayer: pointToLayerFn,


                filter: function (feature, layer) {


                    if (feature.properties.status == 'Published') {
                        return true
                    }
                    else {
                        return false
                    }
                },

                //** create a custom marker **//
                onEachFeature: function(feature, layer) {
                    layer.bindPopup("loading...");

                }
            });
            ////////***** End of marker *****////////


            /**
             * Create a array for every desired properties
             *
             */
            var introMarker = L.geoJSON();
            var pseudoData = [];
            //  var typeData = [];
            var genreData = [];
            var titreData = [];
            //var typeAutreData =[];
            var genreAutreData = [];


            marker.eachLayer(function (layer) {

                pseudoData.push(layer.feature.properties.pseudo);
                //  typeData.push(layer.feature.properties.type.split(','));
                genreData.push(layer.feature.properties.genre.split(','));
                titreData.push(layer.feature.properties.titre);
                //  typeAutreData.push(layer.feature.properties.type_other.split(','));
                genreAutreData.push(layer.feature.properties.genre_other.split(','))
            });


            /******* Merging the Two Dimentional Arrays *******/
            var genreMerged = [].concat.apply([], genreData);
            //  var typeMerged = [].concat.apply([], typeData);
            //var typeAD = [].concat.apply([], typeAutreData);
            var genreAD = [].concat.apply([], genreAutreData);

            /*-----------------------------*/

            /******* Function that delete empty values*******/
            temp = [];

            for (let i of genreAD)
                i && temp.push(i); // copy each non-empty value to the 'temp' array

            genreAD = temp;
            delete temp;


            /******* Function that merge others *******/

            genreMerged.push.apply(genreMerged, genreAD);

            /*-----------------------------*/

            /******* Function that delete empty values *******/
            temp = [];

            for (let i of genreMerged)
                i && temp.push(i); // copy each non-empty value to the 'temp' array

            genreMerged = temp;
            delete temp;


            /******* Function that create unique values within the given array *******/
            Array.prototype.unique = function () {
                return this.filter(function (value, index, self) {
                    return self.indexOf(value) === index;
                });
            };

            /*-----------------------------*/

            //  var typeUnique = typeMerged.unique()
            var genreUnique = genreMerged.unique()

            /******* Create a selectBox *******/

            function pBox() {
                $('#participantBox').select2(
                    {
                        data: pseudoData.unique(),
                        allowClear: true,
                        placeholder: '...'
                    })
            }

            pBox();

            function tBox() {
                $('#typeBox').select2(
                    {
                        data: genreUnique,
                        allowClear: true,
                        placeholder: '...'
                    })
            }

            tBox();

            function gBox() {
                $('#genreBox').select2(
                    {
                        data: genreUnique,
                        allowClear: true,
                        placeholder: '...'

                    })
            }

            gBox();

            function titBox() {
                $('#titreBox').select2(
                    {
                        data: titreData.unique(),
                        allowClear: true,
                        placeholder: '...'
                    })
            }

            titBox();


            markerCluster.addLayer(marker);
            map.addLayer(markerCluster);

        })
    }


    getGeoJSON();


    /*---------------- END OF getGeoJSON -----------------*/


//////////////////////////// Filter Function ///////////////////////////////////
    function getFilterGeoJSON(value) {
        $.when(
            $.getJSON('https://web.fulcrumapp.com/shares/3a4bbd0435c58166.geojson')).done(function (theGeoJSON) {

                (function removeNull(o) {
                    for (var key in o) {
                        if (null === o[key]) o[key] = '';
                        if (typeof o[key] === 'object') removeNull(o[key]);
                    }
                })(theGeoJSON);

                markers = theGeoJSON.features;
                var menu = document.getElementById('menu');
                menu.style.visibility = 'visible';
/////  L.Geojson //////
                filteredMarker = new L.geoJSON(markers,
                    {


                        pointToLayer: pointToLayerFn,


                        filter: function (feature, layer) {

                            if (feature.properties.status == "Published") {
                                if (feature.properties.pseudo == value) {
                                    return feature.properties.pseudo = value
                                }
                                else if (feature.properties.genre.includes(value)) {
                                    return feature.properties.genre = value
                                }
                                else if (feature.properties.titre == value) {
                                    return feature.properties.titre = value
                                }
                                else if (feature.properties.genre_other.includes(value)) {
                                    return feature.properties.genre_other == value
                                }
                            }
                        },

                        onEachFeature: function(feature, layer) {
                    layer.bindPopup("loading...");

                }
                    });
                ////////***** End of marker *****////////


                //  markerCluster.clearLayers();
                map.removeLayer(markerCluster);
                map.removeLayer(filteredMarker);
                markerCluster.addLayer(filteredMarker);
                //  group.addLayer(filteredMarker);
                map.addLayer(filteredMarker);
                map.flyToBounds(filteredMarker)

            }
        )
    }


// Click outside the header info div collapse //
    /*
    $(document).click(function(e) {
        if (!$(e.target).is('a')) {
            $('.collapse').collapse('hide');
        }
    });
    */

    /**
     * Create JQuery functions for the SearchBoxes
     *
     *
     * @param name :
        * @param url :
        * @returns {*}
     */


    /********  PARTICIPANT ********/
    var filteredMarker;

    $("#participantBox")
        .on("select2:select", function (e) {

            $("#titreBox").val('').trigger("change");
            $('#genreBox').val('').trigger("change");
            $('#typeBox').val('').trigger("change");

            value = $(e.currentTarget).val();

            function testLayer() {
                if (map.hasLayer(filteredMarker)) {
                    return map.removeLayer(filteredMarker)
                }

                else {
                    return true
                }
                ;
            }

            testLayer()
            map.removeLayer(marker);
            getFilterGeoJSON(value)
        })

        .on("select2:unselect", function (e) {

            $('#participantBox').select2("close");

            function testLayer() {
                if (map.hasLayer(filteredMarker)) {
                    return map.removeLayer(filteredMarker)
                }

                else {
                    return true
                }
                ;
            }

            testLayer()

            map.removeLayer(filteredMarker)
            markerCluster.addLayer(marker);
            map.addLayer(markerCluster)
            map.flyToBounds(marker)
        })

    /*-----------------------------*/

    /********  TYPE ********/

    $("#typeBox")

        .on("select2:select", function (e) {

            $("#titreBox").val('').trigger("change");
            $("#participantBox").val('').trigger("change");
            $('#genreBox').val('').trigger("change");


            value = $(e.currentTarget).val();

            function testLayer() {
                if (map.hasLayer(filteredMarker)) {
                    return map.removeLayer(filteredMarker)
                }

                else {
                    return true
                }
                ;
            }

            testLayer()
            map.removeLayer(marker);
            getFilterGeoJSON(value)
        })

        .on("select2:unselect", function (e) {

            $('#participantBox').select2("close");

            function testLayer() {
                if (map.hasLayer(filteredMarker)) {
                    return map.removeLayer(filteredMarker)
                }

                else {
                    return true
                }
                ;
            }

            testLayer()
            map.removeLayer(filteredMarker)
            markerCluster.addLayer(marker);
            map.addLayer(markerCluster)
            map.flyToBounds(marker)
        })
    /*-----------------------------*/

    /********  GENRE ********/
    $("#genreBox")

        .on("select2:select", function (e) {

            $("#titreBox").val('').trigger("change");
            $("#participantBox").val('').trigger("change");
            $('#typeBox').val('').trigger("change");

            value = $(e.currentTarget).val();

            function testLayer() {
                if (map.hasLayer(filteredMarker)) {
                    return map.removeLayer(filteredMarker)
                }

                else {
                    return true
                }
                ;
            }

            testLayer()
            map.removeLayer(marker);
            getFilterGeoJSON(value)
        })

        .on("select2:unselect", function (e) {

            $('#participantBox').select2("close");

            function testLayer() {
                if (map.hasLayer(filteredMarker)) {
                    return map.removeLayer(filteredMarker)
                }

                else {
                    return true
                }
                ;
            }

            testLayer()
            map.removeLayer(filteredMarker)
            markerCluster.addLayer(marker);
            map.addLayer(markerCluster)
            map.flyToBounds(marker)
        })

    /*-----------------------------*/

    /********  TITRE ********/
    $("#titreBox")

        .on("select2:select", function (e) {

            $("#participantBox").val('').trigger("change");
            $("#genreBox").val('').trigger("change");
            $('#typeBox').val('').trigger("change");

            value = $(e.currentTarget).val();

            function testLayer() {
                if (map.hasLayer(filteredMarker)) {
                    return map.removeLayer(filteredMarker)
                }

                else {
                    return true
                }
                ;
            }

            testLayer()
            map.removeLayer(marker);
            getFilterGeoJSON(value)
        })

        .on("select2:unselect", function (e) {

            $('#participantBox').select2("close");

            function testLayer() {
                if (map.hasLayer(filteredMarker)) {
                    return map.removeLayer(filteredMarker)
                }

                else {
                    return true
                }
                ;
            }

            testLayer()
            map.removeLayer(filteredMarker)
            markerCluster.addLayer(marker);
            map.addLayer(markerCluster)
            map.flyToBounds(marker)

        })


    /**
     * Get a search parameter by its name
     * https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
     *
     * @param name :  string Name of the parameters
     * @param url : string URL to parse
     * @returns {*}
     */
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    /**
     * Array of the photos associated to the photos url
     *
     * @param photos_url
     * @returns {Array|*}
     */
    function photos_uuid(photos_url) {
        return getParameterByName('photos', photos_url).split(',');
    }

    /**
     * Create a string representing the div for every photos from a photo url
     * @param photos_url
     * @returns {string}
     */
    function divsFromPhotosUrl(photos_url) {
        var baseURL = "https://web.fulcrumapp.com/shares/3a4bbd0435c58166/photos/";
        var EndURL = "/thumbnail.jpg"
        var photos = photos_uuid(photos_url);
        var divsAsText = '';
        var currentDiv;
        for (var i = 0; i < photos.length; i++) {
            if (i == 0) {
                currentDiv = '<div class="item active"><img class="d-block img-fluid" src="' + baseURL + photos[i] +  '" id="img' + i + '" ></div>';
            } else {
                currentDiv = '<div class="item"><img class="d-block img-fluid" src="' + baseURL + photos[i] +  '" id="img' + i + '" ></div>';
            }

            divsAsText = divsAsText + currentDiv;
        }

        return divsAsText;
    }

 map.on('popupopen', function (e) {
         /***** !! Auto Pan to the center of the popup ToolTip !! *****/
         var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
         px.y -= e.popup._container.clientHeight / 2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
         map.panTo(map.unproject(px), {animate: true}); // pan to new center
});

    var makePopup = function (feature) {
        console.log("onEachFeature");
        var categories;
        var catAsText;


        function colorPopup(categories) {
            if (categories === "Anecdote / Anecdote") {
                return currentDiv = '<div id="popUpOpen"><div class="panel panel-Anecdote">';
            }
            else if (categories === 'Commentaire / Comment') {
                return currentDiv = '<div id="popUpOpen"><div class="panel panel-Comment">';
            }
            else if (categories === 'Souvenir / Memory') {
                return currentDiv = '<div id="popUpOpen"><div class="panel panel-Memory">';
            }
            else if (categories === 'Récit / Narrative') {
                return currentDiv = '<div id="popUpOpen"><div class="panel panel-Narrative">';
            }
            else if (categories === 'Référence historique / Historical reference') {
                return currentDiv = '<div id="popUpOpen"><div class="panel panel-Historical">';
            }
            else if (categories === 'Création / Creation') {
                return currentDiv = '<div id="popUpOpen"><div class="panel panel-Creation">';
            }
            else if (categories === 'Observation / Observation') {
                return currentDiv = '<div id="popUpOpen"><div class="panel panel-Observation">';
            }
            else if (categories === 'Réflexion / Reflection') {
                return currentDiv = '<div id="popUpOpen"><div class="panel panel-Reflection">';
            }

            else {
                return currentDiv = '<div id="popUpOpen"><div class="panel panel-popup">';
            }

        };

        descr = feature.properties.description;

        var modalString = '<div class="panel " id="panelRecit"><div class="panel-heading text-justify"'
            + '<h2>'
            + feature.properties.titre
            + '</h2></div>'
            + '<div class="panel-body text-justify ">'
            + feature.properties.description
            + '<br><br><h3 style="display: inline !important; font-weight: bold;  "> Catégorie(s) / Category(ies) : </h3><p style="display: inline !important;">'
            + feature.properties.genre + ' ' + feature.properties.genre_other
            + '</p><br><br>'

            // Autoportrait //

            + '<div class="panel " style="background-color:rgba(255,255,255,0)!important;" >'
            + '<div class="panel-heading col-sm-12 ">'

            + '<div class= "col">'
            + '<img  id="selfie" class="  img-responsive  d-flex  " src="'
            + feature.properties.autoportrait_url.replace('view?photos=', '')
            + '"</img>'
            + '</div></div>'

            // Autoportrait -- Auteur()//

            + '<div class="panel-body">'
            + '<div class=" row text-justify ">'
            + '<h3  style="display: inline !important font-weight: bold; margin-left:-10px; ;"> Auteur(e)(s) / Author(s): </h3><p style="display: inline !important;">'
            + feature.properties.pseudo

            // Autoportrait -- Relation au lieu()//

            + '</p><div class=" text-justify ">'
            + '<h3 style="display: inline !important font-weight: bold; margin-left:-10px; ;">  Relation au lieu / Relationship to the area : </h3><p style="display: inline !important;">'
            + feature.properties.relation_au_lieu
            + '</p></div>'
            + '</div></div>'


            // Audio //

            + '<div class="row ">'

            // Audio visisble en mode tablette et desktop //

            + '<div class="audio-player hidden-sm col-sm-10 ">'
            //+'<audio controls controls controlsList="nodownload"><source src="'
            + '<audio id="audio-player" controls  controls controlsList="nodownload"><source src="'
            + feature.properties.audio_url.replace('view?audio=', '')
            //+feature.properties.audio_url.replace('view?audio=','')
            + '"</audio></div>'

            // Audio visible en mode cellulaire //

            + '<div class="visible-sm col-xs-8 r">'
            + '<audio id="audioXS" controls><source src="'
            + feature.properties.audio_url.replace('view?audio=', '')

            //+feature.properties.audio_url.replace('view?audio=','')
            + '"</audio></div>'
            + '</div></div></div></div></div>';


        /// Bind all the data to the pop ///
        var popupContentString =            colorPopup(feature.properties.genre)

            /*  +'<div class="panel panel-popup">'*/
            + '<div id="popUpPanel" class="panel-heading"> '
            + '<a href="#" id="titrePopUp">'
            + '<h2>'

            // Pop Up Content

            + feature.properties.titre
            + '</h2></a></div>'
            + '<div class="panel-body">'
            + '<h3 style="display:inline">'
            + feature.properties.genre + ' ' + feature.properties.genre_other
            //  +' & '
            //  +feature.properties.type + ' ' + feature.properties.type_other
            + '</h3>'

            + '<div class=""><h4> par : '
            + feature.properties.pseudo
            + '</h4></div></div>'

            // Modal Section Content //


            // Image section
            + '<div id="popUpImg" class="media"><img class=" img-responsive d-flex center-block" id="myImg"'
            // Alt section with all the data for the modal popup

            // End of alt attribution
            // Caroussel
            + '" src="'
            //+photosPreURL+first
            + feature.properties.photos_url.substring(0, 106).replace('view?photos=', '')
            + '/thumbnail.jpg"></img></div>'

            // Socials //
            + '<div class="row"><div id="socials" class="col-sm-12 center-block text-center">'
            + '<a class="btn btn-social-icon btn-facebook" href="'
            + 'javascript:'
            + 'fbFunction()'
            + '"><i class="fa fa-facebook"></i></a>'
            + '<a class="btn btn-social-icon btn-twitter"  href="javascript:tweetFunction()" target="_blank"><i class="fa fa-twitter"></i></a>'
            + '<a class="btn btn-social-icon" href="mailto:spectro.terrritoire@gmail.com?subject=Spectrographies&amp;body=Visitez&nbsp;notre&nbsp;page&nbsp;internet&nbsp;Spetrographies&nbsp;-&nbsp;Visit&nbsp;our&nbsp;webpage&nbsp;Spectrographies&nbsp;%0D%0A %0D%0A http://spectrographies.org" target="_blank""><i class="fa fa-envelope-o"></i></a>'
            + '</div></div></div></div></div>';

        var popupContent = $.parseHTML(popupContentString);

        var modalContent = $.parseHTML(modalString);

        var showMe = function () {
            map.closePopup();
            $("#menu").css("visibility", 'hidden');
            $("#myModal").css("display", "block");
            $("#caption").html(modalContent);

            var feature_photos_url = feature.properties.photos_url;
            $("#carousel-inner").html(divsFromPhotosUrl(feature_photos_url));
        };

        $(popupContent).find("#titrePopUp").bind("click", showMe);



        $(popupContent).find("#myImg").bind("click", showMe);

        $(".close").bind("click", function () {
            $("#myModal").css("display", "none");
            $("#menu").css("visibility", 'visible');
        });

        categories = feature.properties.genre;
        catAsText = '';
        return popupContent[0];
    };

    var pointToLayerFn = function (feature, latlng) {

        var myMarker;

        switch (feature.properties.genre) {
            case "Anecdote / Anecdote":
                myMarker = L.circleMarker(latlng, {
                    color: 'rgb(255,255,0)',
                    radius: 8,
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.5
                });
                break;
            case "Commentaire / Comment":
                myMarker = L.circleMarker(latlng, {
                    color: "rgb(255,102,0)",
                    radius: 8,
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.5
                });
                break;
            case "Souvenir / Memory":
                myMarker = L.circleMarker(latlng, {
                    color: "rgb(255,0,0)",
                    radius: 8,
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.5
                });
                break;
            case "Récit / Narrative":
                myMarker = L.circleMarker(latlng, {
                    color: "rgb(255,0,255)",
                    radius: 8,
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.5
                });
                break;
            case "Référence historique / Historical reference":
                myMarker =  L.circleMarker(latlng, {
                    color: " rgb(204,0,255)",
                    radius: 8,
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.5
                });
                break;
            case "Création / Creation":
                myMarker =  L.circleMarker(latlng, {
                    color: "rgb(0,0,255)",
                    radius: 8,
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.5
                });
                break;
            case "Observation / Observation":
                myMarker = L.circleMarker(latlng, {
                    color: "rgb(0,0,153) ",
                    radius: 8,
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.5
                });
                break;
            case "Réflexion / Reflection":
                myMarker =  L.circleMarker(latlng, {
                    color: "rgb(0,0,0)",
                    radius: 8,
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.5
                });
                break;
            default:
                myMarker = L.circleMarker(latlng, {
                    color: 'rgb(66, 244, 226)',
                    radius: 8,
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.5
                });
        }

        myMarker.on("click", function(e) {
            console.log("clicked!", e);
            var content = makePopup(e.target.feature);
            e.target._popup.setContent(content);
        })

        return myMarker;
    }


});
