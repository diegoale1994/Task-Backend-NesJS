import { Test } from '@nestjs/testing';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = {
    username: 'Test User'
}

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
})

describe('TaskService', () => {

    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [TasksService, { provide: TaskRepository, useFactory: mockTaskRepository }]
        }).compile();
        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    })

    describe('getTasks', () => {
        it('get all task from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('SomeValue');
            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTaskFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'next' }
            const result = await tasksService.getTasks(filters, mockUser);
            expect(result).toEqual('SomeValue');
            expect(taskRepository.getTasks).toHaveBeenCalled();
        });
    });

});