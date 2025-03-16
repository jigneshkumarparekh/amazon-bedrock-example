/**
 * Function which will print the given text w/ typewriter effect.
 * @param {string} text: Text to be printed on the console w/ typewriter effect.
 */
export async function typeWriter(text) {
  return new Promise((resolve) => {
    text = text + "\n"; // Add a new line character at the end to flush the buffer out.
    let index = 0;
    const interval = setInterval(() => {
      if (index >= text.length) {
        clearInterval(interval);
        resolve("");
      }

      typeOnConsole(text.charAt(index));
      index++;
    }, 25);
  });
}

function typeOnConsole(char) {
  process.stdout.write(char);
}
