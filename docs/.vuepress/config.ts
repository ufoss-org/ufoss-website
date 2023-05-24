import { defaultTheme, defineUserConfig } from 'vuepress'
import { searchPlugin } from '@vuepress/plugin-search'

export default defineUserConfig({
    title: 'UFOSS',
    description: "Provide softwares together with their open source code",
    markdown: {
        code: {
            lineNumbers: false
        }
    },
    plugins: [
        searchPlugin()
    ],
    theme: defaultTheme({
        logo: '/assets/img/scoupy_gris_vert.png',
        sidebar: {
            '/kotysa/': [
                {
                    text: 'Kotysa',
                    children: [
                        '/kotysa/kotysa',
                        '/kotysa/table-mapping',
                        '/kotysa/queries',
                        '/kotysa/kotysa-sqlite',
                        '/kotysa/kotysa-spring-jdbc',
                        '/kotysa/kotysa-spring-r2dbc',
                        '/kotysa/kotysa-jdbc',
                        '/kotysa/kotysa-r2dbc',
                        '/kotysa/kotysa-vertx-sqlclient',
                        '/kotysa/postgresql-textsearch'
                    ],
                }
            ],
            '/dino/': [
                {
                    text: 'Dino',
                    link: '/dino/dino',
                }
            ]
        },
    })
})
