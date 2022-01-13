export default [
  {
    name: 'human',
    des: '人类',
    url: '/posts/1',
    method: 'post',
    data: {
      a: '1',
      b: 2,
      f: [2, 3, 4],
      g: [
        {
          x: 1,
          y: '2',
        },
      ],
    },
    params: {
      c: 3,
      d: {
        e: 4,
        f: 5,
      },
    },
    metadata: {
      data: {
        a: {
          name: '参数a',
          des: '参数a的描述',
          type: 'string',
          required: true,
        },
        f: {
          name: '参数f',
          des: '参数f的描述',
          type: 'number',
          isArray: true,
        },
        g: {
          name: '参数g',
          des: '参数g的描述',
          type: {
            x: {
              name: '参数x',
              des: '参数x的描述',
              type: 'number',
            },
            y: {
              name: '参数y',
              des: '参数y的描述',
              type: 'string',
            },
          },
          isArray: true,
        },
      },
      params: {
        c: {
          name: '参数c',

          type: 'number',
        },
        d: {
          name: '参数d',
          type: {
            e: {
              name: '参数e',
              type: 'number',
            },
            f: {
              name: '参数f',
              type: 'number',
            },
          },
        },
      },
    },
  },
  {
    name: 'annimal',
    url: '/posts/2',
    data: {
      x: [1, 2],
      y: [
        {
          a: 1,
          b: '2',
        },
        {
          a: 3,
          b: '4',
        },
      ],
    },
    metadata: {
      x: {
        name: '参数x',
        type: 'number',
        isArray: true,
      },
      y: {
        name: '参数y',
        type: {
          a: {
            name: '参数a',
            type: 'number',
          },
          b: {
            name: '参数b',
            type: 'string',
          },
        },
        isArray: true,
      },
    },
    children: [
      {
        name: 'dog',
        des: '狗',
        children: [
          {
            name: 'golden',
            des: '金毛',
            url: '/posts/3',
            // cancel: 'previous',
            cancel: 'current',
            cache: 3000,
          },
          {
            name: 'teddy',
            des: '泰迪',
            url: '/posts/4',
          },
        ],
      },
      {
        name: 'cat',
        des: '猫',
        url: '/posts/5',
      },
    ],
  },
  {
    name: 'strRequired',
    des: 'str required',
    url: '/posts/6',
    data: '',
    metadata: {
      data: {
        name: '参数data',
        des: '参数data的描述',
        type: 'string',
        required: true,
      },
    },
  },
  {
    name: 'strArray',
    des: 'str array',
    url: '/posts/7',
    data: [],
    metadata: {
      data: {
        name: '参数data',
        des: '参数data的描述',
        type: 'string',
        isArray: true,
      },
    },
  },
  {
    name: 'objRequired',
    des: 'obj required',
    url: '/posts/8',
    data: {
      a: 9,
    },
    metadata: {
      data: {
        des: '参数data的描述',
        type: {
          a: {
            name: 'name a',
            type: 'string',
          },
          b: {
            name: 'name b',
            type: 'number',
          },
        },
        required: true,
      },
    },
  },
]
