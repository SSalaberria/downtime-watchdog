export const config = {
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nestjs-graphql-sample',
  },
};
