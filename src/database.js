module.exports = {
  databaseURL: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.jfcxb2f.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`,
};
