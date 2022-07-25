export const environment = {
  production: true,
  api: {
    scheme: "http",
    host: "34.134.45.96",
    port: "8080",
    url: function () {
      return `${this.scheme}://${this.host}:${this.port}`;
    }
  }
};
