import { UsersController } from './users.controller.js';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const serviceMock = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: serviceMock }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const expected = [
        Object.assign(new User(), {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          age: 23,
        }),
      ];
      vi.spyOn(service, 'getAll').mockResolvedValue(expected);

      await expect(controller.getAllUsers()).resolves.toEqual(expected);
    });
  });

  describe('getById', () => {
    it('should return a single user, with the provided id', async () => {
      const expected = Object.assign(new User(), {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        age: 23,
      });
      const getByIdSpy = vi
        .spyOn(service, 'getById')
        .mockResolvedValue(expected);

      await expect(controller.getById('1')).resolves.toEqual(expected);
      expect(getByIdSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('createUser', () => {
    it('should pass the input fields to the service and return the created user', async () => {
      const input = {
        lastname: 'Doe',
        firstname: 'John',
        age: 23,
      };

      const expected = Object.assign(new User(), {
        id: 1,
        ...input,
      });

      const createSpy = vi
        .spyOn(service, 'create')
        .mockResolvedValue(expected);

      await expect(controller.createUser(input)).resolves.toEqual(expected);
      expect(createSpy).toHaveBeenCalledWith('Doe', 'John', 23);
    });
  });

  describe('updateUser', () => {
    it('should parse the ID, pass the input fields to the service, and return the updated user', async () => {
      const input = {
        lastname: 'John',
        firstname: 'John',
        age: 24,
      };

      const expected = Object.assign(new User(), {
        id: 1,
        ...input,
      });

      const updateSpy = vi
        .spyOn(service, 'update')
        .mockResolvedValue(expected);

      await expect(controller.updateUser('1', input)).resolves.toEqual(expected);
      expect(updateSpy).toHaveBeenCalledWith(1, 'John', 'John', 24);
    });
  });

  describe('deleteUser', () => {
    it('should parse the ID and call the service to delete the user', async () => {
      const expected = { affected: 1, raw: [] };
      const deleteSpy = vi
        .spyOn(service, 'delete')
        .mockResolvedValue(expected);

      await expect(controller.deleteUser('1')).resolves.toEqual(expected);
      expect(deleteSpy).toHaveBeenCalledWith(1);
    });
  });
});

