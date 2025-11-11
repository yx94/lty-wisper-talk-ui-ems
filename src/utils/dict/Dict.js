import Vue from 'vue'
import { mergeRecursive } from "@/utils/ruoyi";
import DictMeta from './DictMeta'
import DictData from './DictData'

const DEFAULT_DICT_OPTIONS = {
  types: [],
}

/**
 * @classdesc 字典
 * @property {Object} label 标签对象，内部属性名为字典类型名称
 * @property {Object} dict 字段数组，内部属性名为字典类型名称
 * @property {Array.<DictMeta>} _dictMetas 字典元数据数组
 */
export default class Dict {
  constructor() {
    // 数据结构示例：
    // {
    //   owner: VueComponent
    //   label: Object
    //     sys_normal_disable: Object
    //       0: "正常"
    //       1: "停用"
    //   type: Object
    //     sys_normal_disable: Array(2)
    //       0: DictData
    //         label: "正常"
    //         raw: Object
    //         value: "0"
    // }
    this.owner = null
    this.label = {}
    this.type = {}
  }
  /**
   * 初始化方法
   * @param {Object|Array} options - 配置选项，可以是对象或数组如果为数组，会被转换为{types:数组}的形式
   * @returns {Promise} - 返回一个Promise对象，用于异步加载字典
   *
   * 该方法主要用于初始化字典配置，根据传入的配置选项options来设置字典的类型和标签
   * 首先检查options是否为数组，如果是则转换为{types:options}的形式
   * 然后将options与默认配置DEFAULT_DICT_OPTIONS合并，如果types未定义，则抛出错误
   * 接着遍历types，对每个类型进行处理，如果类型配置了懒加载(lazy)，则跳过当前类型，否则加入到异步加载队列ps中
   * 最后返回Promise.all(ps)，等待所有异步加载完成
   */
  init(options) {
    // 检查options是否为数组，如果是则转换为{types:options}的形式
    if (options instanceof Array) {
      options = { types: options }
    }
    // 将options与默认配置DEFAULT_DICT_OPTIONS合并
    const opts = mergeRecursive(DEFAULT_DICT_OPTIONS, options)
    // 检查合并后的配置中types是否未定义，如果未定义则抛出错误
    if (opts.types === undefined) {
      throw new Error('need dict types')
    }
    // 初始化一个空数组ps，用于存放异步加载任务
    const ps = []
    // 遍历types，对每个类型进行处理
    // 将 opts.types 转换为 _dictMetas 数组
    // DictMeta 数据结构示例：
    // {
    //   labelField: "dictLabel"
    //   lazy: false
    //   request: ƒ request(dictMeta)
    //   responseConverter: ƒ responseConverter(response, dictMeta)
    //   type: "sys_normal_disable"
    //   valueField: "dictValue"
    // }
    this._dictMetas = opts.types.map(t => DictMeta.parse(t))
    // 对每个字典元数据进行处理
    this._dictMetas.forEach(dictMeta => {
      // 获取当前字典元数据的类型
      const type = dictMeta.type
      // 使用Vue.set确保this.label对象中type属性的响应式
      Vue.set(this.label, type, {})
      // 使用Vue.set确保this.type对象中type属性的响应式，并初始化为一个空数组
      Vue.set(this.type, type, [])
      // 检查当前字典元数据是否配置了懒加载，如果配置了，则直接返回，不执行下面的代码
      if (dictMeta.lazy) {
        return
      }
      // 将加载字典的任务加入到异步加载队列ps中
      ps.push(loadDict(this, dictMeta))
    })
    // 返回Promise.all(ps)，等待所有异步加载完成
    return Promise.all(ps)
  }

  /**
   * 重新加载字典
   * @param {String} type 字典类型
   */
  reloadDict(type) {
    const dictMeta = this._dictMetas.find(e => e.type === type)
    if (dictMeta === undefined) {
      return Promise.reject(`the dict meta of ${type} was not found`)
    }
    return loadDict(this, dictMeta)
  }
}

/**
 * 加载字典
 * @param {Dict} dict 字典
 * @param {DictMeta} dictMeta 字典元数据
 * @returns {Promise}
 */
function loadDict(dict, dictMeta) {
  // 使用字典元数据中的请求配置发送请求
  return dictMeta.request(dictMeta)
    .then(response => {
      // 从字典元数据中获取字典类型
      const type = dictMeta.type
      // 调用字典元数据中的响应转换器，将响应数据转换为字典数据数组
      let dicts = dictMeta.responseConverter(response, dictMeta)
      // 检查转换结果是否为数组，如果不是，则输出错误信息并重置字典数据数组
      if (!(dicts instanceof Array)) {
        console.error('the return of responseConverter must be Array.<DictData>')
        dicts = []
      }
      // 检查转换结果中的每个元素是否为DictData实例，如果不是，则输出错误信息并重置字典数据数组
      else if (dicts.filter(d => d instanceof DictData).length !== dicts.length) {
        console.error('the type of elements in dicts must be DictData')
        dicts = []
      }
      // 将转换后的字典数据数组赋值给字典对象中的对应类型数组
      dict.type[type].splice(0, Number.MAX_SAFE_INTEGER, ...dicts)
      // 遍历字典数据数组，使用Vue.set方法设置字典标签对象中的属性
      dicts.forEach(d => {
        Vue.set(dict.label[type], d.value, d.label)
      })
      // 返回转换后的字典数据数组
      return dicts
    })
}
