import { CloudService } from 'src/common/multer/cloud.service';
import {  Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRepositoryService } from 'src/DB/repository/Category.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/DB/model/Category.model';
import { CategoryController } from './category.controller';
import { AuthenticationModule } from '../auth/auth.module';

@Module({
  imports: [AuthenticationModule,
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  controllers:[CategoryController],
  providers: [CategoryService, CategoryRepositoryService,CloudService                                                 ],
})
export class CategoryModule { }
