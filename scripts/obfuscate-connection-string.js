const readline = require('readline');

const OBFUSCATION_KEY = 'spfx-toolkit-appinsights';

function obfuscate(value) {
  const input = Buffer.from(value, 'utf8');
  const key = Buffer.from(OBFUSCATION_KEY, 'utf8');
  const output = Buffer.alloc(input.length);

  for (let i = 0; i < input.length; i++) {
    output[i] = input[i] ^ key[i % key.length];
  }

  return output.toString('base64');
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Application Insights connection string: ', (answer) => {
  rl.close();

  const connectionString = answer.trim();

  if (!connectionString) {
    console.error('No connection string provided.');
    process.exitCode = 1;
    return;
  }

  console.log('\nObfuscated value (store it in the APP_INSIGHTS secret):\n');
  console.log(obfuscate(connectionString));
});
