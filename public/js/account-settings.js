;(function(){

	function getHash(){
		return window.location.hash.slice(1);
	}

	var $contents = $('#content article')
	var $btns = $('.sidebar-btn').click(function(event){
		$btns.removeClass('selected');
		var hash = $(this).addClass('selected')[0].hash.slice(1);
		$contents.hide().filter(function(i, el){
			return el.id === hash
		}).show();

	});

	// Kick it all off

	if(!window.location.hash) {
		window.location.hash = $btns.filter(function(i, el){
			return el.attributes.default;
		})[0].hash;
	}

	$contents.filter(function(i, el){
		return el.id === getHash();
	}).show();

	$btns.filter(function(i, el){
		return el.hash === window.location.hash;
	}).addClass('selected');

})//()
