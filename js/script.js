
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // Add Google Street View

    // Grab the user's input
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ', ' + city;

    // Update the greeting
    if (street) {
        $greeting.text('So, you want to live at ' + address + '?');
    } else {
        $greeting.text('So, you want to live in ' + city + '?');
    }
    

    // Create a link to the address' Google Street View
    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' +
    address + '';

    // Add the image to the page's body
    $body.append('<img class="bgimg" src="' + streetviewURL + '">');

    // NYTimes AJAX request

    // Create a request URL using the NY Times Article Search API
    var BASEURI = "http://api.nytimes.com/svc/search/v2/articlesearch";
    var format = ".json?";
    var nytimesURL = 
        BASEURI 
        + format
        + 'q=' + city 
        + '&fq=news_desk:("travel")'
        + '&sort=newest'
        + api_key;

    $.getJSON(nytimesURL, function(data) {
        $nytHeaderElem.text('New York Times Articles About ' + city);
        
        // retrieve articles from the JSON object that gets returned
        articles = data.response.docs;

        // iterate over each article, appending each as a list item 
        for (var i=0; i <articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' +
                '<a href="' + article.web_url + '">' +
                article.headline.main + '</a>' +
                '<p>' + article.snippet + '</p>' +
                '</li>');
        };
    }).error(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
       });

    // Wikipedia AJAX request
    var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch"
        + "&search=" + city
        + "&format=json&callback=wikiCallback";

    //JSONP doesn't come with error handling, add a timeout
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('Failed to get Wikipedia Resources');
    }, 8000);    

    $.ajax({
        url: wikiURL,
        dataType: 'jsonp',
        success: function(response) {
            // wikimedia returns an array, grab the first one
            var articleList = response[1];

            for (var i=0; i < articleList.length; i++) {
                var articleTitle = articleList[i];
                var articleURL = 'http://en.wikipedia.org/wiki/' + articleTitle;
                $wikiElem.append(
                    '<li><a href="' + articleURL + '">' + articleTitle + '</a></li>'
                );
            };
        // Stop the timeout if the request succeeds   
        clearTimeout(wikiRequestTimeout);

        }
    });

    return false;
};

$('#form-container').submit(loadData);
