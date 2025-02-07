module.exports = {
  databaseURL: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_URL}${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority&appName=${process.env.MONGODB_APP_NAME}`,
};
