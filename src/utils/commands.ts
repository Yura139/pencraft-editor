export const isCommandActive = (command: string): boolean => {
  try {
    return document.queryCommandState(command);
  } catch (e) {
    return false;
  }
};

export const execCommand = (
  command: string,
  value: string | undefined = undefined
): boolean => {
  try {
    return document.execCommand(command, false, value);
  } catch (e) {
    console.error(`Error executing command ${command}:`, e);
    return false;
  }
}; 