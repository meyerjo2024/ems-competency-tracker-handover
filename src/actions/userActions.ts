'use client';

import { supabase } from '@/lib/supabase/config';
import type { UserProfile } from '@/types';
import { toAppRole } from '@/lib/supabase/mappers';

type UserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  approved: boolean | null;
  created_at: string | null;
};

function mapUser(row: UserRow): UserProfile {
  return {
    id: row.id,
    fullName: row.full_name ?? '',
    email: row.email ?? '',
    role: toAppRole(row.role),
    approved: row.approved ?? true,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  };
}

export async function updateUserApproval(userId: string, approved: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    const { error } = await supabase.from('users').update({ approved }).eq('id', userId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update approval status',
    };
  }
}

export async function getAllUsers(): Promise<{ success: boolean; data?: UserProfile[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, role, approved, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const users = (data ?? []).map((row) => mapUser(row as UserRow));
    return { success: true, data: users };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch users',
    };
  }
}

export async function getUserById(userId: string): Promise<{ success: boolean; data?: UserProfile; error?: string }> {
  if (!userId) {
    return { success: false, error: 'User ID is required' };
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, role, approved, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data: mapUser(data as UserRow) };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch user',
    };
  }
}
