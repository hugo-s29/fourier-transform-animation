import { WebSceneManager } from 'graphize-v2/src/exporting/webSceneManager'
import { PRESET_HIGH } from 'graphize-v2/src/rendering/preset'
import { FourierScene } from './scenes'

window.addEventListener('load', async () => {
  const manager = new WebSceneManager(FourierScene, PRESET_HIGH)

  await manager.prepare()
  await manager.run()
  manager.cleanUp()
})
