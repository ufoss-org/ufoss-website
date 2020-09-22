module.exports = {
    title: 'UFOSS',
    description: "Provide softwares together with their source code in public domain",
    themeConfig: {
        sidebar: {
            '/': [
                '/projects',
                {
                    title: 'Dino',
                    path: '/dino/dino',
                },
                {
                    title: 'Kotysa',
                    path: '/kotysa/kotysa',
                    collapsable: false,
                    children: [
                        '/kotysa/queries',
                    ],
                },
            ],
        },
    }
}
