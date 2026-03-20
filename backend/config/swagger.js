const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Travel Booking API",
      version: "1.0.0",
      description:
        "API documentation for the Travel Booking platform – covering Custom Tours, Employee, Favourites, Guide, Hotels and Manager routes.",
    },
    servers: [
      {
        url: "http://localhost:5500",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT token stored in an HTTP-only cookie",
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
