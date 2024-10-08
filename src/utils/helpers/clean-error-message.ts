export function cleanErrorMessage(message: string): string {
  return message
    .replace(/[\n\s]+/g, ' ')
    .replace(/"where":\s*{[^}]*"id":\s*"([^"]+)"[^}]*}/, 'id: $1')
    .replace(/\\*"/g, "'")
    .trim();
}