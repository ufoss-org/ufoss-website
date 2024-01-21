import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: "UFOSS",
  description: "Provide softwares for the JVM together with their open source code",
  head: [['link', { rel: 'icon', href: '/images/scoupy_gris_vert.png' }]],
  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    logo: '/images/scoupy_gris_vert.png',
    search: {
      provider: 'local'
    },
    outline: [2, 3],
    nav: [
      {text: 'Kotysa', link: '/kotysa/'},
    ],

    sidebar: {
      '/kotysa/': [
        {
          text: 'Kotysa',
          items: [
            {text: 'Introduction', link: '/kotysa/index'},
            {text: 'Table mapping', link: '/kotysa/table-mapping'},
            {text: 'SQL queries', link: '/kotysa/queries'},
            {text: 'Kotysa for Android', link: '/kotysa/kotysa-sqlite'},
            {text: 'Kotysa for Spring JDBC', link: '/kotysa/kotysa-spring-jdbc'},
            {text: 'Kotysa for Spring R2DBC', link: '/kotysa/kotysa-spring-r2dbc'},
            {text: 'Kotysa for JDBC', link: '/kotysa/kotysa-jdbc'},
            {text: 'Kotysa for R2DBC', link: '/kotysa/kotysa-r2dbc'},
            {text: 'Kotysa for Vertx sqlclient', link: '/kotysa/kotysa-vertx-sqlclient'},
            {text: 'PostgreSQL textsearch', link: '/kotysa/postgresql-textsearch'}
          ]
        }
      ]
    },
    socialLinks: [
      {icon: 'github', link: 'https://github.com/ufoss-org'}
    ],
    footer: {
      message: 'Released under <a href="https://github.com/ufoss-org/ufoss-website/blob/master/UNLICENSE">The Unlicense</a>.',
      copyright: 'Public domain, no Copyright 2020-present'
    }
  }
})
