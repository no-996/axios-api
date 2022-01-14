# axios-api

基于 axios 可建立结构化实例的工具，有以下特点：

1. 基于 axios，兼容 axios 的 api，可无缝的迁移使用。
2. 内置了两种常用的请求终止（基于cancelToken）场景，可防止接口重复调用。
3. 内置了接口调用的缓存机制，在设置的有效期内，可从缓存中获得历史请求结果。
4. 内置了接口地址模板插入功能，满足基于 url 包含变量值的场景。
5. 关键：通过结构化的 api 定义生成结构化的 api 请求实例，在项目中畅快的快速调用业务接口。配套使用 webpack 插件（[@no-996/axios-api-webpack-plugin](https://www.npmjs.com/package/@no-996/axios-api-webpack-plugin)），可以自动生成 d.ts 声明文件，在 IDE 中可以获得 api 定义的提醒信息。

## 目录

- [结构化的api定义](结构化的api定义)

- [结构化的api请求实例](结构化的api请求实例)

- [生成d.ts声明文件](生成d.ts声明文件)

- [请求终止 Cancel](#Cancel)

- [缓存 Cache](Cache)

- [依赖说明](依赖说明)

## 结构化的api定义



## 结构化的api请求实例



## 生成d.ts声明文件



## 请求终止 Cancel



## 缓存 Cache



## 依赖说明

```json
"dependencies": {
    "@types/md5": "^2.3.1",
    "@types/qs": "6.9.7",
    "@types/uuid": "^8.3.4",
    "axios": "0.24.0",
    "md5": "^2.3.0",
    "qs": "6.7.0",
    "uuid": "^8.3.2"
}
```
