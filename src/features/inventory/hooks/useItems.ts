import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Item } from '@/shared/types/models';
import * as itemService from '@/services/firebase/items';
import { storageHelpers } from '@/shared/utils/storage';

// Query keys
export const itemKeys = {
  all: ['items'] as const,
  household: (householdId: string) => [...itemKeys.all, householdId] as const,
  list: (householdId: string, filters?: any) => [...itemKeys.household(householdId), 'list', filters] as const,
  detail: (householdId: string, itemId: string) => [...itemKeys.household(householdId), 'detail', itemId] as const,
};

/**
 * Hook to fetch single item
 */
export const useItem = (householdId: string, itemId: string) => {
  return useQuery({
    queryKey: itemKeys.detail(householdId, itemId),
    queryFn: async () => {
      const { item, error } = await itemService.getItem(householdId, itemId);
      if (error) throw new Error(error);
      return item;
    },
    enabled: !!householdId && !!itemId,
  });
};

/**
 * Hook to fetch items list
 */
export const useItems = (
  householdId: string,
  filters?: {
    categoryId?: string;
    locationId?: string;
    isArchived?: boolean;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: itemKeys.list(householdId, filters),
    queryFn: async () => {
      const { items, error } = await itemService.listItems(householdId, filters);
      if (error) throw new Error(error);
      return items;
    },
    enabled: !!householdId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create item
 */
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      householdId,
      userId,
      data,
    }: {
      householdId: string;
      userId: string;
      data: Omit<Item, 'id' | 'householdId' | 'createdBy' | 'createdAt' | 'updatedAt'>;
    }) => {
      const { item, error } = await itemService.createItem(householdId, userId, data);
      if (error || !item) throw new Error(error || 'Failed to create item');
      return item;
    },
    onSuccess: (newItem, variables) => {
      // Invalidate and refetch items list
      queryClient.invalidateQueries({ queryKey: itemKeys.household(variables.householdId) });

      // Optimistically update cache
      queryClient.setQueryData(
        itemKeys.detail(variables.householdId, newItem.id),
        newItem
      );
    },
  });
};

/**
 * Hook to update item
 */
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      householdId,
      itemId,
      data,
    }: {
      householdId: string;
      itemId: string;
      data: Partial<Omit<Item, 'id' | 'householdId' | 'createdBy' | 'createdAt' | 'updatedAt'>>;
    }) => {
      const { error } = await itemService.updateItem(householdId, itemId, data);
      if (error) throw new Error(error);
      return { itemId, data };
    },
    onMutate: async ({ householdId, itemId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: itemKeys.detail(householdId, itemId) });

      // Snapshot previous value
      const previousItem = queryClient.getQueryData<Item>(
        itemKeys.detail(householdId, itemId)
      );

      // Optimistically update
      if (previousItem) {
        queryClient.setQueryData(
          itemKeys.detail(householdId, itemId),
          { ...previousItem, ...data }
        );
      }

      return { previousItem };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousItem) {
        queryClient.setQueryData(
          itemKeys.detail(variables.householdId, variables.itemId),
          context.previousItem
        );
      }
    },
    onSettled: (result, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: itemKeys.household(variables.householdId) });
    },
  });
};

/**
 * Hook to delete item
 */
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      householdId,
      itemId,
    }: {
      householdId: string;
      itemId: string;
    }) => {
      const { error } = await itemService.deleteItem(householdId, itemId);
      if (error) throw new Error(error);
      return { itemId };
    },
    onSuccess: (data, variables) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: itemKeys.detail(variables.householdId, variables.itemId) });

      // Invalidate list
      queryClient.invalidateQueries({ queryKey: itemKeys.household(variables.householdId) });
    },
  });
};

/**
 * Hook to toggle item archive status
 */
export const useToggleItemArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      householdId,
      itemId,
      isArchived,
    }: {
      householdId: string;
      itemId: string;
      isArchived: boolean;
    }) => {
      const { error } = await itemService.toggleItemArchive(householdId, itemId, isArchived);
      if (error) throw new Error(error);
      return { itemId, isArchived };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.household(variables.householdId) });
    },
  });
};

/**
 * Hook to search items
 */
export const useSearchItems = (householdId: string, searchTerm: string) => {
  return useQuery({
    queryKey: [...itemKeys.household(householdId), 'search', searchTerm],
    queryFn: async () => {
      const { items, error } = await itemService.searchItems(householdId, searchTerm);
      if (error) throw new Error(error);
      return items;
    },
    enabled: !!householdId && searchTerm.length > 2,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

