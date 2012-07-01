all:
	git submodule init
	git submodule update
	php ./build/build.php
