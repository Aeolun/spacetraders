import {defaultWayfinder, printRoute} from "@app/wayfinding";

defaultWayfinder.findRoute('X1-QM77', 'X1-A78', {
  max: 1200,
  current: 1200
}).then(result => {
    printRoute(result.finalPath, result.pathProperties);
})