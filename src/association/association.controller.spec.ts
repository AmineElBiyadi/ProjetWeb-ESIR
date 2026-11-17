import { AssociationController } from './association.controller.js';
import { AssociationService } from './association.service.js';
import { Association } from './association.entity.js';
import { User } from '../users/user.entity.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';

describe('AssociationController', () => {
  let controller: AssociationController;
  let service: AssociationService;

  beforeEach(async () => {
    const serviceMock = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getMembers: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssociationController],
      providers: [{ provide: AssociationService, useValue: serviceMock }],
    }).compile();

    service = module.get<AssociationService>(AssociationService);
    controller = module.get<AssociationController>(AssociationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllAssociations', () => {
    it('should return all associations', async () => {
      const expected = [
        Object.assign(new Association(), { id: 1, name: 'Club', users: [] }),
      ];
      vi.spyOn(service, 'getAll').mockResolvedValue(expected);

      await expect(controller.getAllAssociations()).resolves.toEqual(expected);
    });
  });

  describe('getById', () => {
    it('should parse the ID and return the association', async () => {
      const expected = Object.assign(new Association(), {
        id: 1,
        name: 'Club',
        users: [],
      });
      const getByIdSpy = vi
        .spyOn(service, 'getById')
        .mockResolvedValue(expected);

      await expect(controller.getById('1')).resolves.toEqual(expected);
      expect(getByIdSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('createAssociation', () => {
    it('should convert user IDs to numbers and return the created association', async () => {
      const input = { name: 'Club', idUsers: [2, 3] };
      const expected = Object.assign(new Association(), {
        id: 1,
        name: input.name,
        users: [],
      });
      const createSpy = vi
        .spyOn(service, 'create')
        .mockResolvedValue(expected);

      await expect(controller.createAssociation(input)).resolves.toEqual(
        expected,
      );
      expect(createSpy).toHaveBeenCalledWith('Club', [2, 3]);
    });
  });

  describe('updateAssociation', () => {
    it('should parse the ID, convert user IDs, and return the updated association', async () => {
      const input = { name: 'Updated Club', idUsers: [4, 5] };
      const expected = Object.assign(new Association(), {
        id: 1,
        name: input.name,
        users: [],
      });
      const updateSpy = vi
        .spyOn(service, 'update')
        .mockResolvedValue(expected);

      await expect(
        controller.updateAssociation('1', input),
      ).resolves.toEqual(expected);
      expect(updateSpy).toHaveBeenCalledWith(1, 'Updated Club', [4, 5]);
    });
  });

  describe('deleteAssociation', () => {
    it('should parse the ID and return the delete result', async () => {
      const expected = { affected: 1, raw: [] };
      const deleteSpy = vi
        .spyOn(service, 'delete')
        .mockResolvedValue(expected);

      await expect(controller.deleteAssociation('1')).resolves.toEqual(
        expected,
      );
      expect(deleteSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('getMembers', () => {
    it('should parse the ID and return the association members', async () => {
      const expected = [
        Object.assign(new User(), {
          id: 2,
          firstname: 'John',
          lastname: 'Doe',
          age: 23,
        }),
      ];
      const getMembersSpy = vi
        .spyOn(service, 'getMembers')
        .mockResolvedValue(expected);

      await expect(controller.getMembers('1')).resolves.toEqual(expected);
      expect(getMembersSpy).toHaveBeenCalledWith(1);
    });
  });
});
