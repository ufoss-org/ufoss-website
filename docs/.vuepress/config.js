module.exports = {
    title: 'UFOSS',
    description: "UFOSS public website",
    evergreen: true,
    themeConfig:{
        editLinks: true,
        sidebar: {
            '/': [
                {
                    title: 'Dino',
                    collapsable: false,
                    children: ['/dino/introduction'],
                },
            ],
        },
    }
}
