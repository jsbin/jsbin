(function () {
  'use strict';
  var results = $('#results');
  var resultCount = $('#result-count');
  var searchTerms = [];
  var search = $('#helpsearch');
  var position = -1;

  search.on('input', throttle(function () {
    if (searchTerms.length === 0) {
      $.ajax({
        url: '/help/search.json?' + (new Date()).toString().split(' ').slice(0, 4).join('-'),
        dataType: 'json',
        cache: true,
        success: function (data) {
          searchTerms = data;
          searchFor(this.value, searchTerms);
        }.bind(this)
      });
    } else {
      searchFor(this.value, searchTerms);
    }
    position = -1;
  }, 200));

  // document.documentElement.addEventListener('click', function (event) {
  //   if (event.target.id === 'search' || event.target.id === 'results') {

  //   } else {
  //     resultsEl.hidden = true;
  //   }
  // });

  results.on('mousemove', function () {
    if (position !== -1) {
      results.children().remove('highlight');
      position = -1;
    }
  });

  search.on('keydown', function (event) {
    var key = event.which;
    if (key === 38 || key === 40) { // up / down
      event.preventDefault();
      var inc = 1;
      if (key === 38) {
        inc = -1;
      }

      position += inc;

      var children = results.children();

      var length = children.length;
      children.removeClass('hover');

      if (position < 0) {
        position = length - 1;
      } else if (position > length - 1) {
        position = 0;
      }

      children.eq(position).addClass('hover');
    } else if (key === 13) { // select
      var url = results.find('.hover')[0];
      if (url) {
        window.open(url.href);
        // window.location = url.href;
      }
    }
  });

  // search.on('focus', function () {
  //   results.hide();
  // });

  function wordmap(input) {
    var ignore = "a an and on in it of if for the i is i'm i'd it's or to me be not was do so at are what bin bins".split(' ');

    var endings = 'ing ly lies s';
    var endingRe = new RegExp('(' + endings.split(' ').join('|') + ')$');

    return (input||'')
      //- strip html
      .replace(/(<([^>]+)>)/ig,'')
      //- strip non-letters
      .replace(/\W/g, ' ').replace(/["'\.,]/g, '')
      //- turn in to array of lower case words
      .toLowerCase().split(' ')
      //- filter out ignored words
      .filter(function (word) {
        return ignore.indexOf(word.trim()) === -1;
      }).filter(function (e, i, words) {
        //- return unique
        return words.lastIndexOf(e) === i;
      }).filter(function (word) {
        //- return words 3 chars or longer
        return word.length > 2;
      }).map(function (word) {
        return word.trim().replace(endingRe, '');
      }).sort();
  }

  function searchFor(needles, haystack) {
    'use strict';
    needles = wordmap(needles);
    var matches = haystack.map(function (data) {
      var matches = needles.filter(function (needle) {
        return data.words.indexOf(needle) !== -1;
      }).length;

      return {
        type: data.type,
        title: data.title,
        slug: data.slug,
        category: data.category,
        matches: matches
      };
    }).filter(function (data) {
      return data.matches > 0;
    }).sort(function (a, b) {
      return b.matches - a.matches;
    });

    results.html(matches.map(function (result) {
      return '<a target="_blank" class="button" href="/' + result.slug + '">' + result.title + (result.type === 'blog' ? ' (blog)' : '') + '</a>';
    }).join('\n'));

    results.show();
    var s = '';
    if (matches.length !== 1) {
      s = 's';
    }
    resultCount.html(matches.length + ' result' + s);
  }


})();
