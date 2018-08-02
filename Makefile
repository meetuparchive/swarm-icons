CI_BUILD_NUMBER ?= $(USER)-snapshot
VERSION ?= 3.7.$(CI_BUILD_NUMBER)

version:
	@echo $(VERSION)

