# Configs
BUILDDIR=build
ZIPFILE=canoe-chrome-extension.zip

INCLUDE=$(shell cat ./include)
INITIAL=./initial.js
BASE=$(CURDIR)


all: $(ZIPFILE)

dir:
	rm -rf $(BUILDDIR)
	mkdir -p $(BUILDDIR)
	cp manifest.json $(BUILDDIR)/manifest.json
	cp -vf $(INITIAL) $(BUILDDIR)

files:
	cd ../www && rsync -rLRv --exclude-from $(BASE)/exclude $(INCLUDE) $(BASE)/$(BUILDDIR) && cd -


$(ZIPFILE): dir files
	cd $(BUILDDIR)
	rm -f $(ZIPFILE)
	zip -qr $(ZIPFILE) "`basename $(BUILDDIR)`"
	@echo "** The Chrome Extension is ready at canoe-chrome-extension.zip"
