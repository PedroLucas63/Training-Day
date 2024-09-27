import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Get hello message' })
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
