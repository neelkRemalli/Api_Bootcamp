const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'DevCamper API',
    version: '1.0.0',
    description: 'DevCamper Bootcamp Directory and Course Management Backend REST API',
    contact: {
      name: 'DevCamper Support',
      email: 'support@devcamper.io',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer <token>',
      },
    },
    schemas: {
      Bootcamp: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '5d713995b721c3bb38c1f5d0' },
          name: { type: 'string', example: 'Devworks Bootcamp' },
          slug: { type: 'string', example: 'devworks-bootcamp' },
          description: { type: 'string', example: 'Full stack JavaScript bootcamp in Boston' },
          website: { type: 'string', example: 'https://devworks.com' },
          phone: { type: 'string', example: '(111) 111-1111' },
          email: { type: 'string', example: 'enroll@devworks.com' },
          address: { type: 'string', example: '233 Bay State Rd Boston MA 02215' },
          careers: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['Web Development', 'Mobile Development', 'UI/UX', 'Data Science', 'Business', 'Other'],
            },
            example: ['Web Development', 'UI/UX'],
          },
          housing: { type: 'boolean', example: true },
          jobAssistance: { type: 'boolean', example: true },
          jobGuarantee: { type: 'boolean', example: false },
          acceptGi: { type: 'boolean', example: true },
          averageCost: { type: 'number', example: 10000 },
          averageRating: { type: 'number', example: 8 },
          photo: { type: 'string', example: 'no-photo.jpg' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Course: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '5d725a4a7b292f5f8ceff789' },
          title: { type: 'string', example: 'Front End Web Development' },
          description: { type: 'string', example: 'Learn modern frontend technologies' },
          weeks: { type: 'string', example: '8' },
          tuition: { type: 'number', example: 8000 },
          minimumSkill: {
            type: 'string',
            enum: ['beginner', 'intermediate', 'advanced'],
            example: 'beginner',
          },
          scholarshipAvailable: { type: 'boolean', example: true },
          bootcamp: { type: 'string', example: '5d713995b721c3bb38c1f5d0' },
          user: { type: 'string', example: '5d7a514b5d2c12c7449be045' },
        },
      },
      Review: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '5d7a514b5d2c12c7449be020' },
          title: { type: 'string', example: 'Learned a ton!' },
          text: { type: 'string', example: 'The instructors were fantastic and helped with interview prep.' },
          rating: { type: 'number', minimum: 1, maximum: 10, example: 9 },
          bootcamp: { type: 'string', example: '5d713995b721c3bb38c1f5d0' },
          user: { type: 'string', example: '5d7a514b5d2c12c7449be044' },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '5d7a514b5d2c12c7449be044' },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          role: { type: 'string', enum: ['user', 'publisher', 'admin'], example: 'user' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Resource not found' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'User authentication & profile management' },
    { name: 'Bootcamps', description: 'Bootcamp directory and discovery' },
    { name: 'Courses', description: 'Courses offered by bootcamps' },
    { name: 'Reviews', description: 'Student ratings & reviews' },
    { name: 'Users', description: 'User management (Admin)' },
  ],
};

const routesPath = path.join(__dirname, '../routes/*.js').split(path.sep).join('/');

const options = {
  swaggerDefinition,
  apis: [routesPath, './routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
