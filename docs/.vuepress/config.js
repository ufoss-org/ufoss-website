module.exports = {
    title: 'UFOSS',
    description: "Provide softwares together with their source code in public domain",
    themeConfig: {
        logo: '/assets/img/scoupy_gris_vert.png',
        sidebar: {
            '/': [
                '/projects',
                {
                    title: 'Dino',
                    path: '/dino/dino',
                },
                {
                    title: 'Kotysa',
                    children: [
                        ['/kotysa/kotysa', 'Introduction'],
                        ['/kotysa/table-mapping', 'Table mapping'],
                        ['/kotysa/queries', 'SQL queries'],
                        ['/kotysa/kotysa-android', 'Kotysa for Android'],
                        ['/kotysa/kotysa-spring-r2dbc', 'Kotysa for Spring R2DBC'],
                        ['/kotysa/kotysa-spring-jdbc', 'Kotysa for Spring JDBC'],
                    ],
                },
            ],
        },
    }
}
