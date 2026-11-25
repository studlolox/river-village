export class Mailbox {
  constructor() {
    this.letters = [];
  }

  addLetter(text) {
    this.letters.push(text);
  }

  readAll() {
    return [...this.letters];
  }
}
