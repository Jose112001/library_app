import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qxhbsqqpwmowzjfgoqfv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4aGJzcXFwd21vd3pqZmdvcWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjMyNTYsImV4cCI6MjA2NjQzOTI1Nn0.tgl40DHGa-YYpt1lowNX7lzCwtdT7BslEWHN8ClwxEM";

// const { data: prestamosActivos } = await supabase
//   .from('prestamos')
//   .select('*', { count: 'exact' })
//   .eq('id_usuario', usuario.id)
//   .is('fecha_devolucion', null);

// if (prestamosActivos.length >= 3) {
//   return setMensaje("❌ No puedes tener más de 3 préstamos activos.");
// }

// const { data: prestamoExistente } = await supabase
//   .from('prestamos')
//   .select('*')
//   .eq('id_usuario', usuario.id)
//   .eq('id_libro', libro.id)
//   .is('fecha_devolucion', null);

// if (prestamoExistente.length > 0) {
//   return setMensaje("❌ Ya tienes este libro prestado y no lo has devuelto.");
// }


export const supabase = createClient(supabaseUrl, supabaseAnonKey);