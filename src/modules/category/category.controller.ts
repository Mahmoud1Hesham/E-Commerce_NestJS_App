import { Body, Get, Param, Patch, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { roleTypes, UserDocument } from 'src/DB/model/User.model';
import { User } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { localMulterOptions, validationFile } from 'src/common/multer/local.multer.options';
import { CloudMulterOptions } from 'src/common/multer/cloud.multer.options';
import { CreateCategoryDTO } from './dto/create.dto';
import { MulterValidationInterceptor } from 'src/common/multer/multer-validation/multer-validation.interceptor';
import {  CategoryIdDTO, CategoryQueryFilterDTO, updateCategoryDTO } from './dto/update.dto';
@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }



  // @UseInterceptors(FileInterceptor('file',localMulterOptions({
  //   path:'category',
  //   validation:validationFile.image,
  //   filesize:1024 *1024
  // })))
  @UseInterceptors(
    FileInterceptor('file',
      CloudMulterOptions({
        validation: validationFile.image,
        filesize: 1024 * 1024
      }
      )
    ),
    MulterValidationInterceptor
  )
  @Auth([roleTypes.User])
  @Post('create')
  create(@User() user: UserDocument, @Body() Body: CreateCategoryDTO, @UploadedFile() file: Express.Multer.File) {
    console.log('controller')
    return this.categoryService.create(user, Body, file)
  }


  @UseInterceptors(
    FileInterceptor('file',
      CloudMulterOptions({
        validation: validationFile.image,
        filesize: 1024 * 1024
      }
      )
    ),
    // MulterValidationInterceptor
  )

  @Auth([roleTypes.User])
  @Patch(':categoryId')
  update(@User() user: UserDocument,
    @Param() params: CategoryIdDTO,
    @Body() body?: updateCategoryDTO,
    @UploadedFile() file?: Express.Multer.File) {
    console.log('controllerupdate')
    return this.categoryService.update(params.categoryId, body, file)

  }


  @Get()
  find(@Query() query: CategoryQueryFilterDTO) {
    return this.categoryService.find(query)
  }

  @Get(':categoryId')
  findOne(
    @Param() params: CategoryIdDTO,
  ) {
    return this.categoryService.findOne(params.categoryId)

  }
}



