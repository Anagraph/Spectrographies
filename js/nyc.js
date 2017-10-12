var place = {
    name: "New York",
    lat:40.714444,
    lon: -74.00611,
    zoom: 15
};

function dynamicTitle(){
    var x = document.URL;
    var title = "Spectrographies of the territory"
    var titre =  "Spectrographies du territoire"

    if (x == 'www.spectrographies.org/newyork/') {
        return document.getElementById("dynamicTitle").innerHTML = title;
    }
    else {
        return document.getElementById("dynamicTitle").innerHTML = titre;
    }
};
