import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
} from '@/lib/ecommerce-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
    const cartItems = getCart(userId);
    return NextResponse.json(cartItems);
  } catch (error: unknown) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const result = addToCart(userId, productId, quantity);
    if ('error' in result) {
      const status = result.error === 'Product not found' ? 404 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
    const body = await request.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Cart item ID and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      removeFromCart(userId, cartItemId);
      return NextResponse.json({ success: true, deleted: true });
    }

    const result = updateCartItemQuantity(userId, cartItemId, quantity);
    if ('error' in result) {
      const status =
        result.error === 'Cart item not found' || result.error === 'Unauthorized'
          ? result.error === 'Unauthorized'
            ? 403
            : 404
          : 400;
      return NextResponse.json({ error: result.error }, { status });
    }
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update quantity' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get('cartItemId');

    if (cartItemId) {
      const removed = removeFromCart(userId, cartItemId);
      if (!removed) {
        return NextResponse.json(
          { error: 'Cart item not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true });
    }

    const cart = getCart(userId);
    for (const item of cart) {
      removeFromCart(userId, item.id);
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting from cart:', error);
    return NextResponse.json(
      { error: 'Failed to delete from cart' },
      { status: 500 }
    );
  }
}
