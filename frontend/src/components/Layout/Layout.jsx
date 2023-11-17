import React from 'react'

import Header from '../Header/header';
import Routers from '../../router/Routers';
import Footer from '../Footer/footer';

const Layout = () => {
    return (
        <>
            <Header />
            <Routers />
            <Footer />
        </>
    );
};

export default Layout;