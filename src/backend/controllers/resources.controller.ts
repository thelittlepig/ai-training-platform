import { Request, Response } from 'express';
import { createResource, listResources, findResourceById, deleteResource } from '../models/resource.model';

export const createResourceHandler = async (req: Request, res: Response) => {
  try {
    const { title, description, file_url, file_type, file_size, is_public } = req.body;
    const uploadedBy = (req as any).user.id;

    if (!title || !file_url || !file_type || !file_size) {
      return res.status(400).json({
        code: 400,
        message: 'Missing required fields',
        data: null,
      });
    }

    const resource = await createResource(
      title,
      description || '',
      file_url,
      file_type,
      file_size,
      uploadedBy,
      is_public || false
    );

    return res.status(201).json({
      code: 201,
      message: 'Resource created',
      data: resource,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const listResourcesHandler = async (req: Request, res: Response) => {
  try {
    const resources = await listResources();

    return res.json({
      code: 200,
      message: 'OK',
      data: resources,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const getResourceHandler = async (req: Request, res: Response) => {
  try {
    const resource = await findResourceById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        code: 404,
        message: 'Resource not found',
        data: null,
      });
    }

    return res.json({
      code: 200,
      message: 'OK',
      data: resource,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const deleteResourceHandler = async (req: Request, res: Response) => {
  try {
    await deleteResource(req.params.id);

    return res.json({
      code: 200,
      message: 'Resource deleted',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const downloadResourceHandler = async (req: Request, res: Response) => {
  try {
    const resource = await findResourceById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        code: 404,
        message: 'Resource not found',
        data: null,
      });
    }

    // 实际实现中应该返回文件流
    return res.json({
      code: 200,
      message: 'Download URL',
      data: { download_url: resource.file_url },
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};
