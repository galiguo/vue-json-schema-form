
const routes = [
    {
        path: '/index',
        name: 'demo',
        meta: {
            title: 'Demo'
        },
        component: () => import('./views/Demo/index'),
    },
    {
        path: '*',
        hidden: true,
        redirect: {
            name: 'demo',
            query: {
                type: 'Simple'
            }
        }
    }
];

export default routes;
