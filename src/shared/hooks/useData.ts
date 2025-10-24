import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Location, Category, Project, Loan } from '@/shared/types/models';
import * as locationService from '@/services/firebase/locations';
import * as categoryService from '@/services/firebase/categories';
import * as projectService from '@/services/firebase/projects';
import * as loanService from '@/services/firebase/loans';

// Location Query Keys
export const locationKeys = {
  all: ['locations'] as const,
  household: (householdId: string) => [...locationKeys.all, householdId] as const,
  list: (householdId: string) => [...locationKeys.household(householdId), 'list'] as const,
  detail: (householdId: string, locationId: string) => [...locationKeys.household(householdId), 'detail', locationId] as const,
};

// Category Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  household: (householdId: string) => [...categoryKeys.all, householdId] as const,
  list: (householdId: string) => [...categoryKeys.household(householdId), 'list'] as const,
};

// Project Query Keys
export const projectKeys = {
  all: ['projects'] as const,
  household: (householdId: string) => [...projectKeys.all, householdId] as const,
  list: (householdId: string, status?: string) => [...projectKeys.household(householdId), 'list', status] as const,
};

// Loan Query Keys
export const loanKeys = {
  all: ['loans'] as const,
  household: (householdId: string) => [...loanKeys.all, householdId] as const,
  list: (householdId: string, status?: string) => [...loanKeys.household(householdId), 'list', status] as const,
};

/**
 * Location Hooks
 */
export const useLocations = (householdId: string) => {
  return useQuery({
    queryKey: locationKeys.list(householdId),
    queryFn: async () => {
      const { locations, error } = await locationService.listLocations(householdId);
      if (error) throw new Error(error);
      return locations;
    },
    enabled: !!householdId,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ householdId, data }: { householdId: string; data: any }) => {
      const { location, error } = await locationService.createLocation(householdId, data);
      if (error || !location) throw new Error(error || 'Failed');
      return location;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.household(variables.householdId) });
    },
  });
};

/**
 * Category Hooks
 */
export const useCategories = (householdId: string) => {
  return useQuery({
    queryKey: categoryKeys.list(householdId),
    queryFn: async () => {
      const { categories, error } = await categoryService.listCategories(householdId);
      if (error) throw new Error(error);
      return categories;
    },
    enabled: !!householdId,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ householdId, data }: { householdId: string; data: any }) => {
      const { category, error } = await categoryService.createCategory(householdId, data);
      if (error || !category) throw new Error(error || 'Failed');
      return category;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.household(variables.householdId) });
    },
  });
};

/**
 * Project Hooks
 */
export const useProjects = (householdId: string, status?: any) => {
  return useQuery({
    queryKey: projectKeys.list(householdId, status),
    queryFn: async () => {
      const { projects, error } = await projectService.listProjects(householdId, status);
      if (error) throw new Error(error);
      return projects;
    },
    enabled: !!householdId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ householdId, userId, data }: { householdId: string; userId: string; data: any }) => {
      const { project, error } = await projectService.createProject(householdId, userId, data);
      if (error || !project) throw new Error(error || 'Failed');
      return project;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.household(variables.householdId) });
    },
  });
};

/**
 * Loan Hooks
 */
export const useLoans = (householdId: string, status?: any) => {
  return useQuery({
    queryKey: loanKeys.list(householdId, status),
    queryFn: async () => {
      const { loans, error } = await loanService.listLoans(householdId, status);
      if (error) throw new Error(error);
      return loans;
    },
    enabled: !!householdId,
  });
};

export const useCreateLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ householdId, userId, data }: { householdId: string; userId: string; data: any }) => {
      const { loan, error } = await loanService.createLoan(householdId, userId, data);
      if (error || !loan) throw new Error(error || 'Failed');
      return loan;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.household(variables.householdId) });
    },
  });
};

export const useReturnLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ householdId, loanId }: { householdId: string; loanId: string }) => {
      const { error } = await loanService.returnLoan(householdId, loanId);
      if (error) throw new Error(error);
      return { loanId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.household(variables.householdId) });
    },
  });
};

