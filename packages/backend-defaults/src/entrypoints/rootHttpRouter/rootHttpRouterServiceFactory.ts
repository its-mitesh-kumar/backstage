/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  RootConfigService,
  coreServices,
  createServiceFactory,
  LifecycleService,
  LoggerService,
  RootLoggerService,
  RootHealthService,
  RootLifecycleService,
  RootHttpRouterService,
} from '@backstage/backend-plugin-api';
import express, { RequestHandler, Express } from 'express';
import type { Server } from 'node:http';
import {
  createHttpServer,
  MiddlewareFactory,
  readHttpServerOptions,
} from './http';
import { DefaultRootHttpRouter } from './DefaultRootHttpRouter';
import { createHealthRouter } from './createHealthRouter';

/**
 * @public
 */
export interface RootHttpRouterConfigureContext {
  app: Express;
  server: Server;
  middleware: MiddlewareFactory;
  routes: RequestHandler;
  config: RootConfigService;
  logger: LoggerService;
  lifecycle: LifecycleService;
  healthRouter: RequestHandler;
  applyDefaults: () => void;
}

/**
 * HTTP route registration for root services.
 *
 * See {@link @backstage/code-plugin-api#RootHttpRouterService}
 * and {@link https://backstage.io/docs/backend-system/core-services/root-http-router | the service docs}
 * for more information.
 *
 * @public
 */
export type StartRootHttpServerOptions = {
  /**
   * The path to forward all unmatched requests to. Defaults to '/api/app' if
   * not given. Disables index path behavior if false is given.
   */
  indexPath?: string | false;

  configure?(context: RootHttpRouterConfigureContext): void;

  config: RootConfigService;
  logger: RootLoggerService;
  lifecycle: RootLifecycleService;
  health: RootHealthService;
};

/**
 * @deprecated Use {@link StartRootHttpServerOptions} instead.
 * @public
 */
export type RootHttpRouterFactoryOptions = StartRootHttpServerOptions;

/**
 * Creates and starts a root HTTP server with the given options.
 *
 * @public
 */
export async function startRootHttpServer(
  options: StartRootHttpServerOptions,
): Promise<RootHttpRouterService> {
  const {
    indexPath,
    configure = (ctx: RootHttpRouterConfigureContext) => ctx.applyDefaults(),
    config,
    lifecycle,
    health,
  } = options ?? {};

  const logger = options.logger.child({ service: 'rootHttpRouter' });
  const app = express();

  const router = DefaultRootHttpRouter.create({ indexPath });
  const middleware = MiddlewareFactory.create({ config, logger });
  const routes = router.handler();

  const healthRouter = createHealthRouter({ health });
  const server = await createHttpServer(
    app,
    readHttpServerOptions(config.getOptionalConfig('backend')),
    { logger },
  );

  configure({
    app,
    server,
    routes,
    middleware,
    config,
    logger,
    lifecycle,
    healthRouter,
    applyDefaults() {
      app.use(middleware.helmet());
      app.use(middleware.cors());
      app.use(middleware.compression());
      app.use(middleware.logging());
      app.use(healthRouter);
      app.use(routes);
      app.use(middleware.notFound());
      app.use(middleware.error());
    },
  });

  lifecycle.addShutdownHook(() => server.stop());

  await server.start();

  return router;
}

/**
 * @public
 */
export namespace startRootHttpServer {
  /**
   * Dependency map for `startRootHttpServer`, to be passed to the `deps` options of `createServiceFactory`.
   * @public
   */
  export const deps = {
    config: coreServices.rootConfig,
    logger: coreServices.rootLogger,
    lifecycle: coreServices.rootLifecycle,
    health: coreServices.rootHealth,
  };
}

/** @public */
export const rootHttpRouterServiceFactory = createServiceFactory(
  (options?: RootHttpRouterFactoryOptions) => ({
    service: coreServices.rootHttpRouter,
    deps: startRootHttpServer.deps,
    async factory(deps) {
      return startRootHttpServer({ ...options, ...deps });
    },
  }),
);
