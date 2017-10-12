var place = {
    name: "New York",
    lat:40.714444,
    lon: -74.00611,
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
