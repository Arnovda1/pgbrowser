export const cleanFunctionSignature = (signature: string): string => {
  return signature
    .split(',')
    .map(arg => arg.trim().split(/\s+/).slice(1).join(' '))
    .join(', ');
}