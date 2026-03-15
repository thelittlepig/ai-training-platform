import { createResource, listResources, findResourceById, deleteResource } from '../../src/backend/models/resource.model';

// Mock database
jest.mock('../../src/backend/db', () => ({
  query: jest.fn(),
}));

import { query } from '../../src/backend/db';

describe('Resource Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a resource', async () => {
    const mockResource = {
      id: 'resource-123',
      title: 'AI Guide',
      description: 'Comprehensive AI guide',
      file_url: '/uploads/guide.pdf',
      file_type: 'pdf',
      file_size: 1024000,
      uploaded_by: 'user-123',
      is_public: true,
      created_at: new Date(),
    };

    (query as jest.Mock).mockResolvedValue({ rows: [mockResource] });

    const result = await createResource(
      'AI Guide',
      'Comprehensive AI guide',
      '/uploads/guide.pdf',
      'pdf',
      1024000,
      'user-123',
      true
    );

    expect(result).toEqual(mockResource);
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO resources'),
      ['AI Guide', 'Comprehensive AI guide', '/uploads/guide.pdf', 'pdf', 1024000, 'user-123', true]
    );
  });

  it('should list all resources', async () => {
    const mockResources = [
      { id: 'resource-1', title: 'Resource 1', is_public: true },
      { id: 'resource-2', title: 'Resource 2', is_public: false },
    ];

    (query as jest.Mock).mockResolvedValue({ rows: mockResources });

    const result = await listResources();
    expect(result).toEqual(mockResources);
  });

  it('should find resource by id', async () => {
    const mockResource = { id: 'resource-123', title: 'AI Guide' };
    (query as jest.Mock).mockResolvedValue({ rows: [mockResource] });

    const result = await findResourceById('resource-123');
    expect(result).toEqual(mockResource);
  });

  it('should delete resource', async () => {
    (query as jest.Mock).mockResolvedValue({ rowCount: 1 });

    await deleteResource('resource-123');
    expect(query).toHaveBeenCalledWith('DELETE FROM resources WHERE id = $1', ['resource-123']);
  });
});
