import Navbar from '@/components/home/header/navbar';
import { prisma } from '../../../lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import React, { ReactNode } from 'react';

const Layout = async ({children}:{children:ReactNode}) => { //async as it is a server-side component
    
    const user = await currentUser();
    if(!user) {
        return null;
    }
    //checking if a user already exists in our db through comparing clerk id and db id
    const loggedInUser = await prisma.user.findUnique({
        where:{clerkUserId: user.id},
    });
    //if not exist, then creates a new user into the db
    if (!loggedInUser) {
        await prisma.user.create({
            data: {
                name: user.fullName as string,
                clerkUserId: user.id,
                email:user.emailAddresses[0].emailAddress,
                imageUrl:user.imageUrl
            }
        })
    }

    return (
        <div>
            <Navbar/>
            {children}
        </div>
    );
}

export default Layout;
