/**
 * Build update data object from request body
 */
export function buildUpdateData(body: any): unknown {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.is_active !== undefined) updateData.is_active = body.is_active;

  return updateData;
}
