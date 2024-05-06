import { RestApplication } from './rest/index.js';
import { PinoLogger } from './shared/libs/logger/index.js';

function bootstrap() {
  const logger = new PinoLogger();
  const application = new RestApplication(logger);
  application.init();
}

bootstrap();
