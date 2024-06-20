import { makePlugin } from "../make-plugin";

interface IDataPluginConfig {
  data: any
}

export const dataPlugin = makePlugin<IDataPluginConfig>("RTDataPlugin", (_, config, callback) => {
  const { data } = config
  callback({ data: data })
})
