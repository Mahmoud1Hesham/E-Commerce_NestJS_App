import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { resolve } from 'path';




async function bootstrap() {
  const port:number|string = process.env.PORT ?? 5000;
  const app = await NestFactory.create(AppModule);
  app.use('/uploads',express.static(resolve("./uploads")))
  await app.listen(port ,()=>{
    console.log(`Server Is Running on Port ${port}`)
  } );
}
bootstrap();
