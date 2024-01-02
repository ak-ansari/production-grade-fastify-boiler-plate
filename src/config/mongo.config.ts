export const MONGO_CONFIG = {
 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000, // Wait for server selection for 5 seconds
  socketTimeoutMS: 45000, // Socket close after 45 seconds of inactivity
};
