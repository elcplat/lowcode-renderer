import { Schema, SchemaNode } from './schema'
import { DefineComponent, Component } from 'vue'

export interface TestFunc {
  (
    path: string,
    schema?: Schema,
    resolveRenderer?: (
      path: string,
      schema?: Schema,
      props?: any
    ) => null | RendererConfig
  ): boolean
}

export interface RendererBasicConfig {
  test?: RegExp | TestFunc
  type?: string
  name?: string
  storeType?: string
  shouldSyncSuperStore?: (
    store: any,
    props: any,
    prevProps: any
  ) => boolean | undefined
  storeExtendsData?: boolean | ((props: any) => boolean) // 是否需要继承上层数据。
  weight?: number // 权重，值越低越优先命中。
  isolateScope?: boolean
  isFormItem?: boolean
  autoVar?: boolean // 自动解析变量
  // [propName:string]:any;
}

export interface RendererConfig extends RendererBasicConfig {
  component: DefineComponent
  Renderer?: DefineComponent // 原始组件
}

export type TranslateFn<T = any> = (str: T, data?: object) => T

export interface LocaleProps {
  locale: string
  translate: TranslateFn
}

export interface OnEventProps {
  onEvent?: {
    [propName: string]: {
      weight?: number // 权重
      actions: ListenerAction[] // 执行的动作集,
      debounce?: debounceConfig
    }
  }
}

export interface debounceConfig {
  maxWait?: number
  wait?: number
  leading?: boolean
  trailing?: boolean
}

export interface ListenerAction {
  actionType: string // 动作类型 逻辑动作|自定义（脚本支撑）|reload|url|ajax|dialog|drawer 其他扩充的组件动作
  description?: string // 事件描述，actionType: broadcast
  componentId?: string // 组件ID，用于直接执行指定组件的动作，指定多个组件时使用英文逗号分隔
  args?: Record<string, any> // 动作配置，可以配置数据映射
  data?: Record<string, any> | null // 动作数据参数，可以配置数据映射
  dataMergeMode?: 'merge' | 'override' // 参数模式，合并或者覆盖
  outputVar?: string // 输出数据变量名
  preventDefault?: boolean // 阻止原有组件的动作行为
  stopPropagation?: boolean // 阻止后续的事件处理器执行
  expression?: string // 执行条件
  execOn?: string // 执行条件，1.9.0废弃
}

export interface ThemeProps {
  className?: string
  style?: {
    [propName: string]: any
  }
  classPrefix: string
  theme?: string
}

export interface RendererProps extends ThemeProps, LocaleProps, OnEventProps {
  render: (region: string, node: SchemaNode, props?: PlainObject) => JSX.Element
  env: RendererEnv
  $path: string // 当前组件所在的层级信息
  $schema: any // 原始 schema 配置
  store?: any
  syncSuperStore?: boolean
  data: {
    [propName: string]: any
  }
  defaultData?: object
  className?: any
  style?: {
    [propName: string]: any
  }
  [propName: string]: any
}

export interface PlainObject {
  [propsName: string]: any
}
