import React, { useState } from 'react';

interface LoginProps {
  // pass the logged username (short id) back to the app
  onLoginSuccess: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const usernames_list = ['aleja', 'meli', 'juanpi'];
  const passwords_list = ['2701', '0703', '0709'];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const idx = usernames_list.indexOf(username);
    if (idx === -1) {
      setError('Usuario no encontrado.');
      return;
    }

    if (passwords_list[idx] === password) {
      setError('');
      onLoginSuccess(usernames_list[idx]); // Pass the logged username
    } else {
      setError('Contraseña incorrecta.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-2xl animate-fade-in">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800">
                VitalSoft <span className="text-blue-600">LIS</span>
            </h1>
            <p className="mt-2 text-slate-500">Sistema de Información de Laboratorio</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-slate-600"
            >
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-slate-800 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-600"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-slate-800 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          
          {error && (
            <p className="text-sm text-center text-red-600 animate-shake">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
       <style>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
            animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
