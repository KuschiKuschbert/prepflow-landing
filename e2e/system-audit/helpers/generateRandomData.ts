/**
 * Generate random valid data for form inputs.
 */
export function generateRandomData(inputType: string, fieldName: string): string {
  const lowerName = fieldName.toLowerCase();

  // Email fields
  if (lowerName.includes('email')) {
    return `test${Math.random().toString(36).substring(7)}@example.com`;
  }

  // Phone fields
  if (lowerName.includes('phone') || lowerName.includes('mobile')) {
    return `04${Math.floor(Math.random() * 90000000) + 10000000}`;
  }

  // Number fields
  if (inputType === 'number') {
    if (lowerName.includes('price') || lowerName.includes('cost')) {
      return (Math.random() * 100 + 1).toFixed(2);
    }
    if (lowerName.includes('quantity') || lowerName.includes('amount')) {
      return Math.floor(Math.random() * 100 + 1).toString();
    }
    if (lowerName.includes('percentage') || lowerName.includes('percent')) {
      return (Math.random() * 100).toFixed(1);
    }
    return Math.floor(Math.random() * 1000 + 1).toString();
  }

  // Date fields
  if (inputType === 'date') {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));
    return date.toISOString().split('T')[0];
  }

  // Text fields
  const words = ['Test', 'Sample', 'Demo', 'Example', 'Random', 'Data', 'Value'];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const randomNum = Math.floor(Math.random() * 1000);

  if (lowerName.includes('name') || lowerName.includes('title')) {
    return `${randomWord} ${randomNum}`;
  }

  if (lowerName.includes('description') || lowerName.includes('notes')) {
    return `${randomWord} description ${randomNum}. This is a test entry.`;
  }

  return `${randomWord}_${randomNum}`;
}



