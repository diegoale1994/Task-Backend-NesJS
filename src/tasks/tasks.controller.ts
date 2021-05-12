import { Body, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    private logger = new Logger('TasksController');

    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTaskFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        this.logger.verbose(`User ${user.username} retriving tasks. Filters: ${JSON.stringify(filterDto)}`);
        return this.tasksService.getTasks(filterDto, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDTO,
        @GetUser() user: User
    ): Promise<Task> {
        this.logger.verbose(`User ${user.username} creating task. Filters: ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.tasksService.deleteTaskById(id, user);
    }

    @Patch('/:id/status')
    patchTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user);
    }

    /*   @Get()
      getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Task[] {
          if (Object.keys(filterDto).length) {
              return this.tasksService.getTasksWithFilters(filterDto);
          } else {
              return this.tasksService.getAllTasks();
          }
  
      }
  
      @Post()
      @UsePipes(ValidationPipe)
      createTask(@Body() createTaskDto: CreateTaskDTO) {
          return this.tasksService.createTask(createTaskDto);
      }
  
      @Get('/:id')
      getTaskById(@Param('id') id: string): Task {
          return this.tasksService.getTaskById(id);
      }
  
      @Delete('/:id')
      deleteTaskById(@Param('id') id: string): void {
          this.tasksService.deleteTaskById(id);
      }
  
      @Patch('/:id/status')
      patchTaskStatus(@Param('id') id: string, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Task {
          return this.tasksService.updateTaskById(id, status);
      } */

}
