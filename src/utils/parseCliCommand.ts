export const parseCliCommand = (input: string) => {
  const commandRegex = /^([^\s-]+(?:\s+[^\s-]+)*)/;
  const optionRegex = /--?(\w+)\s+(['"][^'"]+['"]|\S+)/g;

  const commandMatch = input.match(commandRegex);
  const command = commandMatch ? commandMatch[0] : '';

  const options: { [key: string]: string } = {};
  let match;
  while ((match = optionRegex.exec(input)) !== null) {
    const key = match[1];
    const value = match[2].replace(/"/g, '').replace(/'/g, '');
    options[key] = value;
  }

  return { command, options };
};