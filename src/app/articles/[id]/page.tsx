import { prisma } from '@/lib/prisma';
import React from 'react';
import ArticleDetailPage from '../../dashboard/articles/article-detail-page';
import Navbar from '@/components/home/header/navbar';

type ArticleDetailPageProps = {
    params: Promise<{id:string}>
}

const page : React.FC<ArticleDetailPageProps> = async ({params}) => {
    const id = (await params).id;
    const article = await prisma.article.findUnique({
        where: {id},
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    imageUrl: true,
                },
            },
        },
    });
    if (!article) {
        return <h1> Article not found! </h1>
    }
    return (
        <div>
            <Navbar/>
            <ArticleDetailPage article={article}/>
        </div>
    );
}

export default page;
