const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = 'https://dulkrqgjfohsuxhsmofo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bGtycWdqZm9oc3V4aHNtb2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NzYwMDMsImV4cCI6MjA3MjU1MjAwM30.b_P98mAantymNfWy1Qz18SaR-LwrPjuaebO2Uj_5JK8';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bGtycWdqZm9oc3V4aHNtb2ZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk3NjAwMywiZXhwIjoyMDcyNTUyMDAzfQ.9p7ONCpj7c_94A33pYR9_-1rGxbdJld5GL7V1udrtiM';

// Create Supabase client for public operations
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// Create Supabase client for admin operations (service role)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// Helper function to get a single row
const getRow = async (table, where) => {
  try {
    let query = supabase.from(table).select('*');
    
    if (where) {
      Object.keys(where).forEach(key => {
        query = query.eq(key, where[key]);
      });
    }
    
    const { data, error } = await query.limit(1);
    
    if (error) {
      console.error(`❌ Supabase getRow error:`, error);
      throw error;
    }
    
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`❌ Supabase getRow error:`, error);
    throw error;
  }
};

// Helper function to get multiple rows
const getRows = async (table, options = {}) => {
  try {
    let query = supabase.from(table).select(options.select || '*');
    
    if (options.where) {
      Object.keys(options.where).forEach(key => {
        query = query.eq(key, options.where[key]);
      });
    }
    
    if (options.limit) query = query.limit(options.limit);
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`❌ Supabase getRows error:`, error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`❌ Supabase getRows error:`, error);
    throw error;
  }
};

// Helper function to insert data
const insert = async (table, data) => {
  try {
    const response = await supabase
      .from(table)
      .insert(data)
      .select();
    
    if (response.error) {
      console.error(`❌ Supabase insert error:`, response.error);
      throw response.error;
    }
    
    return response.data;
  } catch (error) {
    console.error(`❌ Supabase insert error:`, error);
    throw error;
  }
};

// Helper function to update data
const update = async (table, data, where) => {
  try {
    let query = supabase.from(table).update(data);
    
    if (where) {
      Object.keys(where).forEach(key => {
        query = query.eq(key, where[key]);
      });
    }
    
    const { data: result, error } = await query.select();
    
    if (error) {
      console.error(`❌ Supabase update error:`, error);
      throw error;
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Supabase update error:`, error);
    throw error;
  }
};

// Helper function to delete data
const deleteRow = async (table, where) => {
  try {
    let query = supabase.from(table);
    
    if (where) {
      Object.keys(where).forEach(key => {
        query = query.eq(key, where[key]);
      });
    }
    
    const { data, error } = await query.delete().select();
    
    if (error) {
      console.error(`❌ Supabase delete error:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Supabase delete error:`, error);
    throw error;
  }
};

module.exports = {
  supabase,
  supabaseAdmin,
  getRow,
  getRows,
  insert,
  update,
  deleteRow
};
