/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',

  theme: {
    extend: {
      // 색상 정의
      colors: {
        /* --- kakao login guidline --- */
        'kakao-bg': 'var(--color-kakao-bg)',
        'kakao-text': 'var(--color-kakao-text)',

        /* ------------------------------------------------------ */
        /* --- Premitive Color --- */
        /* ------------------------------------------------------ */
        'alpha-black': {
          0: '#00000000',
          10: '#0000001a',
          25: '#00000040',
          50: '#00000080',
          75: '#000000bf',
        },

        'alpha-white': {
          0: '#ffffff00',
          10: '#ffffff1a',
          25: '#ffffff40',
          50: '#ffffff80',
          75: '#ffffffbf',
        },

        danger: {
          5: '#fdefec',
          10: '#fcdfd9',
          20: '#f7afa1',
          30: '#f48771',
          40: '#f05f42',
          50: '#de3412',
          60: '#bd2c0f',
          70: '#8a240f',
          80: '#5c180a',
          90: '#390d05',
          95: '#260903',
        },

        gray: {
          0: '#ffffff',
          5: '#f4f5f6',
          10: '#e6e8ea',
          20: '#cdd1d5',
          30: '#b1b8be',
          40: '#8a949e',
          50: '#6d7882',
          60: '#58616a',
          70: '#464c53',
          80: '#33363d',
          90: '#1e2124',
          95: '#131416',
          100: '#000000',
        },

        information: {
          5: '#e7f4fe',
          10: '#d3ebfd',
          20: '#9ed2fa',
          30: '#5fb5f7',
          40: '#2098f3',
          50: '#0b78cb',
          60: '#096ab3',
          70: '#085691',
          80: '#053961',
          90: '#03253f',
          95: '#021a2c',
        },

        point: {
          5: '#fdfcec',
          10: '#faf6c7',
          20: '#f6efa2',
          30: '#f3e97c',
          40: '#eee147',
          50: '#e0cf15',
          60: '#bbad11',
          70: '#958a0e',
          80: '#70680a',
          90: '#4b4507',
          95: '#252303',
          100: '#131102',
        },

        primary: {
          5: '#eefbfc',
          10: '#dcf6f9',
          20: '#b9edf3',
          30: '#96e5ed',
          40: '#73dce7',
          50: '#51d3e1',
          60: '#2ecadc',
          70: '#1b909d',
          80: '#15707a',
          90: '#0f5057',
          95: '#062023',
        },

        success: {
          5: '#eaf6ec',
          10: '#d8eedd',
          20: '#a9dab4',
          30: '#7ec88e',
          40: '#3fa654',
          50: '#228738',
          60: '#267337',
          70: '#285d33',
          80: '#1f4727',
          90: '#122b18',
          95: '#0e2012',
        },

        warning: {
          5: '#fff3db',
          10: '#ffe0a3',
          20: '#ffc95c',
          30: '#ffb114',
          40: '#c78500',
          50: '#9e6a00',
          60: '#8a5c00',
          70: '#614100',
          80: '#422c00',
          90: '#2e1f00',
          95: '#241800',
        },

        /* ------------------------------------------------------ */
        /* --- Light Mode Color (CSS 변수 직접 참조) --- */
        /* ------------------------------------------------------ */
        // global.css의 :root에 정의된 Light Mode 변수를 직접 참조합니다.
        'action-disabled': 'var(--color-action-disabled)',
        'action-primary': 'var(--color-action-primary)',
        'action-primary-active': 'var(--color-action-primary-active)',
        'action-primary-pressed': 'var(--color-action-primary-pressed)',
        'action-primary-selected': 'var(--color-action-primary-selected)',
        'action-white': 'var(--color-action-white)',

        'alpha-base0': 'var(--color-alpha-base0)',
        'alpha-base10': 'var(--color-alpha-base10)',
        'alpha-base25': 'var(--color-alpha-base25)',
        'alpha-base50': 'var(--color-alpha-base50)',
        'alpha-base75': 'var(--color-alpha-base75)',
        'alpha-base100': 'var(--color-alpha-base100)',

        'alpha-inverse0': 'var(--color-alpha-inverse0)',
        'alpha-inverse10': 'var(--color-alpha-inverse10)',
        'alpha-inverse25': 'var(--color-alpha-inverse25)',
        'alpha-inverse50': 'var(--color-alpha-inverse50)',
        'alpha-inverse75': 'var(--color-alpha-inverse75)',
        'alpha-inverse100': 'var(--color-alpha-inverse100)',

        'alpha-shadow1': 'var(--color-alpha-shadow1)',
        'alpha-shadow2': 'var(--color-alpha-shadow2)',
        'alpha-shadow3': 'var(--color-alpha-shadow3)',

        'background-black': 'var(--color-background-black)',
        'background-dim': 'var(--color-background-dim)',
        'background-gray-subtle1': 'var(--color-background-gray-subtle1)',
        'background-gray-subtle2': 'var(--color-background-gray-subtle2)',
        'background-inverse': 'var(--color-background-inverse)',
        'background-white': 'var(--color-background-white)',

        'border-danger': 'var(--color-border-danger)',
        'border-danger-light': 'var(--color-border-danger-light)',
        'border-disabled': 'var(--color-border-disabled)',
        'border-gray': 'var(--color-border-gray)',
        'border-gray-dark': 'var(--color-border-gray-dark)',
        'border-gray-darker': 'var(--color-border-gray-darker)',
        'border-gray-light': 'var(--color-border-gray-light)',
        'border-information': 'var(--color-border-information)',
        'border-information-light': 'var(--color-border-information-light)',
        'border-inverse': 'var(--color-border-inverse)',
        'border-primary': 'var(--color-border-primary)',
        'border-primary-light': 'var(--color-border-primary-light)',
        'border-secondary': 'var(--color-border-secondary)',
        'border-secondary-light': 'var(--color-border-secondary-light)',
        'border-success': 'var(--color-border-success)',
        'border-success-light': 'var(--color-border-success-light)',
        'border-transparency': 'var(--color-border-transparency)',
        'border-warning': 'var(--color-border-warning)',
        'border-warning-light': 'var(--color-border-warning-light)',

        'button-disabled-border': 'var(--color-button-disabled-border)',
        'button-disabled-fill': 'var(--color-button-disabled-fill)',
        'button-primary-fill': 'var(--color-button-primary-fill)',
        'button-primary-fill-pressed':
          'var(--color-button-primary-fill-pressed)',
        'button-secondary-border': 'var(--color-button-secondary-border)',
        'button-secondary-fill': 'var(--color-button-secondary-fill)',
        'button-secondary-fill-pressed':
          'var(--color-button-secondary-fill-pressed)',
        'button-tertiary-border': 'var(--color-button-tertiary-border)',
        'button-tertiary-fill': 'var(--color-button-tertiary-fill)',
        'button-tertiary-fill-pressed':
          'var(--color-button-tertiary-fill-pressed)',
        'button-text-border': 'var(--color-button-text-border)',
        'button-text-fill': 'var(--color-button-text-fill)',
        'button-text-fill-pressed': 'var(--color-button-text-fill-pressed)',

        'divider-gray': 'var(--color-divider-gray)',
        'divider-gray-dark': 'var(--color-divider-gray-dark)',
        'divider-gray-darker': 'var(--color-divider-gray-darker)',
        'divider-gray-light': 'var(--color-divider-gray-light)',

        'surface-danger-subtle': 'var(--color-surface-danger-subtle)',
        'surface-disabled': 'var(--color-surface-disabled)',
        'surface-disabled-inverse': 'var(--color-surface-disabled-inverse)',
        'surface-gray-subtle1': 'var(--color-surface-gray-subtle1)',
        'surface-gray-subtle2': 'var(--color-surface-gray-subtle2)',
        'surface-information-subtle': 'var(--color-surface-information-subtle)',
        'surface-inverse': 'var(--color-surface-inverse)',
        'surface-inverse-static': 'var(--color-surface-inverse-static)',
        'surface-primary': 'var(--color-surface-primary)',
        'surface-primary-light': 'var(--color-surface-primary-light)',
        'surface-primary-light-2': 'var(--color-surface-primary-light-2)',
        'surface-primary-light-3': 'var(--color-surface-primary-light-3)',
        'surface-primary-light-4': 'var(--color-surface-primary-light-4)',
        'surface-primary-subtle': 'var(--color-surface-primary-subtle)',
        'surface-secondary-subtle': 'var(--color-surface-secondary-subtle)',
        'surface-success-subtle': 'var(--color-surface-success-subtle)',
        'surface-warning-subtle': 'var(--color-surface-warning-subtle)',
        'surface-white': 'var(--color-surface-white)',
        'surface-white-static': 'var(--color-surface-white-static)',
        'surface-white-subtle': 'var(--color-surface-white-subtle)',
        'surface-white-subtle-dark': 'var(--color-surface-white-subtle-dark)',

        'text-basic': 'var(--color-text-basic)',
        'text-basic-inverse': 'var(--color-text-basic-inverse)',
        'text-bolder': 'var(--color-text-bolder)',
        'text-bolder-inverse': 'var(--color-text-bolder-inverse)',
        'text-danger': 'var(--color-text-danger)',
        'text-disabled': 'var(--color-text-disabled)',
        'text-disabled-on': 'var(--color-text-disabled-on)',
        'text-information': 'var(--color-text-information)',
        'text-inverse-static': 'var(--color-text-inverse-static)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-static': 'var(--color-text-static)',
        'text-subtle': 'var(--color-text-subtle)',
        'text-subtle-inverse': 'var(--color-text-subtle-inverse)',
        'text-success': 'var(--color-text-success)',
        'text-warning': 'var(--color-text-warning)',

        /* ------------------------------------------------------ */
        /* --- Dark Mode Color (CSS 변수 직접 참조) --- */
        /* ------------------------------------------------------ */
        // global.css의 :root에 정의된 Dark Mode 변수를 직접 참조합니다.
        'dark-action-disabled': 'var(--color-action-disabled)',
        'dark-action-primary': 'var(--color-action-primary)',
        'dark-action-primary-active': 'var(--color-action-primary-active)',
        'dark-action-primary-pressed': 'var(--color-action-primary-pressed)',
        'dark-action-primary-selected': 'var(--color-action-primary-selected)',
        'dark-action-white': 'var(--color-action-white)',

        'dark-alpha-base0': 'var(--color-alpha-base0)',
        'dark-alpha-base10': 'var(--color-alpha-base10)',
        'dark-alpha-base25': 'var(--color-alpha-base25)',
        'dark-alpha-base50': 'var(--color-alpha-base50)',
        'dark-alpha-base75': 'var(--color-alpha-base75)',
        'dark-alpha-base100': 'var(--color-alpha-base100)',

        'dark-alpha-inverse0': 'var(--color-alpha-inverse0)',
        'dark-alpha-inverse10': 'var(--color-alpha-inverse10)',
        'dark-alpha-inverse25': 'var(--color-alpha-inverse25)',
        'dark-alpha-inverse50': 'var(--color-alpha-inverse50)',
        'dark-alpha-inverse75': 'var(--color-alpha-inverse75)',
        'dark-alpha-inverse100': 'var(--color-alpha-inverse100)',

        'dark-alpha-shadow1': 'var(--color-alpha-shadow1)',
        'dark-alpha-shadow2': 'var(--color-alpha-shadow2)',
        'dark-alpha-shadow3': 'var(--color-alpha-shadow3)',

        'dark-background-black': 'var(--color-background-black)',
        'dark-background-dim': 'var(--color-background-dim)',
        'dark-background-gray-subtle1': 'var(--color-background-gray-subtle1)',
        'dark-background-gray-subtle2': 'var(--color-background-gray-subtle2)',
        'dark-background-inverse': 'var(--color-background-inverse)',
        'dark-background-white': 'var(--color-background-white)',

        'dark-border-danger': 'var(--color-border-danger)',
        'dark-border-danger-light': 'var(--color-border-danger-light)',
        'dark-border-disabled': 'var(--color-border-disabled)',
        'dark-border-gray': 'var(--color-border-gray)',
        'dark-border-gray-dark': 'var(--color-border-gray-dark)',
        'dark-border-gray-darker': 'var(--color-border-gray-darker)',
        'dark-border-gray-light': 'var(--color-border-gray-light)',
        'dark-border-information': 'var(--color-border-information)',
        'dark-border-information-light':
          'var(--color-border-information-light)',
        'dark-border-inverse': 'var(--color-border-inverse)',
        'dark-border-primary': 'var(--color-border-primary)',
        'dark-border-primary-light': 'var(--color-border-primary-light)',
        'dark-border-secondary': 'var(--color-border-secondary)',
        'dark-border-secondary-light': 'var(--color-border-secondary-light)',
        'dark-border-success': 'var(--color-border-success)',
        'dark-border-success-light': 'var(--color-border-success-light)',
        'dark-border-transparency': 'var(--color-border-transparency)',
        'dark-border-warning': 'var(--color-border-warning)',
        'dark-border-warning-light': 'var(--color-border-warning-light)',

        'dark-button-disabled-border': 'var(--color-button-disabled-border)',
        'dark-button-disabled-fill': 'var(--color-button-disabled-fill)',
        'dark-button-primary-fill': 'var(--color-button-primary-fill)',
        'dark-button-primary-fill-pressed':
          'var(--color-button-primary-fill-pressed)',
        'dark-button-secondary-border': 'var(--color-button-secondary-border)',
        'dark-button-secondary-fill': 'var(--color-button-secondary-fill)',
        'dark-button-secondary-fill-pressed':
          'var(--color-button-secondary-fill-pressed)',
        'dark-button-tertiary-border': 'var(--color-button-tertiary-border)',
        'dark-button-tertiary-fill': 'var(--color-button-tertiary-fill)',
        'dark-button-tertiary-fill-pressed':
          'var(--color-button-tertiary-fill-pressed)',
        'dark-button-text-border': 'var(--color-button-text-border)',
        'dark-button-text-fill': 'var(--color-button-text-fill)',
        'dark-button-text-fill-pressed':
          'var(--color-button-text-fill-pressed)',

        'dark-divider-gray': 'var(--color-divider-gray)',
        'dark-divider-gray-dark': 'var(--color-divider-gray-dark)',
        'dark-divider-gray-darker': 'var(--color-divider-gray-darker)',
        'dark-divider-gray-light': 'var(--color-divider-gray-light)',

        'dark-surface-danger-subtle': 'var(--color-surface-danger-subtle)',
        'dark-surface-disabled': 'var(--color-surface-disabled)',
        'dark-surface-disabled-inverse':
          'var(--color-surface-disabled-inverse)',
        'dark-surface-gray-subtle1': 'var(--color-surface-gray-subtle1)',
        'dark-surface-gray-subtle2': 'var(--color-surface-gray-subtle2)',
        'dark-surface-information-subtle':
          'var(--color-surface-information-subtle)',
        'dark-surface-inverse': 'var(--color-surface-inverse)',
        'dark-surface-inverse-static': 'var(--color-surface-inverse-static)',
        'dark-surface-primary': 'var(--color-surface-primary)',
        'dark-surface-primary-light': 'var(--color-surface-primary-light)',
        'dark-surface-primary-light-2': 'var(--color-surface-primary-light-2)',
        'dark-primary-light-3': 'var(--color-primary-light-3)',
        'dark-surface-primary-light-4': 'var(--color-surface-primary-light-4)',
        'dark-surface-primary-subtle': 'var(--color-surface-primary-subtle)',
        'dark-surface-secondary-subtle':
          'var(--color-surface-secondary-subtle)',
        'dark-surface-success-subtle': 'var(--color-surface-success-subtle)',
        'dark-surface-warning-subtle': 'var(--color-surface-warning-subtle)',
        'dark-surface-white': 'var(--color-surface-white)',
        'dark-surface-white-static': 'var(--color-surface-white-static)',
        'dark-surface-white-subtle': 'var(--color-surface-white-subtle)',
        'dark-surface-white-subtle-dark':
          'var(--color-surface-white-subtle-dark)',

        'dark-text-basic': 'var(--color-text-basic)',
        'dark-text-basic-inverse': 'var(--color-text-basic-inverse)',
        'dark-text-bolder': 'var(--color-text-bolder)',
        'dark-text-bolder-inverse': 'var(--color-text-bolder-inverse)',
        'dark-text-danger': 'var(--color-text-danger)',
        'dark-text-disabled': 'var(--color-text-disabled)',
        'dark-text-disabled-on': 'var(--color-text-disabled-on)',
        'dark-text-information': 'var(--color-text-information)',
        'dark-text-inverse-static': 'var(--color-text-inverse-static)',
        'dark-text-primary': 'var(--color-text-primary)',
        'dark-text-secondary': 'var(--color-text-secondary)',
        'dark-text-static': 'var(--color-text-static)',
        'dark-text-subtle': 'var(--color-text-subtle)',
        'dark-text-subtle-inverse': 'var(--color-text-subtle-inverse)',
        'dark-text-success': 'var(--color-text-success)',
        'dark-text-warning': 'var(--color-text-warning)',
      },

      // 테두리 너비 정의
      borderWidth: {
        'border-width-static-regular': 'var(--border-width-static-regular)',
        'border-width-variable-regular': 'var(--border-width-variable-regular)',
        'border-width-static-medium': 'var(--border-width-static-medium)',
        'border-width-variable-medium': 'var(--border-width-variable-medium)',
      },

      // 그림자 정의
      boxShadow: {
        'shadow-y-1': 'var(--box-shadow-y-1)',
        'shadow-blur-1': 'var(--box-shadow-blur-1)',

        'shadow-y-2': 'var(--box-shadow-y-2)',
        'shadow-blur-2': 'var(--box-shadow-blur-2)',

        'shadow-y-3': 'var(--box-shadow-y-3)',
        'shadow-blur-3': 'var(--box-shadow-blur-3)',

        'shadow-y-4': 'var(--box-shadow-y-4)',
        'shadow-blur-4': 'var(--box-shadow-blur-4)',

        'shadow-y-5': 'var(--box-shadow-y-5)',

        shadow1:
          '0 1px 2px 0 var(--color-alpha-shadow1), 0 0 2px 0 var(--color-alpha-shadow1)',

        shadow2:
          '0 0 2px 0 var(--color-alpha-shadow2), 0 4px 8px 0 var(--color-alpha-shadow2)',

        shadow3:
          '0 0 2px 0 var(--color-alpha-shadow3), 0 var(--box-shadow-y-3) var(--box-shadow-blur-3) 0 var(--color-alpha-shadow3)',

        shadow4:
          '0 -5px 2px 0 var(--color-alpha-shadow2), 0 var(--box-shadow-y-4) var(--box-shadow-blur-4) 0 var(--color-alpha-shadow3)',
      },

      // 간격 정의
      spacing: {
        /* ------------------------------------------------------ */
        /* --- Premitive Spacing --- */
        /* ------------------------------------------------------ */
        'number-0': 'var(--spacing-number-0)',
        'number-1': 'var(--spacing-number-1)',
        'number-2': 'var(--spacing-number-2)',
        'number-3': 'var(--spacing-number-3)',
        'number-4': 'var(--spacing-number-4)',
        'number-5': 'var(--spacing-number-5)',
        'number-6': 'var(--spacing-number-6)',
        'number-7': 'var(--spacing-number-7)',
        'number-8': 'var(--spacing-number-8)',
        'number-9': 'var(--spacing-number-9)',
        'number-10': 'var(--spacing-number-10)',
        'number-11': 'var(--spacing-number-11)',
        'number-12': 'var(--spacing-number-12)',
        'number-13': 'var(--spacing-number-13)',
        'number-14': 'var(--spacing-number-14)',
        'number-15': 'var(--spacing-number-15)',
        'number-16': 'var(--spacing-number-16)',
        'number-17': 'var(--spacing-number-17)',
        'number-18': 'var(--spacing-number-18)',
        'number-19': 'var(--spacing-number-19)',
        'number-20': 'var(--spacing-number-20)',
        'number-21': 'var(--spacing-number-21)',
        'number-max': 'var(--spacing-number-max)',
        // -------------------------

        /* ------------------------------------------------------ */
        /* --- Semantic Spacing  --- */
        /* -- gap -- */
        'g-1': 'var(--spacing-g-1)',
        'g-2': 'var(--spacing-g-2)',
        'g-3': 'var(--spacing-g-3)',
        'g-4': 'var(--spacing-g-4)',
        'g-5': 'var(--spacing-g-5)',
        'g-6': 'var(--spacing-g-6)',
        'g-7': 'var(--spacing-g-7)',
        'g-8': 'var(--spacing-g-8)',
        'g-9': 'var(--spacing-g-9)',
        'g-10': 'var(--spacing-g-10)',

        /* -- padding -- */
        'p-1': 'var(--spacing-p-1)',
        'p-2': 'var(--spacing-p-2)',
        'p-3': 'var(--spacing-p-3)',
        'p-4': 'var(--spacing-p-4)',
        'p-5': 'var(--spacing-p-5)',
        'p-6': 'var(--spacing-p-6)',
        'p-7': 'var(--spacing-p-7)',
        'p-8': 'var(--spacing-p-8)',
        'p-9': 'var(--spacing-p-9)',
        'p-10': 'var(--spacing-p-10)',

        /* -- padding-card -- */
        'p-card-xs': 'var(--spacing-p-card-xs)',
        'p-card-s': 'var(--spacing-p-card-s)',
        'p-card-m': 'var(--spacing-p-card-m)',
        'p-card-l': 'var(--spacing-p-card-l)',
      },

      // 자간 정의
      letterSpacing: {
        'letter-spacing-0': 'var(--letter-spacing-0)',
        'letter-spacing-05': 'var(--letter-spacing-05)',
        'letter-spacing-1': 'var(--letter-spacing-1)',
      },

      // 줄 높이 정의
      lineHeight: {
        'h-heading-xxxxs': 'var(--line-height-h-heading-xxxxs)',
        'h-heading-xxxs': 'var(--line-height-h-heading-xxxs)',
        'h-heading-xxs': 'var(--line-height-h-heading-xxs)',
        'h-heading-xs': 'var(--line-height-h-heading-xs)',
        'h-heading-s': 'var(--line-height-h-heading-s)',
        'h-heading-m': 'var(--line-height-h-heading-m)',
        'h-heading-l': 'var(--line-height-h-heading-l)',
        'h-heading-xl': 'var(--line-height-h-heading-xl)',

        'h-body-xxxs': 'var(--line-height-h-body-xxxs)',
        'h-body-xxs': 'var(--line-height-h-body-xxs)',
        'h-body-xs': 'var(--line-height-h-body-xs)',
        'h-body-s': 'var(--line-height-h-body-s)',
        'h-body-m': 'var(--line-height-h-body-m)',
        'h-body-l': 'var(--line-height-h-body-l)',
        'h-body-xl': 'var(--line-height-h-body-xl)',

        'h-label-xxxs': 'var(--line-height-h-label-xxxs)',
        'h-label-xxs': 'var(--line-height-h-label-xxs)',
        'h-label-xs': 'var(--line-height-h-label-xs)',
        'h-label-s': 'var(--line-height-h-label-s)',
        'h-label-m': 'var(--line-height-h-label-m)',
        'h-label-l': 'var(--line-height-h-label-l)',
      },

      // 테두리 반경 정의
      borderRadius: {
        'radius-xs': 'var(--border-radius-xs)',
        'radius-s': 'var(--border-radius-s)',
        'radius-m': 'var(--border-radius-m)',
        'radius-l': 'var(--border-radius-l)',
        'radius-xl': 'var(--border-radius-xl)',
        'radius-max': 'var(--border-radius-max)',
      },

      // 폰트 크기 정의
      fontSize: {
        'body-xxxs': 'var(--font-size-body-xxxs)',
        'body-xxs': 'var(--font-size-body-xxs)',
        'body-xs': 'var(--font-size-body-xs)',
        'body-s': 'var(--font-size-body-s)',
        'body-m': 'var(--font-size-body-m)',
        'body-l': 'var(--font-size-body-l)',

        'display-xs': 'var(--font-size-display-xs)',
        'display-s': 'var(--font-size-display-s)',
        'display-m': 'var(--font-size-display-m)',
        'display-l': 'var(--font-size-display-l)',

        'heading-xxxxs': 'var(--font-size-heading-xxxxs)',
        'heading-xxxs': 'var(--font-size-heading-xxxs)',
        'heading-xxs': 'var(--font-size-heading-xxs)',
        'heading-xs': 'var(--font-size-heading-xs)',
        'heading-s': 'var(--font-size-heading-s)',
        'heading-m': 'var(--font-size-heading-m)',
        'heading-l': 'var(--font-size-heading-l)',
        'heading-xl': 'var(--font-size-heading-xl)',

        'label-xxs': 'var(--font-size-label-xxs)',
        'label-xs': 'var(--font-size-label-xs)',
        'label-s': 'var(--font-size-label-s)',
        'label-m': 'var(--font-size-label-m)',
        'label-l': 'var(--font-size-label-l)',
      },

      // 폰트 두께 정의
      fontWeight: {
        light: 'var(--font-weight-light)',
        regular: 'var(--font-weight-regular)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
      },

      // 폰트 패밀리 정의
      fontFamily: {
        pretThin: ['Pretendard-Thin'],
        pretExtraLight: ['Pretendard-ExtraLight'],
        pretLight: ['Pretendard-Light'],
        pretRegular: ['Pretendard-Regular'],
        pretMedium: ['Pretendard-Medium'],
        pretSemiBold: ['Pretendard-SemiBold'],
        pretBold: ['Pretendard-Bold'],
        pretExtraBold: ['Pretendard-ExtraBold'],
        pretBlack: ['Pretendard-Black'],
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities({
        // 텍스트 스타일 유틸리티 클래스
        // heading
        '.heading-xxxxs': {
          fontSize: theme('fontSize.heading-xxxxs'),
          lineHeight: theme('lineHeight.h-heading-xxxxs'),
          fontFamily: theme('fontFamily.pretSemiBold'),
          letterSpacing: theme('letterSpacing.letter-spacing-05'),
        },
        '.heading-xxxs': {
          fontSize: theme('fontSize.heading-xxxs'),
          lineHeight: theme('lineHeight.h-heading-xxxs'),
          fontFamily: theme('fontFamily.pretSemiBold'),
          letterSpacing: theme('letterSpacing.letter-spacing-05'),
        },
        '.heading-xxs': {
          fontSize: theme('fontSize.heading-xxs'),
          lineHeight: theme('lineHeight.h-heading-xxs'),
          fontFamily: theme('fontFamily.pretSemiBold'),
          letterSpacing: theme('letterSpacing.letter-spacing-05'),
        },
        '.heading-xs': {
          fontSize: theme('fontSize.heading-xs'),
          lineHeight: theme('lineHeight.h-heading-xs'),
          fontFamily: theme('fontFamily.pretSemiBold'),
          letterSpacing: theme('letterSpacing.letter-spacing-05'),
        },
        '.heading-s': {
          fontSize: theme('fontSize.heading-s'),
          lineHeight: theme('lineHeight.h-heading-s'),
          fontFamily: theme('fontFamily.pretSemiBold'),
          letterSpacing: theme('letterSpacing.letter-spacing-05'),
        },
        '.heading-m': {
          fontSize: theme('fontSize.heading-m'),
          lineHeight: theme('lineHeight.h-heading-m'),
          fontFamily: theme('fontFamily.pretSemiBold'),
          letterSpacing: theme('letterSpacing.letter-spacing-0'),
        },
        '.heading-l': {
          fontSize: theme('fontSize.heading-l'),
          lineHeight: theme('lineHeight.h-heading-l'),
          fontFamily: theme('fontFamily.pretSemiBold'),
          letterSpacing: theme('letterSpacing.letter-spacing-1'),
        },
        '.heading-xl': {
          fontSize: theme('fontSize.heading-xl'),
          lineHeight: theme('lineHeight.h-heading-xl'),
          fontFamily: theme('fontFamily.pretSemiBold'),
          letterSpacing: theme('letterSpacing.letter-spacing-1'),
        },

        // body
        '.body-xxxs': {
          fontSize: theme('fontSize.body-xxxs'),
          lineHeight: theme('lineHeight.h-body-xxxs'),
          fontFamily: theme('fontFamily.pretMedium'),
          letterSpacing: theme('letterSpacing.letter-spacing-05'),
        },
        '.body-xxs': {
          fontSize: theme('fontSize.body-xxs'),
          lineHeight: theme('lineHeight.h-body-xxs'),
          fontFamily: theme('fontFamily.pretMedium'),
          letterSpacing: theme('letterSpacing.letter-spacing-05'),
        },
        '.body-xs': {
          fontSize: theme('fontSize.body-xs'),
          lineHeight: theme('lineHeight.h-body-xs'),
          fontFamily: theme('fontFamily.pretMedium'),
          letterSpacing: theme('letterSpacing.letter-spacing-0'),
        },
        '.body-s': {
          fontSize: theme('fontSize.body-s'),
          lineHeight: theme('lineHeight.h-body-s'),
          fontFamily: theme('fontFamily.pretMedium'),
          letterSpacing: theme('letterSpacing.letter-spacing-0'),
        },
        '.body-m': {
          fontSize: theme('fontSize.body-m'),
          lineHeight: theme('lineHeight.h-body-m'),
          fontFamily: theme('fontFamily.pretMedium'),
          letterSpacing: theme('letterSpacing.letter-spacing-0'),
        },
        '.body-l': {
          fontSize: theme('fontSize.body-l'),
          lineHeight: theme('lineHeight.h-body-l'),
          fontFamily: theme('fontFamily.pretMedium'),
          letterSpacing: theme('letterSpacing.letter-spacing-0'),
        },

        // label
        '.label-xxs': {
          fontSize: theme('fontSize.label-xxs'),
          lineHeight: theme('lineHeight.h-label-xxs'),
          fontFamily: theme('fontFamily.pretRegular'),
          letterSpacing: theme('letterSpacing.letter-spacing-0'),
        },
        '.label-xs': {
          fontSize: theme('fontSize.label-xs'),
          lineHeight: theme('lineHeight.h-label-xs'),
          fontFamily: theme('fontFamily.pretRegular'),
          letterSpacing: theme('letterSpacing.letter-spacing-0'),
        },
        '.label-s': {
          fontSize: theme('fontSize.label-s'),
          lineHeight: theme('lineHeight.h-label-s'),
          fontFamily: theme('fontFamily.pretRegular'),
          letterSpacing: theme('letterSpacing.letter-spacing-0'),
        },
        '.label-m': {
          fontSize: theme('fontSize.label-m'),
          lineHeight: theme('lineHeight.h-label-m'),
          fontFamily: theme('fontFamily.pretRegular'),
          letterSpacing: theme('letterSpacing.letter-spacing-0'),
        },
        '.label-l': {
          fontSize: theme('fontSize.label-l'),
          lineHeight: theme('lineHeight.h-label-l'),
          fontFamily: theme('fontFamily.pretRegular'),
          letterSpacing: theme('letterSpacing.letter-spacing-0'),
        },
      })
    },
  ],
}
