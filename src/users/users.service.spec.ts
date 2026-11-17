import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersService } from './users.service.js';
import { User } from './user.entity.js';

describe('UsersService', () => {
  let service: UsersService;
  let repository: {
    find: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    repository = {
      find: vi.fn(),
      findOneBy: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const users = [Object.assign(new User(), { id: 1 })];
    repository.find.mockResolvedValue(users);

    await expect(service.getAll()).resolves.toEqual(users);
    expect(repository.find).toHaveBeenCalledOnce();
  });

  it('should return a user by ID', async () => {
    const user = Object.assign(new User(), { id: 1 });
    repository.findOneBy.mockResolvedValue(user);

    await expect(service.getById(1)).resolves.toEqual(user);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw when the requested user does not exist', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.getById(99)).rejects.toMatchObject({
      status: 404,
      message: 'User not found',
    });
  });

  it('should create and save a user', async () => {
    const user = Object.assign(new User(), {
      id: 1,
      lastname: 'Doe',
      firstname: 'John',
      age: 23,
    });
    repository.create.mockReturnValue(user);
    repository.save.mockResolvedValue(user);

    await expect(service.create('Doe', 'John', 23)).resolves.toEqual(user);
    expect(repository.create).toHaveBeenCalledWith({
      lastname: 'Doe',
      firstname: 'John',
      age: 23,
    });
    expect(repository.save).toHaveBeenCalledWith(user);
  });

  it('should update and save an existing user', async () => {
    const user = Object.assign(new User(), {
      id: 1,
      lastname: 'Doe',
      firstname: 'John',
      age: 23,
    });
    const updatedUser = Object.assign(new User(), {
      id: 1,
      lastname: 'Smith',
      firstname: 'Jane',
      age: 24,
    });
    repository.findOneBy.mockResolvedValue(user);
    repository.save.mockImplementation(async (savedUser: User) => savedUser);

    await expect(service.update(1, 'Smith', 'Jane', 24)).resolves.toEqual(
      updatedUser,
    );
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repository.save).toHaveBeenCalledWith(updatedUser);
  });

  it('should throw when updating a user that does not exist', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.update(99, 'Smith', 'Jane', 24)).rejects.toBeInstanceOf(
      HttpException,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should delete an existing user', async () => {
    const result = { affected: 1, raw: [] };
    repository.delete.mockResolvedValue(result);

    await expect(service.delete(1)).resolves.toEqual(result);
    expect(repository.delete).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw when deleting a user that does not exist', async () => {
    repository.delete.mockResolvedValue({ affected: 0, raw: [] });

    await expect(service.delete(99)).rejects.toMatchObject({
      status: 404,
      message: 'User not found',
    });
  });
});
