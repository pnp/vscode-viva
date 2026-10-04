const OBFUSCATION_KEY = 'spfx-toolkit-appinsights';

export const deobfuscateConnectionString = (value: string | undefined): string => {
  if (!value) {
    return '';
  }

  try {
    const input = Buffer.from(value, 'base64');
    const key = Buffer.from(OBFUSCATION_KEY, 'utf8');
    const output = Buffer.alloc(input.length);

    for (let i = 0; i < input.length; i++) {
      output[i] = input[i] ^ key[i % key.length];
    }

    return output.toString('utf8');
  } catch {
    return '';
  }
};
