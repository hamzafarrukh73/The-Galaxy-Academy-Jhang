export default defineAppConfig({
  ui: {
    header: {
      slots: {
        root: ''
      }
    },
    main: {
      base: 'min-h-0 grow grid'
    },
    footer: {
      slots: {
        root: 'grid items-center '
      }
    },
    page: {
      slots: {
        root: 'p-4 lg:p-8'
        // center: 'grow flex flex-col'
      }
    },
    // pageHeader: {
    //   slots: {
    //     root: 'mx-4 lg:mx-8'
    //   }
    // },
    pageBody: {
      base: 'p-0 m-0 py-4 lg:py-8 '
    },
    colors: {
      primary: 'blue',
      secondary: 'blue',
      neutral: 'neutral'
    }
  }
})
