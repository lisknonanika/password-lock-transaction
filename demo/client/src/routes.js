import React from 'react';

const Top = React.lazy(() => import('./screen/Top'));
const NewAccount = React.lazy(() => import('./screen/NewAccount'));
const Send = React.lazy(() => import('./screen/Send'));
const Receive = React.lazy(() => import('./screen/Receive'));

const routes = [
    { path: '/', exact: true, name: 'Top', component: Top },
    { path: '/new-account/:id', exact: true, name: 'NewAccount', component: NewAccount },
    { path: '/new-account', exact: true, name: 'NewAccount', component: NewAccount },
    { path: '/send', exact: true, name: 'Send', component: Send },
    { path: '/receive/:id', exact: true, name: 'Receive', component: Receive },
    { path: '/receive', exact: true, name: 'Receive', component: Receive },
]

export default routes;