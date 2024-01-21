import {defaultSystemWayfinder} from "@common/default-wayfinder";

const test = async () => {
  await defaultSystemWayfinder.loadSystemFromDb('X1-NG13', false)

  const route = await defaultSystemWayfinder.findRoute('X1-NG13-J60', 'X1-NG13-A2', {max: 400, current: 400})

  console.log('Found route')
  route.finalPath.forEach((link) => {
    console.log(link)
  })
}

test();
