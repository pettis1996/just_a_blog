import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ user });
  }

  if (req.method === 'GET') {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }

    const { data, error } = await supabase
      .from('users') // Ensure you use the correct table name
      .select('*')
      .eq('email', email)
      .single();

    console.log(data);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ user: data });
  }

  res.status(405).send('Method Not Allowed');
}
