module.exports = {
    title: 'UFOSS',
    description: "Provide softwares together with their source code in public domain",
    themeConfig: {
        logo: '/assets/img/scoupy_gris_vert.png',
        sidebar: {
            '/': [
                '/projects',
                {
                    title: 'Kotysa',
                    children: [
                        ['/kotysa/kotysa', 'Introduction'],
                        ['/kotysa/table-mapping', 'Table mapping'],
                        ['/kotysa/queries', 'SQL queries'],
                        ['/kotysa/kotysa-android', 'Kotysa for Android'],
                        ['/kotysa/kotysa-spring-jdbc', 'Kotysa for Spring JDBC'],
                        ['/kotysa/kotysa-spring-r2dbc', 'Kotysa for Spring R2DBC'],
                        ['/kotysa/kotysa-jdbc', 'Kotysa for JDBC'],
                        ['/kotysa/kotysa-r2dbc', 'Kotysa for R2DBC'],
                    ],
                },
                {
                    title: 'Dino',
                    path: '/dino/dino',
                },
            ],
        },
    }
}
