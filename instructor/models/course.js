export class Course {
  constructor(message, method) {
    this.id = message.id;
    this.name = message.name;
    this.method = method;
  }
}
