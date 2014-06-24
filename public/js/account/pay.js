$(function () {
  /*global $*/
  'use strict';
  $('.form-container').card({
    container: $('.card-wrapper')
  });

  var eu = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'EL', 'ES', 'FI', 'FR', 'GB', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'];

  var countryEl = $('#country');
  var vatEl = $('#vat');
  var vatISOEl = $('#vatiso');

  $.getJSON('//country-finder.herokuapp.com/?callback=?', function (data) {
    if (data.geo) {
      countryEl.val(data.geo.country.toLowerCase()).trigger('change');
    }
  });

  countryEl.on('change', function () {
    var code = countryEl.val().toUpperCase();
    vatEl.closest('div').toggleClass('disabled', eu.indexOf(code) === -1);

    if (eu.indexOf(code) !== -1) {
      vatISOEl.html(code);
    } else {
      vatISOEl.html('');
    }
  });

  $('#validateVat').on('click', function (event) {
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