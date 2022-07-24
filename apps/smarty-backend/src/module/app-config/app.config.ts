import { AppConfig } from "./app-config.interface";

export default (): AppConfig => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  host: process.env.HOST || '0.0.0.0',
});
