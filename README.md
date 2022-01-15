# axios-api

基于 axios 可建立结构化实例的工具，有以下特点：

1. 基于 axios，兼容 axios 的 api，可无缝的迁移使用。
2. 内置了两种常用的请求终止（基于cancelToken）场景，可防止接口重复调用。
3. 内置了接口调用的缓存机制，在设置的有效期内，可从缓存中获得历史请求结果。
4. 内置了接口地址模板插入功能，满足基于 url 包含变量值的场景。
5. 关键：通过结构化的 api 定义生成结构化的 api 请求实例，在项目中畅快的快速调用业务接口。配套使用 webpack 插件（[@no-996/axios-api-webpack-plugin](https://www.npmjs.com/package/@no-996/axios-api-webpack-plugin)），可以自动生成 d.ts 声明文件，在 IDE 中可以获得 api 定义的提醒信息。

## 目录

- [结构化的api定义](#结构化的api定义)
- [结构化的api请求实例](#结构化的api请求实例)
- [请求中止cancel](#请求中止cancel)
- [缓存cache](#缓存cache)
- [api配置说明](#api配置说明)
- [axios-api配置说明](#axios-api配置说明)
- [依赖说明](#依赖说明)

## 结构化的api定义

```js
export default [
  {
    name: 'posts',
    des: '帖子',
    url: '/posts',
    params: {
      userId: undefined,
    },
    children: [
      {
        name: 'comments',
        des: '评论',
        url: '/posts/{postId}/comments',
        urlParams: {
          postId: undefined,
        },
        metadata: {
          urlParams: {
            postId: {
              name: '帖子id',
              required: true,
            },
          },
        },
      },
    ],
    metadata: {
      params: {
        userId: {
          name: '用户id',
          des: '用户唯一标识',
          type: 'string',
        },
      },
    },
  },
  {
    name: 'albums',
    url: '/albums',
    des: '专辑',
    params: {
      id: undefined,
    },
    children: [],
  },
  {
    name: 'photos',
    url: '/photos',
    des: '相片',
    params: {},
    children: [],
  },
  {
    name: 'todos',
    url: '/todos',
    des: '待办事项',
    params: {},
    children: [],
  },
  {
    name: 'users',
    url: '/users',
    des: '用户',
    params: {},
    children: [],
  },
]

```

## 结构化的api请求实例

通过结构化的 api 定义生成结构化的 api 请求实例，在项目中畅快的快速调用业务接口。

### 生成d.ts声明文件

> 配套使用webpack插件（[@no-996/axios-api-webpack-plugin](https://www.npmjs.com/package/@no-996/axios-api-webpack-plugin)），根据结构化定义，可以自动生成 d.ts 声明文件，在 IDE 中可以获得 api 定义的提醒信息：

#### 没有定义metadata：

一层：

![image](https://user-images.githubusercontent.com/16830398/149624445-b9543c5c-cdee-4b0e-99e4-ca32af20189d.png)
![image](https://user-images.githubusercontent.com/16830398/149625086-bebaaa97-840d-4b8b-bdff-8e44f88cc4b5.png)

二层：

![image](https://user-images.githubusercontent.com/16830398/149626322-9b6017f1-fffa-4351-8470-49940d7c06ac.png)
![image](https://user-images.githubusercontent.com/16830398/149626330-268241bb-6d8f-4753-b01d-c8227894f646.png)

调用提示：

![image](https://user-images.githubusercontent.com/16830398/149624935-af2fd05b-53f9-4d44-a207-b53315187f01.png)

#### 定义了metadata：

调用提示：

![image](https://user-images.githubusercontent.com/16830398/149626649-3fbd9872-70c9-4671-92ec-6821143ba583.png)
![image](https://user-images.githubusercontent.com/16830398/149626620-1c5edfb5-2c63-4a05-81cc-a607e265bc17.png)

## 请求中止cancel

### cancel: 'current'

> 保留当前正在进行的请求，中止后面重复的请求。

![image](https://user-images.githubusercontent.com/16830398/149627110-ba0528d7-5c09-42d2-a4ed-21ddf0939a39.png)

### cancel: 'previous'

> 放弃之前的请求，保留最新提交的请求。

![image](https://user-images.githubusercontent.com/16830398/149627142-e41541c2-8328-45c2-a4b8-d8425c31424a.png)

## 缓存cache

### cache: 3000

> 3秒内不再request请求，从缓存中获取历史返回结果。

![image](https://user-images.githubusercontent.com/16830398/149627530-189f94ff-c0bf-43a9-91e3-8e72e483e457.png)

## api配置说明

## axios-api配置说明

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
