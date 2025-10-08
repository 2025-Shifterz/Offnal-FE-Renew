module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy', // CSS 파일을 무시하고 객체처럼 처리
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js', // svg의 리액트 컴포넌트인 경우
    // sqlite 무시
    '^react-native-sqlite-storage$':
      '<rootDir>/__mocks__/react-native-sqlite-storage.js',
  },

  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './html-report',
        filename: 'test-report.html',
        expand: true,
      },
    ],
  ],
}
