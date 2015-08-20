
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // Grab the user's input
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ', ' + city;

    // Update the greeting
    $greeting.text('So, you want to live at ' + address + '?');

    // Create a link to the address' Google Street View
    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' +
    address + '';

    // Add the image to the page's body
    $body.append('<img class="bgimg" src="' + streetviewURL + '">');


    return false;
};

$('#form-container').submit(loadData);
