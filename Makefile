YARN := yarn
TS := tsc
NODE := node
TSNODE := ts-node


build:
	${TSNODE} scripts/sync.ts
	${TSNODE} scripts/collect.ts
	${TS} -p .

preview:
	${NODE} ./lib/bin/server.js