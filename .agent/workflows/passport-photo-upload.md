---
description: How to upload a customer passport photo
---

# Passport Photo Upload Workflow

This workflow describes how a customer (or admin acting as a customer) can upload a profile photo to their CurbOS Passport.

## Pre-requisites

1. Ensure the database migration `20260111000000_add_customer_avatar.sql` has been applied (run `npx supabase db push`).
2. Navigate to a customer's passport page (e.g., `/curbos/quests/[customer_uuid]`).

## Steps

1. **Locate Photo Area**: On the passport ID page (Left Page), identify the photo box at the top-left.
   - If no photo exists, it will show the customer's initial.
   - If a photo exists, it will show the current image.

2. **Trigger Upload**:
   - Hover over the photo area. You should see a camera icon overlay with the text "UPDATE".
   - Click anywhere on the photo box.

3. **Select File**:
   - A system file picker dialog will open.
   - Select a valid image file (`.jpg`, `.png`, `.webp`).
   - _Note: Max file size is 5MB._

4. **Upload Process**:
   - The UI will show a loading spinner while the image is uploading.
   - Behind the scenes:
     - The file is uploaded to the `customer-photos` Supabase storage bucket.
     - The `customers` table record is updated with the new public URL.

5. **Verification**:
   - Once complete, the spinner disappears.
   - The new photo immediately replaces the old one (or the placeholder).
   - The change is persisted automatically.
