import { AppConfig } from "./app-config.interface";

export default (): AppConfig => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  host: process.env.HOST || '127.0.0.1',
});
