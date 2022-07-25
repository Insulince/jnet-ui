export const environment = {
  production: false,
  api: {
    scheme: "http",
    host: "localhost",
    port: "8080",
    url: function () {
      return `${this.scheme}://${this.host}:${this.port}`;
    }
  }
};
