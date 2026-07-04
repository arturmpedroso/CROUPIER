import { Controller, Post, Get, Body, Request, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('groups')
@UseGuards(AuthGuard) // Protecao
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  // POST http://localhost:3000/groups 
  @Post()
  async create(@Request() req: any, @Body() body: { name: string; description?: string; isPrivate?: boolean }) {
    // O id vem protegido
    return this.groupsService.create(req.user.sub, body);
  }

  // GET http://localhost:3000/groups 
  @Get()
  async findAll(@Request() req: any) {
    return this.groupsService.findAllAccessible(req.user.sub);
  }

  // POST http://localhost:3000/groups/:id/share 
  @Post(':id/share')
  async share(
    @Request() req: any,
    @Param('id', ParseIntPipe) groupId: number,
    @Body() body: { targetUsername: string; canEdit: boolean }
  ) {
    return this.groupsService.shareGroup(req.user.sub, groupId, body.targetUsername, body.canEdit);
  }
}