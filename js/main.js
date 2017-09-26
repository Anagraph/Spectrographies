$(document).click(function(e) {
    if (!$(e.target).is('a')) {
        $('.navbar-collapse').collapse('hide');
    }
});

$(function() {



var map = L.map('map', {
        center: [45.5298026,-73.6183529],
        zoom: 15,
        zoomControl: false})

        L.control.zoom({
             position:'topright'
        }).addTo(map);

var mapBoxBW = L.tileLayer('https://api.mapbox.com/styles/v1/clementg123/cj6s1my854xxn2rmzez9mel7z/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2xlbWVudGcxMjMiLCJhIjoiY2o2M3ZhODh3MWxwNDJxbnJnaGZxcWNoMiJ9.YroDniTcealGFJgHtQ2hDg').addTo(map);

var markerCluster = L.markerClusterGroup({

       iconCreateFunction: function (cluster) {
        var markerCluster = cluster.getAllChildMarkers();
        var html = '<div class="circle">' + markerCluster.length + '</div>';
        return L.divIcon({ html: html, className: 'mycluster', iconSize: L.point(25, 25) });
    },
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    removeOutsideVisibleBounds: true,
    maxClusterRadius: 6
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

             geojsonMarkerOptions = {

             };



        /**
         * Create the geoJSON container for the first time
         **/
        var markers = theGeoJSON.features;
        marker = new L.geoJSON(markers, {

            //** create a custom marker **//
          pointToLayer: function(feature, latlng) {

            switch (feature.properties.genre) {
                  case "Anecdote / Anecdote":
                  return L.circleMarker(latlng, {
                  color: 'rgb(255,255,0)' ,
                  radius:8,
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.5
                  });
                  case "Commentaire / Comment":
                  return L.circleMarker(latlng, {
                  color: "rgb(255,102,0)",
                  radius:8,
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.5
                  });
                  case "Souvenir / Memory":
                  return L.circleMarker(latlng, {
                  color: "rgb(255,0,0)",
                  radius:8,
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.5
                  });
                  case "Récit / Narrative":
                  return L.circleMarker(latlng, {
                  color: "rgb(255,0,255)",
                  radius:8,
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.5
                  });
                  case "Référence historique / Historical reference":
                  return L.circleMarker(latlng, {
                  color: " rgb(204,0,255)",
                  radius:8,
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.5
                  });
                  case "Création / Creation":
                  return L.circleMarker(latlng, {
                  color: "rgb(0,0,255)",
                  radius:8,
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.5
                  });
                  case "Observation / Observation":
                  return L.circleMarker(latlng, {
                  color: "rgb(0,0,153) ",
                  radius:8,
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.5
                  });
                  case "Réflexion / Reflection":
                  return L.circleMarker(latlng, {
                  color: "rgb(0,0,0)",
                  radius:8,
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.5
                  });
                  default:
                  return L.circleMarker(latlng, {
                      color: 'rgb(66, 244, 226)',
                      radius:8,
                      weight: 1,
                      opacity: 1,
                      fillOpacity: 0.5
                  });
                }
             },


              filter: function(feature, layer) {


                if (feature.properties.status == 'Published') {return true}
                else {return false}
              },

        //** create a custom marker **//
          onEachFeature: function(feature, layer) {
            var categories ;
            var catAsText ;
        map.on('popupopen', function (e) {

          /***** !! Auto Pan to the center of the popup ToolTip !! *****/
          var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
          px.y -= e.popup._container.clientHeight/2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
          map.panTo(map.unproject(px),{animate: true}); // pan to new center

              var h2 = document.getElementById('titrePopUp');
              var img = document.getElementById('myImg');
              var modal = document.getElementById('myModal');
              var captionText = document.getElementById("caption");
              var carouselDiv = document.getElementById("carousel-inner");
              var menu = document.getElementById('menu');
               categories = e.popup._source.feature.properties.genre
               catAsText =''


                console.log(test())
        //** Create the modal on the click function **//
          img.onclick = function(){
        //    menu.style.visibility = 'hidden';
            map.closePopup();
            modal.style.display = "block";
            captionText.innerHTML = img.alt;

            var feature_photos_url = e.popup._source.feature.properties.photos_url;
            var feature_photos_uuid = photos_uuid(feature_photos_url);
            carouselDiv.innerHTML = divsFromPhotosUrl(feature_photos_url);
          };

            h2.onclick = function(){
            map.closePopup();
          //  menu.style.visibility = 'hidden';
            modal.style.display = "block";
            captionText.innerHTML = img.alt;

            var feature_photos_url = e.popup._source.feature.properties.photos_url;
            var feature_photos_uuid = photos_uuid(feature_photos_url);
            carouselDiv.innerHTML = divsFromPhotosUrl(feature_photos_url);


              };

                /* Auto close on click is too strict-*/

                /*$('#myModal').on('click' , function() {
                        modal.style.display = "none";
                      });*/

            var span = document.getElementsByClassName("close")[0];
              span.onclick = function() {
                  modal.style.display = "none";
                  menu.style.visibility = 'visible';
              }
    });

    function test(categories){
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

        else  {
          return currentDiv = '<div id="popUpOpen"><div class="panel panel-popup">';
        }

    };



        /// Bind all the data to the pop ///
        layer.bindPopup(

          test(feature.properties.genre)

      /*  +'<div class="panel panel-popup">'*/
        +'<div id="popUpPanel" class="panel-heading"> '
        +'<a href="#" id="titrePopUp">'
        +'<h2>'

        // Pop Up Content

          +feature.properties.titre
          +'</h2></a></div>'
          +'<div class="panel-body">'
          +'<h3 style="display:inline">'
          +feature.properties.genre + ' ' + feature.properties.genre_other
        //  +' & '
        //  +feature.properties.type + ' ' + feature.properties.type_other
          +'</h3>'

          +'<div class=""><h4> par : '
          +feature.properties.pseudo
          +'</h4></div></div>'

         // Modal Section Content //





            // Image section
            +'<div id="popUpImg" class="media"><img class=" img-responsive d-flex center-block" id="myImg"'
            // Alt section with all the data for the modal popup
                    +' alt="'
                    +'<div class=&quot;panel &quot; id=&quot;panelRecit&quot;><div class=&quot;panel-heading text-justify&quot;'
                    +'<h2>'
                    +feature.properties.titre
                    +'</h2></div>'
                    +'<div class=&quot;panel-body text-justify &quot;>'
                    +feature.properties.description
                    +'<br><br><h3 style=&quot;display: inline !important; font-weight: bold; &quot;> Catégorie(s) : </h3><p style=&quot;display: inline !important;&quot;>'
                    + feature.properties.genre + ' ' + feature.properties.genre_other
                    +'</p><br><br>'

                        // Autoportrait //

                    +'<div class=&quot;panel &quot; style=&quot;background-color:rgba(255,255,255,0)!important;&quot; >'
                    +'<div class=&quot;panel-heading col-sm-12 &quot;>'

                    +'<div class= &quot;col&quot;>'
                        +'<img  id=&quot;selfie&quot; class=&quot;  img-responsive  d-flex  &quot; src=&quot;'
                          +feature.properties.autoportrait_url.replace('view?photos=','')
                          +'&quot;</img>'
                        +'</div></div>'

                          // Autoportrait -- Auteur()//

                        +'<div class=&quot;panel-body&quot;>'
                          +'<div class=&quot; row text-justify &quot;>'
                        +'<h3  style=&quot;display: inline !important font-weight: bold; ;&quot;> Auteur(e)(s) : </h3><p style=&quot;display: inline !important;&quot;>'
                    +feature.properties.pseudo

                        // Autoportrait -- Relation au lieu()//

                      +'</p><div class=&quot; text-justify &quot;>'
                          +'<h3 style=&quot;display: inline !important font-weight: bold; ;&quot;>  Relation au lieu : </h3><p style=&quot;display: inline !important;&quot;>'
                            +feature.properties.relation_au_lieu
                              +'</p></div>'
                    +'</div></div>'


                        // Audio //

                    +'<div class=&quot;row &quot;>'

                            // Audio visisble en mode tablette et desktop //

                    +'<div class=&quot; hidden-sm col-sm-10 &quot;>'
                    //+'<audio controls controls controlsList=&quot;nodownload&quot;><source src=&quot;'
                    +'<audio controls  controls controlsList=&quot;nodownload&quot;><source src=&quot;'
                    +feature.properties.audio_url.replace('view?audio=','')
                    //+feature.properties.audio_url.replace('view?audio=','')
                    +'&quot;</audio></div>'

                            // Audio visible en mode cellulaire //

                    +'<div class=&quot;visible-sm col-xs-8 r&quot;>'
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
         +'<a class="btn btn-social-icon" href="mailto:spectro.terrritoire@gmail.com?subject=Spectrographies&amp;body=Visitez&nbsp;notre&nbsp;page&nbsp;internet&nbsp;Spetrographies&nbsp;-&nbsp;Visit&nbsp;our&nbsp;webpage&nbsp;Spectrographies&nbsp;%0D%0A %0D%0A http://spectrographies.org" target="_blank""><i class="fa fa-envelope-o"></i></a>'
                            +'</div></div></div></div></div>'

      ),{autoPan:true}
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



      marker.eachLayer(function(layer) {

            pseudoData.push(layer.feature.properties.pseudo);
          //  typeData.push(layer.feature.properties.type.split(','));
            genreData.push(layer.feature.properties.genre.split(',')) ;
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

          for(let i of genreAD)
              i && temp.push(i); // copy each non-empty value to the 'temp' array

          genreAD = temp;
          delete temp;

          /*-----------------------------*/

          /******* function that delete empty values *****
          temp = [];

          for(let i of typeAD)
              i && temp.push(i); // copy each non-empty value to the 'temp' array

          typeAD = temp;
          delete temp;

          /*-----------------------------*/


          /******* Function that merge others *******/

          genreMerged.push.apply(genreMerged, genreAD);
           //console.log(genreMerged)
        //  typeMerged.push.apply(typeMerged, typeAD);
          //  console.log(typeMerged)

          /*-----------------------------*/

          /******* Function that delete empty values *******/
          temp = [];

          for(let i of genreMerged)
              i && temp.push(i); // copy each non-empty value to the 'temp' array

          genreMerged = temp;
          delete temp;

          /*-----------------------------*/

          /******* Function that delete empty values ******
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



        //  var typeUnique = typeMerged.unique()
          var genreUnique = genreMerged.unique()

        /******* Create a selectBox *******/

           function pBox() {
            $('#participantBox').select2(
             {data: pseudoData.unique(),
              allowClear:true,
              placeholder:'...'
                    })
           } pBox();

          function tBox() {
            $('#typeBox').select2(
             {data: genreUnique,
              allowClear:true,
              placeholder:'...'
               })
           } tBox();

           function gBox() {
            $('#genreBox').select2(
             {data: genreUnique,
              allowClear:true,
              placeholder:'...'

               })
           }gBox();

           function titBox() {
            $('#titreBox').select2(
             {
               data: titreData.unique(),
               allowClear:true,
               placeholder:'...'
               })
           }titBox();





        //return _filteredMarker.addTo(map)
        markerCluster.addLayer(marker);
        //group.addLayer(marker);
        map.addLayer(markerCluster);
        //map.fitBounds(markerCluster.getBounds())

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
var menu = document.getElementById('menu');
  menu.style.visibility = 'visible';
/////  L.Geojson //////
filteredMarker = new L.geoJSON(markers,
{



  pointToLayer: function(feature, latlng) {

    switch (feature.properties.genre) {
          case "Anecdote / Anecdote":
          return L.circleMarker(latlng, {
          color: "#ffff00",
          radius:8,
          weight: 1,
          opacity: 1,
          fillOpacity: 0.5
          });
          case "Commentaire / Comment":
          return L.circleMarker(latlng, {
          color: "#ff6600",
          radius:8,
          weight: 1,
          opacity: 1,
          fillOpacity: 0.5
          });
          case "Souvenir / Memory":
          return L.circleMarker(latlng, {
          color: "#ff0000",
          radius:8,
          weight: 1,
          opacity: 1,
          fillOpacity: 0.5
          });
          case "Récit / Narrative":
          return L.circleMarker(latlng, {
          color: "#ff00ff",
          radius:8,
          weight: 1,
          opacity: 1,
          fillOpacity: 0.5
          });
          case "Référence historique / Historical reference":
          return L.circleMarker(latlng, {
          color: "cc00ff",
          radius:8,
          weight: 1,
          opacity: 1,
          fillOpacity: 0.5
          });
          case "Création / Creation":
          return L.circleMarker(latlng, {
          color: "#0000ff",
          radius:8,
          weight: 1,
          opacity: 1,
          fillOpacity: 0.5
          });
          case "Observation / Observation":
          return L.circleMarker(latlng, {
          color: "#000099",
          radius:8,
          weight: 1,
          opacity: 1,
          fillOpacity: 0.5
          });
          case "Réflexion / Reflection":
          return L.circleMarker(latlng, {
          color: "#000000",
          radius:8,
          weight: 1,
          opacity: 1,
          fillOpacity: 0.5
          });
          case "Observation / Observation":
          return L.circleMarker(latlng, {
          color: "#000099",
          radius:8,
          weight: 1,
          opacity: 1,
          fillOpacity: 0.5
          });
          default:
          return L.circleMarker(latlng, {
              color: 'grey',
              radius:8,
              weight: 1,
              opacity: 1,
              fillOpacity: 0.5
          });
        }
     },




filter: function(feature, layer) {

if (feature.properties.status =="Published"){
  if (feature.properties.pseudo == value) {return feature.properties.pseudo = value}
//  else if (feature.properties.type.includes(value)) { return feature.properties.type = value}
  else if (feature.properties.genre.includes(value))  { return feature.properties.genre = value }
  else if (feature.properties.titre == value) { return feature.properties.titre = value}
  //else if (feature.properties.type_other.includes(value))  { return feature.properties.type_other = value}
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
      var menu = document.getElementById('menu');
      var categories = feature.properties.genres;

  //** Create the modal on the click function **//
          img.onclick = function(){
        //    menu.style.visibility = 'hidden';
            map.closePopup();
            modal.style.display = "block";
            captionText.innerHTML = img.alt;

            var feature_photos_url = e.popup._source.feature.properties.photos_url;
            var feature_photos_uuid = photos_uuid(feature_photos_url);
            carouselDiv.innerHTML = divsFromPhotosUrl(feature_photos_url)
          };

          h2.onclick = function(){
          //  menu.style.visibility = 'hidden';
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
      menu.style.visibility = 'visisble';
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


                /// Bind all the data to the pop ///
                layer.bindPopup(



                '<div id=&quot;popUpOpen">'



                +'<div class="panel panel-popup"><div id="popUpPanel" class="panel-heading"> '
                +'<a href="#" id="titrePopUp">'
                +'<h2>'

                // Pop Up Content

                  +feature.properties.titre
                  +'</h2></a></div>'
                  +'<div class="panel-body">'
                  +'<h3 style="display:inline">'
                  +feature.properties.genre + ' ' + feature.properties.genre_other
                //  +' & '
                //  +feature.properties.type + ' ' + feature.properties.type_other
                  +'</h3>'

                  +'<div class=""><h4> par : '
                  +feature.properties.pseudo
                  +'</h4></div></div>'

                 // Modal Section Content //





                    // Image section
                    +'<div id="popUpImg" class="media"><img class=" img-responsive d-flex center-block" id="myImg"'
                    // Alt section with all the data for the modal popup
                            +' alt="'
                            +'<div class=&quot;panel &quot; id=&quot;panelRecit&quot;><div class=&quot;panel-heading text-justify&quot;'
                            +'<h2>'
                            +feature.properties.titre
                            +'</h2></div>'
                            +'<div class=&quot;panel-body text-justify &quot;>'
                            +feature.properties.description
                            +'<br><br><h3 style=&quot;display: inline !important; font-weight: bold; &quot;> Catégorie(s) : </h3><p style=&quot;display: inline !important;&quot;>'
                            + feature.properties.genre + ' ' + feature.properties.genre_other
                            +'</p><br><br>'

                                // Autoportrait //

                            +'<div class=&quot;panel &quot; style=&quot;background-color:rgba(255,255,255,0)!important;&quot; >'
                            +'<div class=&quot;panel-heading col-sm-12 &quot;>'

                            +'<div class= &quot;col &quot;>'
                                +'<img  id=&quot;selfie&quot; class=&quot;  img-responsive  d-flex  &quot; src=&quot;'
                                  +feature.properties.autoportrait_url.replace('view?photos=','')
                                  +'&quot;</img>'
                                +'</div></div>'

                                  // Autoportrait -- Auteur()//

                                +'<div class=&quot;panel-body&quot;>'
                                  +'<div class=&quot; row text-justify &quot;>'
                                +'<h3  style=&quot;display: inline !important font-weight: bold; ;&quot;> Auteur(e)(s) : </h3><p style=&quot;display: inline !important;&quot;>'
                            +feature.properties.pseudo

                                // Autoportrait -- Relation au lieu()//

                              +'</p><div class=&quot; text-justify &quot;>'
                                  +'<h3 style=&quot;display: inline !important font-weight: bold; ;&quot;>  Relation au lieu : </h3><p style=&quot;display: inline !important;&quot;>'
                                    +feature.properties.relation_au_lieu
                                      +'</p></div>'
                            +'</div></div>'


                                // Audio //

                            +'<div class=&quot;row &quot;>'

                                    // Audio visisble en mode tablette et desktop //

                            +'<div class=&quot; hidden-sm col-sm-10 &quot;>'
                            //+'<audio controls controls controlsList=&quot;nodownload&quot;><source src=&quot;'
                            +'<audio controls  controls controlsList=&quot;nodownload&quot;><source src=&quot;'
                            +feature.properties.audio_url.replace('view?audio=','')
                            //+feature.properties.audio_url.replace('view?audio=','')
                            +'&quot;</audio></div>'

                                    // Audio visible en mode cellulaire //

                            +'<div class=&quot;visible-sm col-xs-8 r&quot;>'
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
                 +'<a class="btn btn-social-icon" href="mailto:spectro.terrritoire@gmail.com?subject=Spectrographies&amp;body=Visitez&nbsp;notre&nbsp;page&nbsp;internet&nbsp;Spetrographies&nbsp;-&nbsp;Visit&nbsp;our&nbsp;webpage&nbsp;Spectrographies&nbsp;%0D%0A %0D%0A http://spectrographies.org" target="_blank""><i class="fa fa-envelope-o"></i></a>'
                                    +'</div></div></div></div></div>'

              ),{autoPan:true}
                   }
                 });
                ////////***** End of marker *****////////


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


    })

    .on("select2:unselect", function(e) {

     $('#participantBox').select2("close");
     filteredMarker.clearLayers();
     markerCluster.clearLayers();
     map.removeLayer(marker);
     map.removeLayer(filteredMarker)
     markerCluster.addLayer(marker);
     map.addLayer(markerCluster)
     map.fitBounds(markerCluster.getBounds())
    // map.setView([45.5237019,-73.6197287], 15)
    //map.flyTo([45.5237019,-73.6197287], 15)
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


     })

     .on("select2:unselect", function(e) {

      $('#participantBox').select2("close");
      filteredMarker.clearLayers();
      markerCluster.clearLayers();
      map.removeLayer(marker);
      map.removeLayer(filteredMarker)
      markerCluster.addLayer(marker);
      map.addLayer(markerCluster)
      map.fitBounds(markerCluster.getBounds())
     // map.setView([45.5237019,-73.6197287], 15)
    // map.flyTo([45.5237019,-73.6197287], 15)

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


    })

    .on("select2:unselect", function(e) {

     $('#participantBox').select2("close");
     filteredMarker.clearLayers();
     markerCluster.clearLayers();
     map.removeLayer(marker);
     map.removeLayer(filteredMarker)
     markerCluster.addLayer(marker);
     map.addLayer(markerCluster)
     map.fitBounds(markerCluster.getBounds())
    // map.setView([45.5237019,-73.6197287], 15)
    //map.flyTo([45.5237019,-73.6197287], 15)

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


    })

    .on("select2:unselect", function(e) {

     $('#participantBox').select2("close");
     filteredMarker.clearLayers();
     markerCluster.clearLayers();
     map.removeLayer(marker);
     map.removeLayer(filteredMarker)
     markerCluster.addLayer(marker);
     map.addLayer(markerCluster)
     map.fitBounds(markerCluster.getBounds())
    // map.setView([45.5237019,-73.6197287], 15)
    //map.flyTo([45.5237019,-73.6197287], 15)
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
