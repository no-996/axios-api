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
    cache: 3000,
  },
  {
    name: 'todos',
    url: '/todos',
    des: '待办事项',
    params: {},
    children: [],
    cancel:'current'
  },
  {
    name: 'users',
    url: '/users',
    des: '用户',
    params: {},
    children: [],
    cancel:'previous'
  },
]
