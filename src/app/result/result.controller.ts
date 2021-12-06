import { Controller, Get, Param } from '@nestjs/common';
import { ResultService } from './result.service';

@Controller('result')
export class ResultController {

    constructor(private resultService: ResultService) { }

    @Get(':id')
    async getResult(@Param('id') id: string) {
        return await this.resultService.getResult(+id);
    }

    @Get('questionnaire/all')
    async getQuestionnaire() {
        return await this.resultService.getQuestionnaire();
    }

    @Get('chart/:id')
    async getChart(@Param('id') id: string) {
        return await this.resultService.getChart(+id);
    }


}