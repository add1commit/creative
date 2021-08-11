YARN := yarn
TS := tsc
NODE := $(YARN) ts-node
NM := $(YARN) nodemon

collect:
	${NODE} scripts/collect-res.ts

dev:
	${NM} -q

build:
	${TS} -p .