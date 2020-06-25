import React from 'react';

const Top = React.lazy(() => import('./screen/Top'));
const NewAccount = React.lazy(() => import('./screen/NewAccount'));

const routes = [
    { path: '/', exact: true, name: 'Top', component: Top },
    { path: '/new-account', exact: true, name: 'NewAccount', component: NewAccount },
]

export default routes;