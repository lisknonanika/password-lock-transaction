import React from 'react';

const Top = React.lazy(() => import('./screen/Top'));
const NewAccount = React.lazy(() => import('./screen/NewAccount'));
const Send = React.lazy(() => import('./screen/Send'));

const routes = [
    { path: '/', exact: true, name: 'Top', component: Top },
    { path: '/new-account', exact: true, name: 'NewAccount', component: NewAccount },
    { path: '/send', exact: true, name: 'Send', component: Send },
]

export default routes;