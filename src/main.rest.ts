import { RestApplication } from './rest/index.js';
import { RestConfig } from './shared/libs/config/index.js';
import { PinoLogger } from './shared/libs/logger/index.js';

function bootstrap() {
  const logger = new PinoLogger();
  const config = new RestConfig(logger);
  const application = new RestApplication(logger, config);
  application.init();
}

bootstrap();
