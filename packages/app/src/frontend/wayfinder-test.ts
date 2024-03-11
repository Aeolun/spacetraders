import {defaultSystemWayfinder} from "@common/default-wayfinder";

const test = async () => {
  await defaultSystemWayfinder.loadSystemFromDb('X1-GD93', true)

  const route = await defaultSystemWayfinder.findRoute('X1-GD93-I56', 'X1-GD93-K84', {max: 600, current: 112})

  console.log('Found route')
  route.finalPath.forEach((link) => {
    console.log(link)
  })
}

test();
