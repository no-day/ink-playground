################################################################################
# This file contains all major commands that can be run on the monorepo.
#
# You'll find commands that run
#   - spcifically on entrypoints like CLIs, webapps or servers.
#   - ecosystem specific (e.g. Rust or TypeScript)
#
# You can run them like `make backend-test` or `make rust-clean`
# 
# Those commands are composed in the global commands. E.g to run all tests
# composed from the above categories, run:
# `make test`
#
# Finally a composition of all checking commands is provided:
# `make ci`
# This is useful to get an early local feedback how real CI will run.
################################################################################


################################################################################
# ENTRYPOINT: playground
################################################################################

playground-build:
	yarn workspace playground run build

playground-start:
	yarn workspace playground run start

playground-clean:
	yarn workspace playground run clean

playground-test:
	yarn workspace playground run test

playground-test-watch:
	yarn workspace playground run test:watch

playground-bundlesize:
	yarn workspace playground run bundlesize

################################################################################
# ENTRYPOINT: crate-extractor
################################################################################

crate-extractor-build:
	cargo build -p crate-extractor

crate-extractor-test:
	cargo test -p crate-extractor

################################################################################
# ENTRYPOINT: BACKEND
################################################################################

backend-build:
	cargo build -p backend

backend-test:
	cargo test -p backend

################################################################################
# ECOSYSTEM: RUST
################################################################################

rust-check-format:
	cargo fmt --all -- --check

rust-clean:
	rm -rf target

rust-lint:
	cargo clippy --workspace --exclude playground --all-targets --all-features \
	-- -D warnings

rust-test:
	cargo test --workspace --exclude playground 

################################################################################
# ECOSYSTEM: TYPESCRIPT
################################################################################

ts-check-format:
	yarn run prettier --check .

ts-check-spelling:
#	yarn cspell '**/*.*'

ts-clean:
	rm -rf node_modules

ts-format:
	yarn run prettier --write .

ts-install:
	yarn install

ts-lint:
	yarn run eslint . --ext .ts --ext .tsx

ts-patch-markdown:
	yarn markdown

################################################################################
# GLOBAL
################################################################################

build: playground-build
build: crate-extractor-build
build: backend-build

check-format: rust-check-format
check-format: ts-check-format

check-spelling: ts-check-spelling

clean: rust-clean
clean: ts-clean

install: ts-install

lint: rust-lint
lint: ts-lint

patch-markdown: ts-patch-markdown

test: rust-test
test: playground-test
test: crate-extractor-test
test: backend-test

################################################################################
# CI
################################################################################

ci: clean
ci: install
ci: check-spelling
ci: check-format
ci: lint
ci: test
ci: build
