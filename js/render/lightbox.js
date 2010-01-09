var Lightbox = function (source, effectSpeed) {
  var $box = $('<div class="lightboxWrapper"><div class="overlay"></div><div class="lightbox"></div></div>')
              .hide()
              .find('.lightbox')
              .html(source)
              .end();
  
  this.speed = effectSpeed || 'normal';
  this.$box = $box;
};

Lightbox.prototype.show = function () {
  var lightbox = this;
  lightbox.$box.appendTo(document.body).fadeIn(lightbox.speed);

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