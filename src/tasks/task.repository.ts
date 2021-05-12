import { InternalServerErrorException, Logger } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    private logger = new Logger('TasksController');

    async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {

        const { title, description } = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        try {
            await task.save();
        } catch (error) {
            this.logger.error('Failed to create task for user ' + user.username, error.stack);
            throw new InternalServerErrorException();
        }

        delete task.user;
        return task;

    }

    async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        query.where('task.userId = :userId', { userId: user.id });
        if (status) {
            query.andWhere('task.status = :status', { status })
        }
        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` })
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error('Failed to get all task for user ' + user.username, error.stack);
            throw new InternalServerErrorException();
        }

    }

}