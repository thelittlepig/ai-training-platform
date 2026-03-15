import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';
import { Course } from '../../shared/types';

export const useCourses = (status?: string) => {
  return useQuery({
    queryKey: ['courses', status],
    queryFn: async () => {
      const endpoint = status ? `/courses?status=${status}` : '/courses';
      const response = await api.get<Course[]>(endpoint);
      return response.data;
    },
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await api.get<Course>(`/courses/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
