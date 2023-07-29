import {defaultWayfinder, printRoute} from "@app/wayfinding";

defaultWayfinder.findRoute('X1-JX18', 'X1-GD92', {
  max: 1200,
  current: 1200
}).then(result => {
    printRoute(result.finalPath, result.pathProperties);
})