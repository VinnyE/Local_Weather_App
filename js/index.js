// Function to run if location check is successful. Gets coordinates of user.
function success(position) {
  var coordinates = position.coords;
  var latitudeAndLongitude = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
  };
    apiLink(latitudeAndLongitude);
};
//  Function to run if location check is not successful.
function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};
//  Get location
navigator.geolocation.getCurrentPosition(success, error);

// Build the link for API call from passed in coords.
function apiLink(coords) {
  var link = 'https://simple-weather.p.mashape.com/weatherdata?lat=' + coords.latitude + '&lng=' + coords.longitude;
  ajaxCall(link);
};

// Call to API
function ajaxCall(link) {
   $.ajax({
     dataType: "json",
     url: link,
     success: function(response) {
                var tempUnit = response.query.results.channel.units.temperature;
                $('#city').text(response.query.results.channel.location.city);
                $('#country').text(response.query.results.channel.location.country);
                $('#temperature').text(response.query.results.channel.item.condition.temp + " °" + tempUnit);
                $('#description').text(response.query.results.channel.item.condition.text);
                $('#icon').html('<i class="wi wi-na">');

                // regex to match weather description.
                var conditions = {
                                    rain: /(rain|sprinkle|shower|drops|driz)+/gi,
                                    snow: /(snow|sleet|hail|flakes|freez)+/gi,
                                    sunny: /(sun|bright|clear|hot)+/gi,
                                    storm: /(scatter|thunder|hurricane|heavy|storm|thunderstorm)+/gi,
                                    cloudy: /(cloud|smog|fog|haze|dust)+/gi,
                                    windy: /(windy|breez|blow|draft)+/gi
                                  };

                // Loop through conditions object, find appropriate weather description & set icon.
                for (var key in conditions) {
                  if (conditions[key].test($('#description').text())) {
                    if (key === 'rain') {
                      $('#icon').html('<i class="wi wi-raindrops">');
                    } else if (key === 'snow') {
                      $('#icon').html('<i class="wi wi-snow">');
                    } else if (key === 'sunny') {
                      $('#icon').html('<i class="wi wi-day-sunny">');
                    } else if (key === 'storm') {
                      $('#icon').html('<i class="wi wi-thunderstorm">');
                    } else if (key === 'cloudy') {
                      $('#icon').html('<i class="wi wi-cloudy">');
                    } else if (key === 'windy') {
                      $('#icon').html('<i class="wi wi-windy">');
                    }
                  } // end conditions if
                } // end for-in
     }, // end iconDisplay();
     beforeSend: function(jqxhr) {
                   jqxhr.setRequestHeader("X-Mashape-Authorization",                               'WOyzMuE8c9mshcofZaBke3kw7lMtp1HjVGAjsndqIPbU9n2eET');
    } // end beforeSend method
  }); //end $.ajax
}  // end ajaxCall function

// Temperature conversion
$('#toggle-temp').on('click', function() {
  if ($('#temperature').hasClass('celcius')) {
    var fahrenheight = (parseInt($('#temperature').text())) * 1.8 + 32;
    $('#temperature').text(fahrenheight.toFixed(0) + "°" + 'F');
    $('#temperature').removeClass('celcius');
  } else {
    var celcius =  ((parseInt($('#temperature').text())) - 32) / 1.8;
    $('#temperature').text(celcius.toFixed(0) + "°" + 'C');
    $('#temperature').addClass('celcius');
  }
}); // end temp conversion
