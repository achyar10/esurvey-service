import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../utilities/guards/jwt-guard.guard';
import { QueryUserDto, CreateUserDto, UpdateuserDto } from './user.dto';
import { UserService } from './user.service';
import { ICredential } from '../../interfaces/credential';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get()
    findAll(@Query() query: QueryUserDto) {
        return this.userService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateUserDto, @Req() credential: ICredential) {
        return await this.userService.create(dto, credential)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateuserDto, @Req() credential: ICredential) {
        return await this.userService.update(+id, dto, credential)
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() credential: ICredential) {
        return await this.userService.delete(+id, credential)
    }

}
