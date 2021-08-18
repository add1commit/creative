YARN := yarn
TS := tsc
NODE := $(YARN) ts-node

prepare:
	${NODE} scripts/sync.ts
	${NODE} scripts/collect.ts

dev:
	${NODE} ./bin/server.ts

build:
	${TS} -p .