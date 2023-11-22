import {defaultSystemWayfinder} from "@common/default-wayfinder";

const test = async () => {
  await defaultSystemWayfinder.loadSystemFromDb('X1-JR43')

  const route = await defaultSystemWayfinder.findRoute('X1-JR43-E55', 'X1-JR43-J67', {max: 400, current: 100})

  route.finalPath.forEach((link) => {
    console.log(link)
  })
}

test();
