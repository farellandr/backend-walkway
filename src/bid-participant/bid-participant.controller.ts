import { Controller, Get, Post, Body, Put, Param, Delete, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { BidParticipantService } from './bid-participant.service';
import { CreateBidParticipantDto } from './dto/create-bid-participant.dto';
import { UpdateBidParticipantDto } from './dto/update-bid-participant.dto';

@Controller('bid-participant')
export class BidParticipantController {
  constructor(private readonly bidParticipantService: BidParticipantService) {}

  @Post()
  async create(@Body() createBidParticipantDto: CreateBidParticipantDto) {
    return {
      data: await this.bidParticipantService.create(createBidParticipantDto),
      statusCode: HttpStatus.CREATED,
      massage: 'Success Added'
    }
  }

  @Get()
  async findAll() {
    const [data, count]= await this.bidParticipantService.findAll()
    return {
      data: await this.bidParticipantService.findAll(),
      statusCode: HttpStatus.OK,
      massage: 'Success'
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.bidParticipantService.findOne(id),
      statusCode: HttpStatus.OK,
      massage: 'Success'
    } 
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBidParticipantDto: UpdateBidParticipantDto) {
    return{
      data: await this.bidParticipantService.update(id, updateBidParticipantDto),
      statusCode: HttpStatus.OK,
      massage: "Success"
    } 
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      data: await this.bidParticipantService.remove(id),
      statusCode: HttpStatus.OK,
      massage: "Success Deleted"
    }
  }
}
