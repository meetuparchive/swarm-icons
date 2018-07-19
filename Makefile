CI_BUILD_NUMBER ?= $(USER)-snapshot
VERSION ?= 3.6.$(CI_BUILD_NUMBER)

version:
	@echo $(VERSION)

