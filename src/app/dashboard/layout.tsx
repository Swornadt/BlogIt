import React from 'react';
import LeftSidebar from '../../../components/dashboard/left-sidebar';

const Layout = ({children}:{children:React.ReactNode}) => {
    return (
        <div className='min-h-screen w-full'>
            <div className='flex'>
                <LeftSidebar/>
                <div className='flex-1'>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Layout;
