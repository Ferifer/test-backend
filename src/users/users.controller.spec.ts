import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserService = {
    create: jest.fn((dto: CreateUserDto) => {
      return {
        ...dto,
        name: dto.name.toLowerCase(),
        username: dto.username.toLowerCase(),
        email: dto.email.toLowerCase(),
        userId: randomUUID(),
        password: 'dhsa23k3x8as067sa',
      };
    }),

    updateById: jest.fn().mockImplementation((userId, dto) => ({
      userId,
      ...dto,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('must be defined', () => {
    expect(controller).toBeDefined();
  });

  it('you must create a user', async () => {
    const dto: CreateUserDto = {
      name: 'FERI',
      username: 'feri',
      email: 'hahihi@gmail.com',
      password: '1234',
    };
    const created: User = await controller.create(dto);
    expect(created).toEqual({
      userId: expect.any(String),
      name: dto.name.toLowerCase(),
      username: dto.username.toLowerCase(),
      email: dto.email.toLowerCase(),
      password: expect.any(String),
    });

    expect(mockUserService.create).toHaveBeenCalled();
    expect(mockUserService.create).toHaveBeenCalledWith(dto);
  });

  it('debe actualizar un usuario', async () => {
    const dto: UpdateUserDto = {
      name: 'HAHO',
    };
    const userId = 'abc';
    const updated: User = await controller.update({ userId }, dto);
    expect(updated).toEqual({
      userId,
      ...dto,
    });

    expect(mockUserService.updateById).toHaveBeenCalled();
  });
});
