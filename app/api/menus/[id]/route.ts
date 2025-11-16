import { NextRequest, NextResponse } from 'next/server';
import { buildMenuUpdateData } from './helpers/buildMenuUpdateData';
import { deleteMenu } from './helpers/deleteMenu';
import { fetchMenuWithItems } from './helpers/fetchMenuWithItems';
import { formatErrorResponse } from './helpers/formatErrorResponse';
import { handleMenuError } from './helpers/handleMenuError';
import { updateMenu } from './helpers/updateMenu';
import { validateMenuId } from './helpers/validateMenuId';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;

    const validationError = validateMenuId(menuId);
    if (validationError) return validationError;

    const menu = await fetchMenuWithItems(menuId);

    return NextResponse.json({
      success: true,
      menu,
    });
  } catch (err: any) {
    if (err.status) {
      return formatErrorResponse(err);
    }
    return handleMenuError(err, 'GET');
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;
    const body = await request.json();

    const validationError = validateMenuId(menuId);
    if (validationError) return validationError;

    const updateData = buildMenuUpdateData(body);
    const updatedMenu = await updateMenu(menuId, updateData);

    return NextResponse.json({
      success: true,
      menu: updatedMenu,
      message: 'Menu updated successfully',
    });
  } catch (err: any) {
    if (err.status) {
      return formatErrorResponse(err);
    }
    return handleMenuError(err, 'PUT');
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;

    const validationError = validateMenuId(menuId);
    if (validationError) return validationError;

    await deleteMenu(menuId);

    return NextResponse.json({
      success: true,
      message: 'Menu deleted successfully',
    });
  } catch (err: any) {
    if (err.status) {
      return formatErrorResponse(err);
    }
    return handleMenuError(err, 'DELETE');
  }
}
