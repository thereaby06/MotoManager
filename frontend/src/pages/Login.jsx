import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    workshopName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const { data } = await axios.post(`${apiUrl}${endpoint}`, payload);
      login(data);
      navigate("/dashboard");
    } catch (e) {
      setError(e?.response?.data?.message || "No fue posible iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">MotoManager Suite</h1>
        <p className="text-sm text-slate-500">{isRegister ? "Crea tu taller" : "Inicia sesión para continuar"}</p>

        {isRegister && (
          <>
            <input
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Nombre completo"
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              required
            />
            <input
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Nombre del taller"
              value={form.workshopName}
              onChange={(e) => setForm((p) => ({ ...p, workshopName: e.target.value }))}
              required
            />
          </>
        )}

        <input
          className="w-full rounded-lg border px-3 py-2"
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
        />
        <input
          className="w-full rounded-lg border px-3 py-2"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          required
        />

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button disabled={loading} className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-50">
          {loading ? "Procesando..." : isRegister ? "Crear cuenta" : "Entrar"}
        </button>
        <button type="button" className="w-full text-sm text-slate-600" onClick={() => setIsRegister((p) => !p)}>
          {isRegister ? "Ya tengo cuenta" : "Crear nueva cuenta"}
        </button>
      </form>
    </main>
  );
}
