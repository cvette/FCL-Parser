BIN = ./node_modules/.bin
REPORTER ?= spec

test:
		@$(BIN)/mocha -b -u tdd --check-leaks --colors --reporter $(REPORTER)
generate:
		@$(BIN)/jison ./lib/fcl.jison ./lib/fcl.jisonlex -o ./lib/fcl.js

.PHONY: test generate