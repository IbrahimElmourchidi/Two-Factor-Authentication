import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

import { AppModule } from './app.module';
import { from } from 'rxjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieSession({
    keys:['secret']
  }))
  const port = process.env.PORT || 5000;
  await app.listen(port, () => console.log(`listening on port ${port}`));
}
bootstrap();
