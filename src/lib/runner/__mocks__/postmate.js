const mock = {
  on: () => {},
};

export default class PostMateMock {
  constructor() {
    return Promise.resolve(mock);
  }
}
