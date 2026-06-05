export const cleanFunctionSignature = (signature: string): string => {
  return signature
    .split(',')
    .map(arg => arg.trim().split(/\s+/).slice(1).join(' '))
    .join(', ');
}

export const oneLine = (str: string): string => {
  return str.split('\n').map(l => l.trim()).filter(Boolean).join(' ');
}