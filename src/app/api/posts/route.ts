import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getAllPosts,
  createPost,
} from '@/lib/blog-posts-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('all') === 'true';
    const session = await getServerSession(authOptions);

    const list = getAllPosts(!!(session && includeUnpublished));
    return NextResponse.json(list);
  } catch (error: unknown) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as { id?: string; email?: string; name?: string };
    const role = (user as { role?: string }).role;
    if (role !== 'ADMIN' && role !== 'AUTHOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, excerpt, tags, published } = body;

    const tagNames = tags
      ? Array.isArray(tags)
        ? tags
        : String(tags)
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean)
      : [];

    const author = {
      id: user.id || '1',
      username: user.name || 'User',
      email: user.email || '',
    };

    const post = createPost({
      title,
      content: content || '',
      excerpt: excerpt || null,
      tags: tagNames,
      published: published !== undefined ? published : true,
      authorId: author.id,
      author,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
