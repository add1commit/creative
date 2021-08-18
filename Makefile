YARN := yarn
TS := tsc
NODE := $(YARN) ts-node

collect:
	${NODE} scripts/collect-res.ts

dev:
	${NODE} ./bin/server.ts

build:
	${TS} -p .