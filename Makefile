# Use nodemon if available or fallback to node.
RUN = [ -e "`which nodemon`" ] && nodemon --debug . || node --debug .
NODE_CONFIG = $(PWD)/config.node.json

all:
	git submodule init
	git submodule update
	php ./build/build.php

# Run the node server using a custom config file to save updating the two
# when working on both the node and php versions. Just create a
# config.node.json file and it will be loaded instead.
serve:
ifneq ($(wildcard $(NODE_CONFIG)),)
	export JSBIN_CONFIG=$(NODE_CONFIG); $(RUN)
else
	$(RUN)
endif
