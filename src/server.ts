import express, { Express, } from "express";
import swaggerUi from "swagger-ui-express";
import rootRouter from "routes";
import connectDB from "config/database";
import { applyBaseSetup } from "./baseSetup/ExpressSetup";
import initializeServices from "baseSetup/initilizeServices";
import config, { NODE_ENV } from "config";

const app: Express = express();
const attemptDatabaseConnection = async (): Promise<void> => {
  try {
    await connectDB();
    // Apply base setup after successful DB connection
    applyBaseSetup(app);
    // Initialize all services
    console.log('🚀 Initializing services...');
    await initializeServices()
    // Apply main routes
    app.use(rootRouter);

    // Start the server
    app.listen(config.PORT, () => {
      console.log(`🚀 Server is running on port ${config.PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`📘 Swagger UI available at http://localhost:${config.PORT}/api-docs`);
    });

  } catch (err) {
    console.error(`❌ Error to estab;lish server`, err);

  }
};

// Start the application
attemptDatabaseConnection();
export { app };
