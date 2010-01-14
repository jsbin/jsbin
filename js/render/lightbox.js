var Lightbox = function (source, effectSpeed) {
  var $box = $('<div class="lightboxWrapper"><div class="overlay"></div><div class="lightbox"></div></div>')
              .hide()
              .find('.lightbox')
              .html(source)
              .end();
  
  var $nav = $('<ul id="navigation"></ul>'), $panels = $([]);
  $box.find('h2').each(function () {
    $panels = $panels.add( $(this).closest('div') );
    $nav.append('<li><a href="#' + this.id + '">' + $(this).text() + '</a></li>');
  });

  $panels.wrapAll('<div class="panels" />').hide();

  $box.find('h1').after($nav);
  
  var visible = $panels.eq(0);
  
  $nav.find('a').click(function () {
    var link = this;
    $nav.find('a').removeClass('selected');
    $(link).addClass('selected');
    visible.fadeOut(75, function () {
      visible = $(link.hash).closest('div').fadeIn(75);
    });
    return false;
  });

  this.speed = effectSpeed || 'normal';
  this.$box = $box;
};

Lightbox.prototype.show = function () {
  var lightbox = this;
  lightbox.$box.appendTo(document.body).fadeIn(lightbox.speed);
  
  // in case we have navigation that needs to be clicked
  lightbox.$box.find('#navigation a:first').click();

  var escape = function (event) {
    if (event.keyCode == 27 || event.type == 'click') {
      lightbox.remove();
      $(document).unbind('keyup', escape);
    }
  };
  
  $(document).keyup(escape);
  lightbox.$box.find('.overlay').click(escape);
};

Lightbox.prototype.remove = function () {
  this.$box.fadeTo(this.speed, 0, function () {
      $(this).remove();
  });
};