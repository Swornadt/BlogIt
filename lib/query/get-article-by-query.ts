import { prisma } from "../prisma";

export const getArticleByQuery = async (
  searchText: string,
  skip: number,
  take: number
) => {
  const [article, total] = await prisma.$transaction([
    prisma.article.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchText,
              mode: "insensitive",
            },
          },
          {
            category: {
              contains: searchText,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
      skip:skip,
      take:take
    }),
    prisma.article.count({
        where:{
            OR: [
                {
                    title: {
                        contains: searchText, mode:'insensitive'
                    },
                    category: {
                        contains: searchText, mode:'insensitive'
                    }
                }
            ]
        }
    })
  ]);


  return {article,total};
};
