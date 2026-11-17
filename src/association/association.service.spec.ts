import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssociationService } from './association.service.js';
import { Association } from './association.entity.js';
import { UsersService } from '../users/users.service.js';
import { User } from '../users/user.entity.js';

describe('AssociationService', () => {
  let service: AssociationService;
  let usersService: { getById: ReturnType<typeof vi.fn> };
  let repository: {
    find: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    usersService = { getById: vi.fn() };
    repository = {
      find: vi.fn(),
      findOneBy: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssociationService,
        { provide: UsersService, useValue: usersService },
        { provide: getRepositoryToken(Association), useValue: repository },
      ],
    }).compile();

    service = module.get<AssociationService>(AssociationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all associations', async () => {
    const associations = [
      Object.assign(new Association(), { id: 1, name: 'Club', users: [] }),
    ];
    repository.find.mockResolvedValue(associations);

    await expect(service.getAll()).resolves.toEqual(associations);
    expect(repository.find).toHaveBeenCalledOnce();
  });

  it('should return an association by ID', async () => {
    const association = Object.assign(new Association(), {
      id: 1,
      name: 'Club',
      users: [],
    });
    repository.findOneBy.mockResolvedValue(association);

    await expect(service.getById(1)).resolves.toEqual(association);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw when the requested association does not exist', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.getById(99)).rejects.toMatchObject({
      status: 404,
      message: 'Association not found',
    });
  });

  it('should create an association with its existing users', async () => {
    const users = [
      Object.assign(new User(), { id: 2 }),
      Object.assign(new User(), { id: 3 }),
    ];
    const association = Object.assign(new Association(), {
      id: 1,
      name: 'Club',
      users,
    });
    usersService.getById
      .mockResolvedValueOnce(users[0])
      .mockResolvedValueOnce(users[1]);
    repository.create.mockReturnValue(association);
    repository.save.mockResolvedValue(association);

    await expect(service.create('Club', [2, 3])).resolves.toEqual(association);
    expect(usersService.getById).toHaveBeenNthCalledWith(1, 2);
    expect(usersService.getById).toHaveBeenNthCalledWith(2, 3);
    expect(repository.create).toHaveBeenCalledWith({ name: 'Club', users });
    expect(repository.save).toHaveBeenCalledWith(association);
  });

  it('should create an association without users by default', async () => {
    const association = Object.assign(new Association(), {
      id: 1,
      name: 'Club',
      users: [],
    });
    repository.create.mockReturnValue(association);
    repository.save.mockResolvedValue(association);

    await expect(service.create('Club')).resolves.toEqual(association);
    expect(usersService.getById).not.toHaveBeenCalled();
    expect(repository.create).toHaveBeenCalledWith({ name: 'Club', users: [] });
  });

  it('should update an association and its users', async () => {
    const oldUser = Object.assign(new User(), { id: 2 });
    const newUser = Object.assign(new User(), { id: 3 });
    const association = Object.assign(new Association(), {
      id: 1,
      name: 'Old name',
      users: [oldUser],
    });
    const updatedAssociation = Object.assign(new Association(), {
      id: 1,
      name: 'New name',
      users: [newUser],
    });
    repository.findOneBy.mockResolvedValue(association);
    usersService.getById.mockResolvedValue(newUser);
    repository.save.mockImplementation(
      async (savedAssociation: Association) => savedAssociation,
    );

    await expect(service.update(1, 'New name', [3])).resolves.toEqual(
      updatedAssociation,
    );
    expect(usersService.getById).toHaveBeenCalledWith(3);
    expect(repository.save).toHaveBeenCalledWith(updatedAssociation);
  });

  it('should preserve association members when updating with no user IDs', async () => {
    const user = Object.assign(new User(), { id: 2 });
    const association = Object.assign(new Association(), {
      id: 1,
      name: 'Old name',
      users: [user],
    });
    repository.findOneBy.mockResolvedValue(association);
    repository.save.mockImplementation(
      async (savedAssociation: Association) => savedAssociation,
    );

    await expect(service.update(1, 'New name', [])).resolves.toEqual({
      id: 1,
      name: 'New name',
      users: [user],
    });
    expect(usersService.getById).not.toHaveBeenCalled();
  });

  it('should throw when updating an association that does not exist', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(
      service.update(99, 'New name', [2]),
    ).rejects.toBeInstanceOf(HttpException);
    expect(usersService.getById).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should delete an existing association', async () => {
    const result = { affected: 1, raw: [] };
    repository.delete.mockResolvedValue(result);

    await expect(service.delete(1)).resolves.toEqual(result);
    expect(repository.delete).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw when deleting an association that does not exist', async () => {
    repository.delete.mockResolvedValue({ affected: 0, raw: [] });

    await expect(service.delete(99)).rejects.toMatchObject({
      status: 404,
      message: 'Association not found',
    });
  });

  it('should return the users belonging to an association', async () => {
    const users = [Object.assign(new User(), { id: 2 })];
    repository.findOneBy.mockResolvedValue(
      Object.assign(new Association(), { id: 1, name: 'Club', users }),
    );

    await expect(service.getMembers(1)).resolves.toEqual(users);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw when requesting members of a missing association', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.getMembers(99)).rejects.toMatchObject({
      status: 404,
      message: 'Association not found',
    });
  });
});
