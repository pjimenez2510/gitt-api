export const mockDatabaseService = {
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    execute: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    query: {
      itemMaterial: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
    },
  },
  transaction: jest.fn().mockImplementation(async (callback) => {
    return await callback(mockDatabaseService.db)
  }),
}
