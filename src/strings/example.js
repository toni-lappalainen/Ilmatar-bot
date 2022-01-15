// strings are template strings, add needed parameters.
// in this example we only need the user whom the message is directed at.

export default (member) => {
  return `Welcome, ${member}!
    Hope you enjoy your stay. Please read the server rules carefully.`;
};
