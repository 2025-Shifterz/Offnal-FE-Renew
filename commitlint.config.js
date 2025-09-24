module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2, // 0=off, 1=warning, 2=error
      'always',
      [
        'feat',
        'fix',
        'chore',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'ci',
        'build',
        'revert',
        // ✅ 커스텀 추가
        'hotfix',
        'release',
      ],
    ],
  },
}
