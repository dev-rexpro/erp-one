import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Helper to convert camelCase to snake_case
const camelToSnake = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

// Helper to convert snake_case to camelCase
const snakeToCamel = (str: string) => str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));

export function mapKeysToSnake(obj: any): any {
  if (Array.isArray(obj)) return obj.map(mapKeysToSnake);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key) => {
      const snakeKey = camelToSnake(key);
      acc[snakeKey] = mapKeysToSnake(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

export function mapKeysToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(mapKeysToCamel);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key) => {
      const camelKey = snakeToCamel(key);
      acc[camelKey] = mapKeysToCamel(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

export const dbService = {
  /**
   * Fetches all records from Supabase if configured, otherwise falls back to localStorage.
   */
  async fetchAll<T>(tableName: string, localStorageKey: string, defaultValue: T[]): Promise<T[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from(tableName).select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          const camelData = mapKeysToCamel(data);
          // Sync back to local storage as cache
          localStorage.setItem(localStorageKey, JSON.stringify(camelData));
          return camelData;
        }
      } catch (error) {
        console.warn(`Supabase fetch failed for ${tableName}, falling back to localStorage:`, error);
      }
    }

    // Fallback to localStorage
    const cached = localStorage.getItem(localStorageKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error(`Failed to parse cache for ${localStorageKey}`, e);
      }
    }

    // Fallback to static mock data
    return defaultValue;
  },

  /**
   * Syncs state changes to Supabase and updates localStorage cache.
   * Handles additions, updates, and deletions.
   */
  async syncState<T extends { id?: string; code?: string }>(
    tableName: string,
    localStorageKey: string,
    items: T[]
  ): Promise<void> {
    // Write cache to localStorage
    localStorage.setItem(localStorageKey, JSON.stringify(items));

    if (!isSupabaseConfigured) return;

    try {
      const pk = tableName === 'ledger_accounts' ? 'code' : 'id';
      
      // 1. Get existing keys in Supabase to determine deletions
      const { data: existing, error: fetchError } = await supabase
        .from(tableName)
        .select(pk);
      if (fetchError) throw fetchError;

      const existingKeys = (existing || []).map((row: any) => row[pk]);
      const currentKeys = items.map((item: any) => item[pk || 'id']);

      // 2. Delete rows that are no longer in the list
      const keysToDelete = existingKeys.filter(key => !currentKeys.includes(key));
      if (keysToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from(tableName)
          .delete()
          .in(pk, keysToDelete);
        if (deleteError) throw deleteError;
      }

      // 3. Upsert current items
      if (items.length > 0) {
        const snakeItems = mapKeysToSnake(items);
        const { error: upsertError } = await supabase
          .from(tableName)
          .upsert(snakeItems);
        if (upsertError) throw upsertError;
      }
    } catch (error) {
      console.error(`Supabase sync state failed for ${tableName}:`, error);
    }
  }
};
