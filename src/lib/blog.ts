import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export type BlogPost = {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    author: string;
    category: string;
    image: string;
    content: string;
};

export async function getSortedPostsData() {
    // Ensure directory exists
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.mdx'))
        .map((fileName) => {
            const slug = fileName.replace(/\.mdx$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                slug,
                ...data,
            };
        });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (allPostsData as any).sort((a: any, b: any) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        content,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(data as any),
    };
}
