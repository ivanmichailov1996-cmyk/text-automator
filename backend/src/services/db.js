import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const getOrCreateUser = async (telegramId, username, firstName) => {
  try {
    // Try to get existing user
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (existingUser) {
      return existingUser;
    }

    // Create new user if doesn't exist
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          telegram_id: telegramId,
          username: username,
          first_name: firstName
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;
    return newUser;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

export const saveToHistory = async (userId, type, inputText, outputText, language = 'ru') => {
  try {
    const { data, error } = await supabase
      .from('history')
      .insert([
        {
          user_id: userId,
          type: type,
          input_text: inputText,
          output_text: outputText,
          language: language
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

export const getHistory = async (userId, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

export const deleteHistoryItem = async (itemId) => {
  try {
    const { error } = await supabase
      .from('history')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

export default supabase;
