import { GraduationCap, Calendar, MapPin, Monitor, Clock } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import AvailableSpaces from './AvailableSpaces';
import ProfessorSoftwareRequest from './ProfessorSoftwareRequest';
import MyReservations from './MyReservations';

function ProfessorDashboard({ onLogout }) {
  const [currentView, setCurrentView] = useState('dashboard');

  // Consumir dados do contexto
  const {
    currentUser,
    spaces,
    software,
    reservations,
    getSpaceById
  } = useApp();

  // Verificar se usuário está logado
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F5EFED] flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 border-2 border-gray-200 max-w-md text-center">
          <GraduationCap className="w-16 h-16 text-[#058ED9] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#03012C] mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 mb-4">
            Por favor, faça login para acessar o Portal do Professor.
          </p>
          <button
            onClick={onLogout}
            className="px-6 py-3 bg-[#03012C] text-white rounded-lg hover:bg-[#058ED9] transition"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  // Calcular estatísticas reativas específicas do professor
  const stats = useMemo(() => {
    const uniqueSpaces = Array.from(new Map((spaces || []).map(s => [s.id, s])).values());
    const uniqueSoftware = Array.from(new Map((software || []).map(sw => [sw.id, sw])).values());
    const uniqueReservations = Array.from(new Map((reservations || []).map(r => [r.id, r])).values());

    // Filtrar reservas do professor logado
    const professorReservations = uniqueReservations.filter(r => r.userId === currentUser.id);

    // Reservas recentes (últimas 3)
    const todayReservations = professorReservations.slice(-3).length;

    // Espaços disponíveis (status 'active')
    const availableSpaces = uniqueSpaces.filter(s => s.status === 'active').length;

    // Softwares pendentes
    const pendingSoftwares = uniqueSoftware.filter(s => s.status === 'pending').length;

    // Últimas 3 reservas do professor (ordenadas por data/hora)
    const sortedReservations = professorReservations.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateB - dateA !== 0) return dateB - dateA;

      const timeA = a.hours?.[0] || '00:00';
      const timeB = b.hours?.[0] || '00:00';
      return timeB.localeCompare(timeA);
    });

    const recentReservations = sortedReservations.slice(0, 3).map(res => {
      const space = getSpaceById(res.spaceId);
      const hours = res.hours || [];
      const sortedHours = [...hours].sort();
      const firstHour = sortedHours[0] || '00:00';
      const lastHour = sortedHours[sortedHours.length - 1] || '00:00';
      const lastHourNum = parseInt(lastHour.split(':')[0]) + 1;
      const endTime = `${lastHourNum.toString().padStart(2, '0')}:00`;

      return {
        id: res.id,
        space: space ? `${space.code} - ${space.name}` : 'Espaço Desconhecido',
        date: new Date(res.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        startTime: firstHour,
        endTime: endTime,
        status: res.status === 'completed' ? 'Finalizada' : res.status === 'confirmed' ? 'Confirmada' : 'Cancelada',
        statusColor: res.status === 'completed' ? 'bg-green-500' : res.status === 'confirmed' ? 'bg-blue-500' : 'bg-gray-500'
      };
    });

    return {
      todayReservations,
      availableSpaces,
      pendingSoftwares,
      recentReservations
    };
  }, [spaces, software, reservations, currentUser.id, getSpaceById]);

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
          <button
            onClick={() => setCurrentView('reservations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
              currentView === 'reservations' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Minhas Reservas</span>
          </button>
          <button
            onClick={() => setCurrentView('spaces')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
              currentView === 'spaces' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span>Espaços Disponíveis</span>
          </button>
          <button
            onClick={() => setCurrentView('software')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
              currentView === 'software' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
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
              <p className="text-sm font-semibold text-[#03012C]">{currentUser.name}</p>
              {currentUser.department && (
                <p className="text-xs text-gray-600">{currentUser.department}</p>
              )}
            </div>
            <button
              onClick={onLogout}
              className="w-10 h-10 bg-[#03012C] rounded-full flex items-center justify-center text-white font-bold hover:bg-[#058ED9] transition text-xs"
            >
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </button>
          </div>
        </header>

        {currentView === 'spaces' ? (
          <AvailableSpaces />
        ) : currentView === 'software' ? (
          <ProfessorSoftwareRequest />
        ) : currentView === 'reservations' ? (
          <MyReservations />
        ) : (
        <main className="flex-1 p-8 overflow-auto">
          <div className="bg-gradient-to-r from-[#058ED9] to-[#0B79BE] rounded-2xl p-8 mb-8 text-white shadow-lg">
            <h1 className="text-3xl font-bold mb-2">Portal do Professor</h1>
            <p className="text-white/90 mb-6">
              Bem-vindo ao Portal do Professor. Reserve espaços e solicite recursos para suas aulas.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20 hover:bg-white/20 transition">
                <div className="text-4xl font-bold mb-2">{stats.todayReservations}</div>
                <div className="text-sm text-white/90 font-medium">Minhas Reservas Recentes</div>
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
              <button
                onClick={() => setCurrentView('reservations')}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#058ED9] hover:shadow-lg transition group text-left"
              >
                <div className="w-12 h-12 bg-[#03012C] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#058ED9] transition">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#03012C] text-lg mb-1">Minhas Reservas</h3>
                <p className="text-sm text-gray-600">Visualize e gerencie suas reservas</p>
              </button>

              <button
                onClick={() => setCurrentView('spaces')}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#058ED9] hover:shadow-lg transition group text-left"
              >
                <div className="w-12 h-12 bg-[#03012C] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#058ED9] transition">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#03012C] text-lg mb-1">Espaços Disponíveis</h3>
                <p className="text-sm text-gray-600">Consulte espaços para reservar</p>
              </button>

              <button
                onClick={() => setCurrentView('software')}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#058ED9] hover:shadow-lg transition group text-left"
              >
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

            {stats.recentReservations.length > 0 ? (
              <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {stats.recentReservations.map((reservation) => (
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
                  <button
                    onClick={() => setCurrentView('reservations')}
                    className="w-full py-3 border-2 border-[#058ED9] text-[#058ED9] font-semibold rounded-lg hover:bg-[#058ED9] hover:text-white transition"
                  >
                    Ver Todas as Reservas
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Você ainda não possui reservas.</p>
                <p className="text-sm text-gray-500 mt-1">Comece reservando um espaço acadêmico!</p>
              </div>
            )}
          </section>
        </main>
        )}

        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-xl border-2 border-[#57CC99] p-4 animate-slide-up">
          <p className="text-sm font-semibold text-[#03012C]">Login realizado com sucesso!</p>
          <p className="text-xs text-gray-600 mt-1">Bem-vindo, {currentUser.name}.</p>
        </div>
      </div>
    </div>
  );
}

export default ProfessorDashboard;
