import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto);
    }

    async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {

        return this.taskRepository.createTask(createTaskDto);

    }

    async getTaskById(id: number): Promise<Task> {

        const found = await this.taskRepository.findOne(id);
        if (!found) {
            throw new NotFoundException(`Task with id ${id} not found!`);
        }
        return found;

    }

    async deleteTaskById(id: number): Promise<void> {

        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with id ${id} not found!`);
        }

    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {

        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;

    }

    /* getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTaskFilterDto) {
        const { status, search } = filterDto;
        let tasks = this.getAllTasks();
        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }
        if (search) {
            tasks = tasks.filter(task =>
                task.title.includes(search) || task.description.includes(search)
            )
        }

        return tasks;
    }

    getTaskById(id: string): Task {
        const found = this.tasks.find(task => task.id === id);
        if (!found) {
            throw new NotFoundException(`Task with id ${id} not found!`);
        }
        return found;
    }

    deleteTaskById(id: string): void {
        const found = this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task.id !== found.id);
    }

    updateTaskById(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }

    createTask(createTaskDto: CreateTaskDTO): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            title,
            description,
            status: TaskStatus.OPEN,
            id: uuid()
        }
        this.tasks = [...this.tasks, task];
        return task;
    }  */

}
