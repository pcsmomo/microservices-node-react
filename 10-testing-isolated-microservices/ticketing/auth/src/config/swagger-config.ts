import swaggerJsdoc from 'swagger-jsdoc';

// swagger option
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ticketing.dev API with Swagger',
      version: '0.1.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Noah Kim',
        url: 'https://github.com/pcsmomo',
        email: 'pcsmomo@gmail.com',
      },
    },
    servers: [
      {
        url: 'https://ticketing.dev/auth',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerJsDocSpecs = swaggerJsdoc(options);

export const swaggerUiOptions = {
  // explorer: true,
  // swaggerOptions: {
  //   url: 'http://petstore.swagger.io/v2/swagger.json',
  // },
};
