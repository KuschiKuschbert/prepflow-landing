
/**
 * Upload photo to server.
 *
 * @param {File} file - Photo file to upload
 * @param {string} employeeId - Employee ID
 * @returns {Promise<{url: string, path: string}>} Upload result with URL and path
 */
export async function uploadPhoto(file: File, employeeId: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('employeeId', employeeId || 'temp');

  const response = await fetch('/api/employees/upload-photo', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || 'Failed to upload photo');
  }

  return { url: data.data.url, path: data.data.path };
}

/**
 * Delete photo from server.
 *
 * @param {string} fileName - Photo filename to delete
 * @returns {Promise<void>} Resolves when deletion completes
 */
export async function deletePhoto(fileName: string) {
  await fetch(`/api/employees/upload-photo?path=${encodeURIComponent(fileName)}`, {
    method: 'DELETE',
  });
}
