/**
 * Function which will print the given text w/ typewriter effect.
 * @param {string} text: Text to be printed on the console w/ typewriter effect.
 */
export function typeWriter(text) {
  text = text + "\n"; // Add a new line character at the end to flush the buffer out.
  let index = 0;
  const interval = setInterval(() => {
    if (index >= text.length) {
      clearInterval(interval);
      return;
    }

    typeOnConsole(text.charAt(index));
    index++;
  }, 50);
}

function typeOnConsole(char) {
  process.stdout.write(char);
}
