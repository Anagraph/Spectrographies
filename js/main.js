$(function() {

var mapZentoken = L.Mapzen.apiKey = 'mapzen-3CAQoBZ';


var map = L.Mapzen.map('map', {
  //center: [45.5237019,-73.6197287],
  //zoom: 12,
  minZoom:10,
  maxZoom: 18,
  tangramOptions: {
    scene: {
      import: [
        'https://mapzen.com/carto/refill-style/8/refill-style.zip',
        'https://mapzen.com/carto/refill-style/8/themes/color-pink.zip'
      ] } }
});

//var map = L.map('map', {
 //         zoomControl: true})



var mapBoxWhite = L.tileLayer('https://api.mapbox.com/styles/v1/clementg123/cj66rikp37hgc2rltvyo7eepa/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2xlbWVudGcxMjMiLCJhIjoiY2o2M3ZhODh3MWxwNDJxbnJnaGZxcWNoMiJ9.YroDniTcealGFJgHtQ2hDg')
var mapBoxCyber = L.tileLayer('https://api.mapbox.com/styles/v1/clementg123/cj6guz4ve3stv2rp4y9ftqbti/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2xlbWVudGcxMjMiLCJhIjoiY2o2M3ZhODh3MWxwNDJxbnJnaGZxcWNoMiJ9.YroDniTcealGFJgHtQ2hDg')
var mapBoxDark =  L.tileLayer('https://api.mapbox.com/styles/v1/clementg123/cj66v7isf7jji2soaolfu28sy/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2xlbWVudGcxMjMiLCJhIjoiY2o2M3ZhODh3MWxwNDJxbnJnaGZxcWNoMiJ9.YroDniTcealGFJgHtQ2hDg')
var stamenToner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 18,
  ext: 'png'
});

 fbFunction = function fbshareCurrentPage()
        {window.open("https://www.facebook.com/sharer/sharer.php?u="+escape(window.location.href)+"&t="+document.title, '   ',
        'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
        return false; }

 tweetFunction =    function tweetCurrentPage()
                {window.open("https://twitter.com/intent/tweet?title="+document.title+'&text= Spectrographie(s)   '+escape(window.location.href),'',
                'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                return false; }


function toggleLayer() {
 var baseMaps = {

         'MapBox White ': mapBoxWhite,
         'MapBox Dark  ': mapBoxDark,
         'MapBox Cyber ': mapBoxCyber,
         'Stamen Toner ': stamenToner


 };

 L.control.layers(null,baseMaps).addTo(map);
}
toggleLayer();


var markerCluster = L.markerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  removeOutsideVisibleBounds: true,
  maxClusterRadius: 50

});

var group = L.layerGroup();
var marker = L.geoJSON();

function getGeoJSON() {
$.when(
 $.getJSON('https://web.fulcrumapp.com/shares/3a4bbd0435c58166.geojson')).done(function(theGeoJSON) {



        /**
         * Remove null values from the Fulcrum API Endpoint
         *
         **/

          (function removeNull(o) {
                for(var key in o) {
                    if( null === o[key] ) o[key] = '';
                    if ( typeof o[key] === 'object' ) removeNull(o[key]);
                }
             })(theGeoJSON);




        /**
         * Create the geoJSON container for the first time
         **/
        var markers = theGeoJSON.features;
        marker = new L.geoJSON(markers, {

            //** create a custom marker **//
          pointToLayer: function(feature, latlng) {

             var customMarker = new L.ExtraMarkers.icon(
             {
                  icon: 'glyphicon-eye-open',
                  markerColor: 'cyan',
                  shape: 'penta',
                  prefix: 'glyphicon'
                });

                return L.marker(latlng, {icon:customMarker})
              },


              filter: function(feature, layer) {


                if (feature.properties.status == 'Published') {return true}
                else {return false}
              },

        //** create a custom marker **//
          onEachFeature: function(feature, layer) {

        map.on('popupopen', function (e) {

              var h2 = document.getElementById('titrePopUp');
              var img = document.getElementById('myImg');
              var modal = document.getElementById('myModal');
              var captionText = document.getElementById("caption");
              var carouselDiv = document.getElementById("carousel-inner");


        //** Create the modal on the click function **//
          img.onclick = function(){

            map.closePopup();
            modal.style.display = "block";
            captionText.innerHTML = img.alt;

            var feature_photos_url = e.popup._source.feature.properties.photos_url;
            var feature_photos_uuid = photos_uuid(feature_photos_url);
            carouselDiv.innerHTML = divsFromPhotosUrl(feature_photos_url);
          };

            h2.onclick = function(){
            map.closePopup();
            modal.style.display = "block";
            captionText.innerHTML = img.alt;

            var feature_photos_url = e.popup._source.feature.properties.photos_url;
            var feature_photos_uuid = photos_uuid(feature_photos_url);
            carouselDiv.innerHTML = divsFromPhotosUrl(feature_photos_url);


              };


            var span = document.getElementsByClassName("close")[0];
              span.onclick = function() {
                  modal.style.display = "none";
              }
        });


        /// Bind all the data to the pop ///
        layer.bindPopup(



        '<div id=&quot;popUpOpen" class="">'


        +'<div class="panel panel-default"><div id="popUpPanel" class="panel-heading "> '
        +'<a href="#" id="titrePopUp">'
        +'<h2>'

        // Pop Up Content

          +feature.properties.titre
          +'</h2></a></div>'
          +'<div class="panel-body">'
          +'<h3 style="display:inline">'
          +feature.properties.genre + ' ' + feature.properties.genre_other
          +' & '
          +feature.properties.type + ' ' + feature.properties.type_other
          +'</h3>'

          +'<div class=""><h4> Par : '
          +feature.properties.pseudo
          +'</h4></div></div>'

         // Modal Section Content //





            // Image section
            +'<div id="popUpImg" class="media"><img class=" img-thumbnail img-responsive d-flex center-block" id="myImg"'
            // Alt section with all the data for the modal popup
                    +' alt="'
                    +'<div class=&quot;panel panel-default&quot;><div class=&quot;panel-heading&quot;>'
                    +'<h2>'
                    +feature.properties.titre
                    +'</h2></div>'
                    +'<br>'
                    +'<div class=&quot;panel-body&quot; ><h3 style=&quot;display: inline !important;&quot;> Genre : </h3><h4 style=&quot;display: inline !important;&quot;>'
                    + feature.properties.genre + ' ' + feature.properties.genre_other
                    +'</h4><br><br><h3 style=&quot;display: inline !important;&quot;> Type : </h3><h4 style=&quot;display: inline !important;&quot;>'
                    + feature.properties.type + ' ' + feature.properties.type_other
                    +'</h4><br><h3> Contexte : </h3><p>'
                    +feature.properties.description
                    +'</p>'
                    +'<div class=&quot;panel panel-default &quot; >'
                    +'<div class=&quot;panel-heading col-sm-12 &quot;>'
                    +'<h3 style=&quot;display: inline !important;&quot;> Auteur : </h3><h4 style=&quot;display: inline !important;&quot;>'
                    +feature.properties.pseudo
                     // Autoportrait //
                    +'</h4></div>'
                    +'<div class=&quot;panel-body&quot;>'
                      +'<div class=&quot; row &quot;>'

                      +'<div class=&quot; col-sm-6 &quot;>'
                          +'<h3> Relation au lieu : </h3><p>'
                            +feature.properties.relation_au_lieu
                              +'</p></div>'

                      +'<div  class= &quot;col-sm-6 align-content-center&quot;>'
                          +'<h3></h3><img  id=&quot;selfie&quot; class=&quot;  img-thumbnail  d-flex center-block &quot; src=&quot;'
                            +feature.properties.autoportrait_url.replace('view?photos=','')
                            +'&quot;</img>'
                          +'</div>'

                    +'</div></div>'

                    // Audio //
                    +'<div class=&quot;row &quot;>'
                    +'<div class=&quot; hidden-xs col-sm-10 col-sm-push-1 well text-center&quot;>'
                    //+'<audio controls controls controlsList=&quot;nodownload&quot;><source src=&quot;'
                    +'<audio controls  controls controlsList=&quot;nodownload&quot;><source src=&quot;'
                    +feature.properties.audio_url.replace('view?audio=','')
                    //+feature.properties.audio_url.replace('view?audio=','')
                    +'&quot;</audio></div>'
                    +'<div class=&quot;visible-xs well col-xs-8 col-xs-push-2 align-content-center&quot;>'
                    +'<audio id=&quot;audioXS&quot; controls><source src=&quot;'
                    +feature.properties.audio_url.replace('view?audio=','')

                                //+feature.properties.audio_url.replace('view?audio=','')
                    +'&quot;</audio></div>'
                    +'</div></div></div></div></div>'
                    // End of alt attribution
                    // Caroussel
            +'" src="'
            //+photosPreURL+first
            +feature.properties.photos_url.substring(0,106).replace('view?photos=','')
            +'"></img></div>'

        // Socials //
         +'<div class="row"><div id="socials" class="col-sm-12 center-block text-center">'

         +'<a class="btn btn-social-icon btn-facebook" href="'
         +'javascript:'
         +'fbFunction()'
         +'"><i class="fa fa-facebook"></i></a>'

         +'<a class="btn btn-social-icon btn-twitter"  href="javascript:tweetFunction()" target="_blank"><i class="fa fa-twitter"></i></a>'
         +'<a class="btn btn-social-icon" href="mailto:?subject=Spectrographie(s)&amp;body=Visitez&nbsp;notre&nbsp;page&nbsp;internet&nbsp;Spetrographies&nbsp;-&nbsp;Visit&nbsp;our&nbsp;webpage&nbsp;Spectrographies&nbsp;%0D%0A %0D%0A http://vt.anagraph.io/static/Spectrographies" target="_blank""><i class="fa fa-envelope-o"></i></a>'
                            +'</div></div></div></div></div>'

      )
           }
         });
        ////////***** End of marker *****////////





/**
 * Create a array for every desired properties
 *
 */
          var introMarker = L.geoJSON();
          var pseudoData = [];
          var typeData = [];
          var genreData = [];
          var titreData = [];
          var typeAutreData =[];
          var genreAutreData = [];



      marker.eachLayer(function(layer) {

            pseudoData.push(layer.feature.properties.pseudo);
            typeData.push(layer.feature.properties.type.split(','));
            genreData.push(layer.feature.properties.genre.split(',')) ;
            titreData.push(layer.feature.properties.titre);
            typeAutreData.push(layer.feature.properties.type_other.split(','));
            genreAutreData.push(layer.feature.properties.genre_other.split(','))
          });


          /******* Merging the Two Dimentional Arrays *******/
          var genreMerged = [].concat.apply([], genreData);
          var typeMerged = [].concat.apply([], typeData);
          var typeAD = [].concat.apply([], typeAutreData);
          var genreAD = [].concat.apply([], genreAutreData);

          /*-----------------------------*/

          /******* Function that delete empty values*******/
          temp = [];

          for(let i of genreAD)
              i && temp.push(i); // copy each non-empty value to the 'temp' array

          genreAD = temp;
          delete temp;

          /*-----------------------------*/

          /******* function that delete empty values *******/
          temp = [];

          for(let i of typeAD)
              i && temp.push(i); // copy each non-empty value to the 'temp' array

          typeAD = temp;
          delete temp;

          /*-----------------------------*/


          /******* Function that merge others *******/

          genreMerged.push.apply(genreMerged, genreAD);
           //console.log(genreMerged)
          typeMerged.push.apply(typeMerged, typeAD);
          //  console.log(typeMerged)

          /*-----------------------------*/

          /******* Function that delete empty values *******/
          temp = [];

          for(let i of genreMerged)
              i && temp.push(i); // copy each non-empty value to the 'temp' array

          genreMerged = temp;
          delete temp;

          /*-----------------------------*/

          /******* Function that delete empty values *******/
          temp = [];

          for(let i of typeMerged)
              i && temp.push(i); // copy each non-empty value to the 'temp' array

          typeMerged = temp;
          delete temp;

          /*-----------------------------*/



          /******* Function that create unique values within the given array *******/
          Array.prototype.unique = function() {
            return this.filter(function (value, index, self) {
              return self.indexOf(value) === index;
            });
          };

          /*-----------------------------*/



          var typeUnique = typeMerged.unique()
          var genreUnique = genreMerged.unique()

        /******* Create a selectBox *******/

           function pBox() {
            $('#participantBox').select2(
             {data: pseudoData.unique(),
              allowClear:true,
              placeholder:'Explorer'
                    })
           } pBox();

          function tBox() {
            $('#typeBox').select2(
             {data: typeUnique,
              allowClear:true,
              placeholder:'Explorer'
               })
           } tBox();

           function gBox() {
            $('#genreBox').select2(
             {data: genreUnique,
              allowClear:true,
              placeholder:'Explorer'

               })
           }gBox();

           function titBox() {
            $('#titreBox').select2(
             {
               data: titreData.unique(),
               allowClear:true,
               placeholder:'Explorer'
               })
           }titBox();

        //return _filteredMarker.addTo(map)
        markerCluster.addLayer(marker);
        group.addLayer(marker);
        map.addLayer(markerCluster);
        map.fitBounds(marker.getBounds())

       })
  }



getGeoJSON();


/*---------------- END OF getGeoJSON -----------------*/



//////////////////////////// Filter Function ///////////////////////////////////
function getFilterGeoJSON(value) {
$.when(
 $.getJSON('https://web.fulcrumapp.com/shares/3a4bbd0435c58166.geojson')).done(function(theGeoJSON) {

  (function removeNull(o) {
        for(var key in o) {
            if( null === o[key] ) o[key] = '';
            if ( typeof o[key] === 'object' ) removeNull(o[key]);
        }
     })(theGeoJSON);

markers = theGeoJSON.features;

/////  L.Geojson //////
filteredMarker = new L.geoJSON(markers,
{

pointToLayer: function(feature, latlng) {

     var customMarker = new L.ExtraMarkers.icon(
     {
          icon: 'glyphicon-eye-open',
          markerColor: 'yellow',
          shape: 'penta',
          prefix: 'glyphicon'
        });

        return L.marker(latlng, {icon:customMarker})
      },



filter: function(feature, layer) {

if (feature.properties.status =="Published"){
  if (feature.properties.pseudo == value) {return feature.properties.pseudo = value}
  else if (feature.properties.type.includes(value)) { return feature.properties.type = value}
  else if (feature.properties.genre.includes(value))  { return feature.properties.genre = value }
  else if (feature.properties.titre == value) { return feature.properties.titre = value}
  else if (feature.properties.type_other.includes(value))  { return feature.properties.type_other = value}
  else if (feature.properties.genre_other.includes(value))  { return feature.properties.genre_other == value}
}},

  onEachFeature: function(feature, layer) {



var baseURL = "https://web.fulcrumapp.com/shares/3a4bbd0435c58166/photos/";
// Capture le pop up //
map.on('popupopen', function (e) {

      var h2 = document.getElementById('titrePopUp');
      var img = document.getElementById('myImg');
      var modal = document.getElementById('myModal');
      var captionText = document.getElementById("caption");
      var carouselDiv = document.getElementById("carousel-inner");

  //** Create the modal on the click function **//
          img.onclick = function(){

            map.closePopup();
            modal.style.display = "block";
            captionText.innerHTML = img.alt;

            var feature_photos_url = e.popup._source.feature.properties.photos_url;
            var feature_photos_uuid = photos_uuid(feature_photos_url);
            carouselDiv.innerHTML = divsFromPhotosUrl(feature_photos_url)
          };

          h2.onclick = function(){
            map.closePopup();
            modal.style.display = "block";
            captionText.innerHTML = img.alt;

            var feature_photos_url = e.popup._source.feature.properties.photos_url;
            var feature_photos_uuid = photos_uuid(feature_photos_url);
            carouselDiv.innerHTML = divsFromPhotosUrl(feature_photos_url)
          };

    // Fonction pour fermer le modal //
      var span = document.getElementsByClassName("close")[0];
      span.onclick = function() {
      modal.style.display = "none";
      };



      ////////Socials function ////////////


});

///////// START Bind tout le data dans le pop up /////////


var fbFunction = function fbshareCurrentPage()
        {window.open("https://www.facebook.com/sharer/sharer.php?u="+escape(window.location.href)+"&t="+document.title, '',
        'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
        return false; }

var tweetFunction =    function tweetCurrentPage()
                {window.open("https://twitter.com/intent/tweet?title="+document.title+'&text= Spectrographie(s)'+escape(window.location.href),'',
                'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                return false; }

layer.bindPopup(
'<div id="popUpOpen" class="">'



+'<div class="panel panel-default"><div id="selectPopUpPanel" class="panel-heading "> '
+'<a href="#" id="titrePopUp">'
+'<h2>'

// Pop Up Content

  +feature.properties.titre
  +'</h2></a></div>'
  +'<div class="panel-body">'
  +'<h3 style="display:inline">'
  +feature.properties.genre + feature.properties.genre_other
  +' & '
  +feature.properties.type + feature.properties.type_other
  +'</h3>'

  +'<div class=""><h4> Par : '
  +feature.properties.pseudo
  +'</h4></div></div>'

 // Modal Section Content //





    // Image section
    +'<div id="popUpImg" class="media"><img class=" img-thumbnail img-responsive d-flex center-block" id="myImg"'
    // Alt section with all the data for the modal popup
            +' alt="'
            +'<div class=&quot;panel panel-default&quot;><div class=&quot;panel-heading&quot;>'
            +'<h2>'
            +feature.properties.titre
            +'</h2></div>'
            +'<br>'
            +'<div class=&quot;panel-body&quot; ><h3 style=&quot;display: inline !important;&quot;> Genre : </h3><h4 style=&quot;display: inline !important;&quot;>'
            +feature.properties.genre + feature.properties.genre_other
            +'</h4><br><br><h3 style=&quot;display: inline !important;&quot;> Type : </h3><h4 style=&quot;display: inline !important;&quot;>'
            +feature.properties.type + feature.properties.type_other
            +'</h4><br><h3> Contexte : </h3><p>'
            +feature.properties.description
            +'</p>'
            +'<div class=&quot;panel panel-default &quot; >'
            +'<div class=&quot;panel-heading col-sm-12 &quot;>'
            +'<h3 style=&quot;display: inline !important;&quot;> Auteur : </h3><h4 style=&quot;display: inline !important;&quot;>'
            +feature.properties.pseudo
             // Autoportrait //
            +'</h4></div>'
            +'<div class=&quot;panel-body&quot;>'
              +'<div class=&quot; row &quot;>'

              +'<div class=&quot; col-sm-6 &quot;>'
                  +'<h3> Relation au lieu : </h3><p>'
                    +feature.properties.relation_au_lieu
                      +'</p></div>'

              +'<div  class= &quot;col-sm-6 align-content-center&quot;>'
                  +'<h3></h3><img  id=&quot;selfie&quot; class=&quot;  img-thumbnail  d-flex center-block &quot; src=&quot;'
                    +feature.properties.autoportrait_url.replace('view?photos=','')
                    +'&quot;</img>'
                  +'</div>'

            +'</div></div>'

            // Audio //
            +'<div class=&quot;row &quot;>'
            +'<div class=&quot; hidden-xs col-sm-10 col-sm-push-1 well text-center&quot;>'
            //+'<audio controls controls controlsList=&quot;nodownload&quot;><source src=&quot;'
            +'<audio controls  controls controlsList=&quot;nodownload&quot;><source src=&quot;'
            +feature.properties.audio_url.replace('view?audio=','')
            //+feature.properties.audio_url.replace('view?audio=','')
            +'&quot;</audio></div>'
            +'<div class=&quot;visible-xs well col-xs-8 col-xs-push-2 align-content-center&quot;>'
            +'<audio id=&quot;audioXS&quot; controls><source src=&quot;'
            +feature.properties.audio_url.replace('view?audio=','')

                        //+feature.properties.audio_url.replace('view?audio=','')
            +'&quot;</audio></div>'
            +'</div></div></div></div></div>'
            // End of alt attribution
            // Caroussel
            +'" src="'
            //+photosPreURL+first
            +feature.properties.photos_url.substring(0,106).replace('view?photos=','')
            +'"></img></div>'

            // Socials //
             +'<div class="row"><div id="socials" class="col-sm-12 center-block text-center">'

             +'<a class="btn btn-social-icon btn-facebook" href="'
             +'javascript:'
             +'fbFunction()'
             +'"><i class="fa fa-facebook"></i></a>'

             +'<a class="btn btn-social-icon btn-twitter"  href="javascript:tweetFunction()" target="_blank"><i class="fa fa-twitter"></i></a>'
             +'<a class="btn btn-social-icon" href="mailto:?subject=Spectrographie(s)&amp;body=Visitez&nbsp;notre&nbsp;page&nbsp;internet&nbsp;Spetrographies&nbsp;-&nbsp;Visit&nbsp;our&nbsp;webpage&nbsp;Spectrographies&nbsp;%0D%0A %0D%0A http://vt.anagraph.io/static/Spectrographies" target="_blank""><i class="fa fa-envelope-o"></i></a>'

                                +'</div></div></div></div></div>'

          )

   }
 });

    markerCluster.clearLayers();
    map.removeLayer(markerCluster);
    map.removeLayer(filteredMarker);
    markerCluster.addLayer(filteredMarker);
    group.addLayer(filteredMarker);
    map.addLayer(filteredMarker) ;
    map.flyToBounds(filteredMarker)

  }
)}



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
    $("#participantBox")
    .on("select2:select", function(e) {

    $("#titreBox").val('').trigger("change");
    $('#genreBox').val('').trigger("change");
    $('#typeBox').val('').trigger("change");

    value = $(e.currentTarget).val();

    map.removeLayer(marker);
    getFilterGeoJSON(value);
    map.removeLayer(filteredMarker)

    })

    .on("select2:unselect", function(e) {

     $('#participantBox').select2("close");
     map.removeLayer(filteredMarker);
     map.removeLayer(marker);
     map.addLayer(marker);
     map.flyToBounds(marker.getBounds())

    });
/*-----------------------------*/

/********  TYPE ********/

    $("#typeBox")

    .on("select2:select", function(e) {

     $("#titreBox").val('').trigger("change");
     $("#participantBox").val('').trigger("change");
     $('#genreBox').val('').trigger("change");



     value = $(e.currentTarget).val();
      map.removeLayer(marker);
      getFilterGeoJSON(value);
      map.removeLayer(filteredMarker)

    })

    .on("select2:unselect", function(e) {
     map.removeLayer(filteredMarker);
     map.removeLayer(marker);
     map.addLayer(marker);
     map.flyToBounds(marker.getBounds())

    });
/*-----------------------------*/

/********  GENRE ********/
    $("#genreBox")

    .on("select2:select", function(e) {

    $("#titreBox").val('').trigger("change");
    $("#participantBox").val('').trigger("change");
    $('#typeBox').val('').trigger("change");

    value = $(e.currentTarget).val();

    map.removeLayer(marker);
    getFilterGeoJSON(value);
    map.removeLayer(filteredMarker)
    })

     .on("select2:unselect", function(e) {

     map.removeLayer(filteredMarker);
     map.removeLayer(marker);
     map.addLayer(marker);
     map.flyToBounds(marker.getBounds())

    });

/*-----------------------------*/

/********  TITRE ********/
    $("#titreBox")

    .on("select2:select", function(e) {

    $("#participantBox").val('').trigger("change") ;
    $("#genreBox").val('').trigger("change");
    $('#typeBox').val('').trigger("change");

    value = $(e.currentTarget).val();

    map.removeLayer(marker);
    getFilterGeoJSON(value);
    map.removeLayer(filteredMarker)
    })

    .on("select2:unselect", function(e) {

     map.removeLayer(filteredMarker);
     map.removeLayer(marker);
     map.addLayer(marker);
     map.flyToBounds(marker.getBounds())
    });


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
          var photos = photos_uuid(photos_url);
          var divsAsText = '';
          var currentDiv;
          for (var i = 0; i < photos.length; i++) {
            if (i == 0) {
              currentDiv = '<div class="item active"><img class="d-block img-fluid" src="' + baseURL + photos[i] + '" id="img' + i + '" ></div>';
            } else {
              currentDiv = '<div class="item"><img class="d-block img-fluid" src="' + baseURL + photos[i] + '" id="img' + i + '" ></div>';
            }

            divsAsText = divsAsText + currentDiv;
          }

          return divsAsText;
        }







});
