################################################################################
# This file contains all major commands that can be run on the monorepo.
#
# You'll find commands that run
#   - spcifically on entrypoints like CLIs, webapps or servers.
#   - on files of a specific language (e.g. Rust or TypeScript)
#   - generally (like e.g. Prettier checking formatting in various file types)
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

playground-clean:
	yarn workspace playground run clean

playground-install:
	yarn workspace playground install

playground-test:
	yarn workspace playground run test

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
# LANGUAGE: RUST
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
# LANGUAGE: TYPESCRIPT
################################################################################

ts-clean:
	rm -rf node_modules

ts-lint:
	yarn run eslint . --ext .ts --ext .tsx


################################################################################
# GENERAL
################################################################################

general-check-format:
	yarn run prettier --check .

################################################################################
# GLOBAL
################################################################################

build: playground-build
build: crate-extractor-build
build: backend-build

check-format: rust-check-format
# TODO: activate in next PR in favor of smaller diffs
# check-format: general-check-format

clean: rust-clean
clean: ts-clean

install: playground-install

lint: rust-lint
lint: ts-lint

test: rust-test
test: playground-test
test: crate-extractor-test
test: backend-test

################################################################################
# CI
################################################################################

ci: install
ci: check-format
ci: lint
ci: test
ci: build
