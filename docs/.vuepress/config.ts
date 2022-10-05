import {defineUserConfig} from 'vuepress'
import {defaultTheme} from '@vuepress/theme-default'
import { searchPlugin } from '@vuepress/plugin-search'

export default defineUserConfig({
    title: 'UFOSS',
    description: "Provide softwares together with their source code in public domain",
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
                        {
                            text: 'Introduction',
                            link: '/kotysa/kotysa'
                        },
                        {
                            text: 'Table mapping',
                            link: '/kotysa/table-mapping'
                        },
                        {
                            text: 'SQL queries',
                            link: '/kotysa/queries'
                        },
                        {
                            text: 'Kotysa for Android',
                            link: '/kotysa/kotysa-android'
                        },
                        {
                            text: 'Kotysa for Spring JDBC',
                            link: '/kotysa/kotysa-spring-jdbc'
                        },
                        {
                            text: 'Kotysa for Spring R2DBC',
                            link: '/kotysa/kotysa-spring-r2dbc'
                        },
                        {
                            text: 'Kotysa for JDBC',
                            link: '/kotysa/kotysa-jdbc'
                        },
                        {
                            text: 'Kotysa for R2DBC',
                            link: '/kotysa/kotysa-r2dbc'
                        }
                        ,
                        {
                            text: 'Kotysa for Vertx Sqlclient',
                            link: '/kotysa/kotysa-vertx-sqlclient'
                        }
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
