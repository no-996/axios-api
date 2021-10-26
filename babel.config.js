const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        ie: '9',
      },
      useBuiltIns: 'usage',
      corejs: 2,
      debug: false,
    },
  ],
  '@vue/babel-preset-jsx',
  '@babel/preset-typescript',
]

const plugins = ['@babel/transform-runtime']

module.exports = {
  presets,
  plugins,
  sourceType: 'unambiguous',
}
