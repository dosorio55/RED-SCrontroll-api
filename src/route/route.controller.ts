import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { RouteService } from './route.service';
import RouteRequestDto from './dto/route-request.dto';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  post(@Body() body: RouteRequestDto): number[][] {
    return this.routeService.post(body);
  }
}
