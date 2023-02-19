import { isNull, isUndefined, isEmpty, isArray, isObject } from 'lodash-es'
import { RendererConfig } from '../types/renderer'

export class Manager {
  private _renderers: Array<RendererConfig> = []
  private _renderersMap: {
    [propName: string]: boolean
  } = {}

  anonymousIndex: number = 1

  get renderers() {
    return this._renderers.concat()
  }

  set renderers(val) {
    this._renderers = val
  }

  get renderersMap() {
    return this._renderersMap
  }

  set renderersMap(val) {
    this._renderersMap = val
  }

  private registerRenderer(config: RendererConfig) {
    if (!config.test && !config.type) {
      throw new TypeError('please set config.test or config.type')
    } else if (!config.component) {
      throw new TypeError('config.component is required')
    }

    if (typeof config.type === 'string' && config.type) {
      config.type = config.type.toLowerCase()
      // config.test = config.test || new RegExp(`(^|\/)${string2regExp(config.type)}$`, 'i');
    }

    config.weight = config.weight || 0
    config.Renderer = config.component
    config.name =
      config.name || config.type || `anonymous-${this.anonymousIndex++}`

    if (this.renderersMap[config.name]) {
      throw new Error(
        `The renderer with name "${config.name}" has already exists, please try another name!`
      )
    } else if (this.renderersMap.hasOwnProperty(config?.name)) {
      // 后面补充的
      const idx = this.renderers.findIndex((item) => item.name === config.name)
      ~idx && this.renderers.splice(idx, 0, config)
    }

    if (config.storeType && config.component) {
      config.component = HocStoreFactory({
        storeType: config.storeType,
        extendsData: config.storeExtendsData,
      })(config.component)
    }

    if (config.isolateScope) {
      config.component = Scoped(config.component)
    }

    const idx = this.renderers.findIndex(
      (item: any) => (config.weight as number) < item.weight
    )
    ~idx ? this.renderers.splice(idx, 0, config) : this.renderers.push(config)
    this.renderersMap[config.name] = true

    return config
  }

  register(configs: RendererConfig | RendererConfig[]) {
    if (isNull(configs) || isUndefined(configs) || isEmpty(configs)) {
      throw new TypeError('register 组件注册不能为空')
    }

    if (isArray(configs)) {
      configs.forEach((item) => this.registerRenderer(item))
    } else if (isObject(configs)) {
      this.registerRenderer(configs)
    } else {
      throw new TypeError('register 组件注册只支持数组和对象')
    }
  }
}
