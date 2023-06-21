export const config = {
  db: {
    uri: process.env.MONGODB_URI,
  },
  graphql: {
    debug: false,
    playground: false,
  },
};
