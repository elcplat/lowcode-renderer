export interface Schema {
  id?: string
  componentName: string
  detectField?: string
  visibleOn?: string
  hiddenOn?: string
  disabledOn?: string
  staticOn?: string
  visible?: boolean
  hidden?: boolean
  disabled?: boolean
  static?: boolean
  children?: JSX.Element | ((props: any, schema?: any) => JSX.Element) | null
  definitions?: Definitions
  [propName: string]: any
}

export interface Definitions {
  [propName: string]: SchemaNode
}

export type SchemaNode = Schema | Array<Schema | string>
