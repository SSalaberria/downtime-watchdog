import { HttpService } from '@nestjs/axios';
import type { INestApplication } from '@nestjs/common';
import compression from 'compression';
import session from 'express-session';
import helmet from 'helmet';
import passport from 'passport';

export function middleware(app: INestApplication): INestApplication {
  const isProduction = process.env.NODE_ENV === 'production';

  const httpService = new HttpService();

  httpService.axiosRef.interceptors.request.use((config) => {
    (config as AxiosRequestConfigWithMetadata).metadata = { startTime: new Date() };
    return config;
  });

  httpService.axiosRef.interceptors.response.use(
    (response) => {
      const { config } = response;
      const { metadata } = config as AxiosRequestConfigWithMetadata;

      const responseTime = new Date().getTime() - metadata!['startTime'].getTime();

      return {
          ...response,
          responseTime,
        };
    },
    async (error) => {
      const { config } = error;
      const { metadata } = config as AxiosRequestConfigWithMetadata;

      const responseTime = new Date().getTime() - metadata!['startTime'].getTime();

      error.responseTime = responseTime;

      return Promise.reject(error);
    },
  );

  app.use(compression());
  app.use(
    session({
      // Requires 'store' setup for production
      secret: 'tEsTeD',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: isProduction },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  // https://github.com/graphql/graphql-playground/issues/1283#issuecomment-703631091
  // https://github.com/graphql/graphql-playground/issues/1283#issuecomment-1012913186
  app.use(
    helmet({
      contentSecurityPolicy: isProduction ? undefined : false,
      crossOriginEmbedderPolicy: isProduction ? undefined : false,
    }),
  );
  app.enableCors();

  return app;
}
