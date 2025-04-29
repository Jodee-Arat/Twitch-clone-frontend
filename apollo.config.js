require("dotenv/config");

module.exports = {
  client: {
    service: {
      name: "my-graphql-api",
      url: process.env.NEXT_PUBLIC_SERVER_URL,
      skipSSLValidation: true,
    },
    includes: ["src/**/*.graphql"],
  },
};
