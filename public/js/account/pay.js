$(function () {
  /*global $*/
  'use strict';
  $('.form-container').card({
    container: $('.card-wrapper')
  });

  var countryEl = $('#country');
  var vatEl = $('#vat');

  $.getJSON('//country-finder.herokuapp.com/?callback=?', function (data) {
    if (data.geo) {
      countryEl.val(data.geo.country.toLowerCase());
    }
  });

  $('#validateVat').click(function (event) {
    event.preventDefault();
    var vat = countryEl.val() + vatEl[0].value.replace(/\D/g, '');

    $.getJSON('//vat-validator.herokuapp.com/' + vat + '?callback=?', function (data) {
      if (data) {
        if (data.valid) {
          vatEl[0].className = 'valid';
        } else {
          vatEl[0].className = 'invalid';
        }
      } else {
        console.log('cannot validate VAT');
      }
    });
  });
});