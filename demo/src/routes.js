import React from 'react';

const Top = React.lazy(() => import('./screen/Top'));

const routes = [
    { path: '/', exact: true, name: 'Top', component: Top },
]

export default routes;