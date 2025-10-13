import { GraduationCap, Calendar, MapPin, Monitor, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

function ProfessorDashboard({ onLogout }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [mockData, setMockData] = useState({
    users: [],
    spaces: [],
    softwares: [],
    reservations: []
  });
  const [stats, setStats] = useState({
    todayReservations: 0,
    availableSpaces: 0,
    pendingSoftwares: 0
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

    const reservations = [
      {
        id: 1,
        space: 'LAB01 - Laboratório de Informática 101',
        date: '08/09',
        startTime: '07:00',
        endTime: '12:00',
        status: 'Finalizada',
        statusColor: 'bg-green-500'
      },
      {
        id: 2,
        space: 'LAB02 - Laboratório de Redes',
        date: '08/09',
        startTime: '07:00',
        endTime: '12:00',
        status: 'Finalizada',
        statusColor: 'bg-green-500'
      },
      {
        id: 3,
        space: 'LAB01 - Laboratório de Informática 101',
        date: '08/09',
        startTime: '07:00',
        endTime: '12:00',
        status: 'Finalizada',
        statusColor: 'bg-green-500'
      }
    ];

    setMockData({ users, spaces, softwares, reservations });

    const todayReservations = 0;
    const availableSpaces = spaces.filter(s => s.status === 'active').length;
    const pendingSoftwares = softwares.filter(s => s.status === 'pending').length;

    setStats({
      todayReservations,
      availableSpaces,
      pendingSoftwares
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F5EFED] flex">
      <aside className="w-64 bg-[#03012C] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">AcademiGold</h1>
          <p className="text-sm text-[#80ED99] mt-1">Portal do Professor</p>
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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-left">
            <Calendar className="w-5 h-5" />
            <span>Minhas Reservas</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-left">
            <MapPin className="w-5 h-5" />
            <span>Espaços Disponíveis</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-left">
            <Monitor className="w-5 h-5" />
            <span>Solicitar Software</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-left">
            <Clock className="w-5 h-5" />
            <span>Histórico</span>
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
              <p className="text-sm font-semibold text-[#03012C]">Professor</p>
            </div>
            <button
              onClick={onLogout}
              className="w-10 h-10 bg-[#03012C] rounded-full flex items-center justify-center text-white font-bold hover:bg-[#058ED9] transition text-xs"
            >
              MS
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <div className="bg-gradient-to-r from-[#058ED9] to-[#0B79BE] rounded-2xl p-8 mb-8 text-white shadow-lg">
            <h1 className="text-3xl font-bold mb-2">Portal do Professor</h1>
            <p className="text-white/90 mb-6">
              Bem-vindo ao Portal do Professor. Reserve espaços e solicite recursos para suas aulas.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20 hover:bg-white/20 transition">
                <div className="text-4xl font-bold mb-2">{stats.todayReservations}</div>
                <div className="text-sm text-white/90 font-medium">Minhas Reservas Hoje</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20 hover:bg-white/20 transition">
                <div className="text-4xl font-bold mb-2">{stats.availableSpaces}</div>
                <div className="text-sm text-white/90 font-medium">Espaços Disponíveis</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20 hover:bg-white/20 transition">
                <div className="text-4xl font-bold mb-2">{stats.pendingSoftwares}</div>
                <div className="text-sm text-white/90 font-medium">Softwares Pendentes</div>
              </div>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#03012C] mb-6">Ações Rápidas</h2>
            <div className="grid grid-cols-3 gap-6">
              <button className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#058ED9] hover:shadow-lg transition group text-left">
                <div className="w-12 h-12 bg-[#03012C] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#058ED9] transition">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#03012C] text-lg mb-1">Minhas Reservas</h3>
                <p className="text-sm text-gray-600">Visualize e gerencie suas reservas</p>
              </button>

              <button className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#058ED9] hover:shadow-lg transition group text-left">
                <div className="w-12 h-12 bg-[#03012C] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#058ED9] transition">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#03012C] text-lg mb-1">Espaços Disponíveis</h3>
                <p className="text-sm text-gray-600">Consulte espaços para reservar</p>
              </button>

              <button className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#058ED9] hover:shadow-lg transition group text-left">
                <div className="w-12 h-12 bg-[#03012C] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#058ED9] transition">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#03012C] text-lg mb-1">Solicitar Software</h3>
                <p className="text-sm text-gray-600">Requisite novos softwares</p>
              </button>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#03012C] flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#058ED9]" />
                Suas Últimas Reservas
              </h2>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {mockData.reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="p-5 hover:bg-gray-50 transition flex items-center justify-between"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-[#058ED9]/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[#058ED9]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#03012C] mb-1">{reservation.space}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {reservation.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {reservation.startTime} - {reservation.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`${reservation.statusColor} text-white text-xs font-semibold px-4 py-2 rounded-full`}>
                      {reservation.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-gray-50 border-t-2 border-gray-200">
                <button className="w-full py-3 border-2 border-[#058ED9] text-[#058ED9] font-semibold rounded-lg hover:bg-[#058ED9] hover:text-white transition">
                  Ver Todas as Reservas
                </button>
              </div>
            </div>
          </section>
        </main>

        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-xl border-2 border-[#57CC99] p-4 animate-slide-up">
          <p className="text-sm font-semibold text-[#03012C]">Login realizado com sucesso!</p>
          <p className="text-xs text-gray-600 mt-1">Bem-vindo, Professor.</p>
        </div>
      </div>
    </div>
  );
}

export default ProfessorDashboard;
