import { GraduationCap, MapPin, Users, Monitor, Building } from 'lucide-react';
import { useState, useEffect } from 'react';
import SpaceManagement from './SpaceManagement';

function AdminDashboard({ onLogout }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [mockData, setMockData] = useState({
    users: [],
    spaces: [],
    softwares: []
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSpaces: 0,
    approvedSoftwares: 0,
    pendingSoftwares: 0,
    professors: 0,
    admins: 0,
    labs: 0,
    classrooms: 0
  });

  useEffect(() => {
    const users = [
      { id: 1, name: 'Administrador', email: 'admin@academigold.com', role: 'admin' },
      { id: 2, name: 'Prof. Maria Silva', email: 'maria@academigold.com', role: 'professor' }
    ];

    const spaces = [
      { id: 1, name: 'LAB01', type: 'laboratory', status: 'active', capacity: 30 },
      { id: 2, name: 'LAB02', type: 'laboratory', status: 'active', capacity: 25 },
      { id: 3, name: 'Sala 101', type: 'classroom', status: 'inactive', capacity: 40 }
    ];

    const softwares = [
      { id: 1, name: 'Visual Studio Code', status: 'approved', version: '1.85' },
      { id: 2, name: 'Adobe Photoshop', status: 'pending', version: '2024' }
    ];

    setMockData({ users, spaces, softwares });

    const totalUsers = users.length;
    const activeSpaces = spaces.filter(s => s.status === 'active').length;
    const approvedSoftwares = softwares.filter(s => s.status === 'approved').length;
    const pendingSoftwares = softwares.filter(s => s.status === 'pending').length;
    const professors = users.filter(u => u.role === 'professor').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const labs = spaces.filter(s => s.type === 'laboratory').length;
    const classrooms = spaces.filter(s => s.type === 'classroom').length;

    setStats({
      totalUsers,
      activeSpaces,
      approvedSoftwares,
      pendingSoftwares,
      professors,
      admins,
      labs,
      classrooms
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F5EFED] flex">
      <aside className="w-64 bg-[#03012C] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">AcademiGold</h1>
          <p className="text-sm text-[#80ED99] mt-1">Painel Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
              currentView === 'dashboard' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span>Página Inicial</span>
          </button>
          <button
            onClick={() => setCurrentView('spaces')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
              currentView === 'spaces' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span>Espaços Acadêmicos</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-left">
            <Users className="w-5 h-5" />
            <span>Usuários</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-left">
            <Monitor className="w-5 h-5" />
            <span>Softwares</span>
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#03012C] rounded flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-[#03012C]">AcademiGold</h2>
              <p className="text-xs text-gray-600">Sistema de Controle Acadêmico</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-[#03012C]">Administrador</p>
            </div>
            <button
              onClick={onLogout}
              className="w-10 h-10 bg-[#03012C] rounded-full flex items-center justify-center text-white font-bold hover:bg-[#058ED9] transition"
            >
              ADM
            </button>
          </div>
        </header>

        {currentView === 'dashboard' ? (
        <main className="flex-1 p-8 overflow-auto">
          <div className="bg-[#03012C] rounded-2xl p-8 mb-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
            <p className="text-[#80ED99] mb-6">
              Gerencie espaços acadêmicos, usuários e otimize recursos educacionais
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold mb-1">{stats.totalUsers}</div>
                <div className="text-sm text-[#80ED99]">Total de Usuários</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold mb-1">{stats.activeSpaces}</div>
                <div className="text-sm text-[#80ED99]">Espaços Ativos</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold mb-1">{mockData.softwares.length}</div>
                <div className="text-sm text-[#80ED99]">Softwares Cadastrados</div>
              </div>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#03012C] mb-6">Ações Administrativas</h2>
            <div className="grid grid-cols-3 gap-6">
              <button
                onClick={() => setCurrentView('spaces')}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#058ED9] hover:shadow-lg transition group"
              >
                <div className="w-12 h-12 bg-[#03012C] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#058ED9] transition">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#03012C]">Gerenciar Espaços</h3>
              </button>

              <button className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#058ED9] hover:shadow-lg transition group">
                <div className="w-12 h-12 bg-[#03012C] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#058ED9] transition">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#03012C]">Gerenciar Usuários</h3>
              </button>

              <button className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#058ED9] hover:shadow-lg transition group">
                <div className="w-12 h-12 bg-[#03012C] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#058ED9] transition">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#03012C]">Gerenciar Softwares</h3>
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#03012C] mb-6">Estatísticas do Sistema</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#03012C]">Usuários do Sistema</h3>
                  <Users className="w-5 h-5 text-[#058ED9]" />
                </div>
                <div className="text-3xl font-bold text-[#03012C] mb-3">{stats.totalUsers}</div>
                <div className="flex gap-4 text-sm">
                  <span className="text-[#058ED9]">
                    <span className="font-semibold">{stats.professors}</span> Professores
                  </span>
                  <span className="text-[#57CC99]">
                    <span className="font-semibold">{stats.admins}</span> Admins
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#03012C]">Espaços Acadêmicos</h3>
                  <Building className="w-5 h-5 text-[#058ED9]" />
                </div>
                <div className="text-3xl font-bold text-[#03012C] mb-3">{mockData.spaces.length}</div>
                <div className="flex gap-4 text-sm">
                  <span className="text-[#058ED9]">
                    <span className="font-semibold">{stats.labs}</span> Labs
                  </span>
                  <span className="text-[#57CC99]">
                    <span className="font-semibold">{stats.classrooms}</span> Salas
                  </span>
                  <span className="text-[#80ED99]">
                    <span className="font-semibold">{stats.activeSpaces}</span> Ativos
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#03012C]">Softwares</h3>
                  <Monitor className="w-5 h-5 text-[#058ED9]" />
                </div>
                <div className="text-3xl font-bold text-[#03012C] mb-3">{mockData.softwares.length}</div>
                <div className="flex gap-4 text-sm">
                  <span className="text-[#57CC99]">
                    <span className="font-semibold">{stats.approvedSoftwares}</span> Aprovados
                  </span>
                  <span className="text-gray-400">
                    <span className="font-semibold">{stats.pendingSoftwares}</span> Pendentes
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>
        ) : (
          <SpaceManagement />
        )}

        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-xl border-2 border-[#57CC99] p-4 animate-slide-up">
          <p className="text-sm font-semibold text-[#03012C]">Login realizado com sucesso!</p>
          <p className="text-xs text-gray-600 mt-1">Bem-vindo, Administrador.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
