var place = {
    name: "Montréal",
    lat:45.5298026,
    lon: -73.6183529,
    zoom: 15
};

function dynamicTitle(){
    var x = document.URL;
    console.log(x);
    var title = "Spectrographies of the territory"
    var titre =  "Spectrographies du territoire"

    if (x == 'http://www.spectrographies.org/newyork/') {
        return document.getElementById("dynamicTitle").innerHTML = title;
    }
    else {
        return true
        }
};
dynamicTitle()
