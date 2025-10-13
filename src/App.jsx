import { GraduationCap, User, Lock } from 'lucide-react';
import { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import ProfessorDashboard from './components/ProfessorDashboard';
import { useApp } from './context/AppContext';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { currentUser, login, logout } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = login(email, password);
    if (!result.success) {
      alert(result.message || 'Credenciais inválidas!');
    }
  };

  const handleLogout = () => {
    logout();
    setEmail('');
    setPassword('');
  };

  if (currentUser && currentUser.role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (currentUser && currentUser.role === 'professor') {
    return <ProfessorDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-[#058ED9] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col items-center">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm mb-5 shadow-lg">
            <GraduationCap className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">AcademiGold</h1>
          <p className="text-[#80ED99] text-base font-medium">Sistema de Controle Acadêmico</p>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[#03012C] mb-2">Acesso ao Sistema</h2>
            <p className="text-sm text-[#058ED9]">Entre com suas credenciais para acessar o sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#03012C] mb-2">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#058ED9]" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@academigold.com"
                  className="block w-full pl-12 pr-4 py-3 border-2 border-[#80ED99]/30 rounded-lg text-[#03012C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#03012C] mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#058ED9]" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="block w-full pl-12 pr-4 py-3 border-2 border-[#80ED99]/30 rounded-lg text-[#03012C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#57CC99] hover:bg-[#4AB889] text-white font-bold py-3.5 px-4 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Entrar no Sistema
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-[#80ED99]/20">
            <p className="text-center text-sm font-semibold text-[#03012C] mb-3">Credenciais de teste:</p>
            <div className="bg-[#80ED99]/10 rounded-lg p-4 space-y-2 border border-[#57CC99]/20">
              <p className="text-xs text-[#03012C]">
                <span className="font-bold text-[#058ED9]">Admin:</span> admin@academigold.com / admin123
              </p>
              <p className="text-xs text-[#03012C]">
                <span className="font-bold text-[#058ED9]">Professor:</span> professor@academigold.com / prof123
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-white/90 mb-1 font-medium">
            Sistema desenvolvido para gerenciamento de espaços acadêmicos
          </p>
          <p className="text-xs text-white/70">
            © 2024 AcademiGold - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
