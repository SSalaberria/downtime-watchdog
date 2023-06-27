import { Payload } from '../src/auth';

export declare global {
  interface AxiosRequestConfigWithMetadata extends AxiosRequestConfig {
    metadata?: Record<string, any>;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;

      MONGODB_URI: string;

      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;
      SALT: string;

      SMTP_HOST: string;
      SMTP_USER: string;
      SMTP_PASSWORD: string;
      SMTP_FROM: string;
    }
  }

  namespace Express {
    interface Request {
      id: string;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends Payload {}
  }
}
