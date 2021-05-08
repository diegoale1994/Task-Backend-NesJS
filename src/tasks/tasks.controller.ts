import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDTO): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.tasksService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    patchTaskStatus(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status);
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
