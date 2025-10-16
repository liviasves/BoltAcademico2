import { useState, useMemo } from 'react';
import { Search, MapPin, Users, Calendar, Clock, Monitor, Building, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

function AvailableSpaces() {
  const { spaces, currentUser, addReservation } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [reservationData, setReservationData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const availableHours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const filteredSpaces = useMemo(() => {
    let filtered = spaces || [];

    if (searchTerm) {
      filtered = filtered.filter(space =>
        space.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        space.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        space.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(space => space.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(space => space.status === statusFilter);
    }

    return filtered;
  }, [spaces, searchTerm, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    const allSpaces = spaces || [];
    const totalSpaces = allSpaces.length;
    const availableSpaces = allSpaces.filter(s => s.status === 'active').length;
    const occupiedSpaces = allSpaces.filter(s => s.status === 'inactive').length;
    const laboratories = allSpaces.filter(s => s.type === 'laboratory').length;

    return { totalSpaces, availableSpaces, occupiedSpaces, laboratories };
  }, [spaces]);

  const handleReserveClick = (space) => {
    if (space.status !== 'active') {
      alert('Este espaço está inativo e não pode ser reservado no momento.');
      return;
    }

    setSelectedSpace(space);
    setReservationData({
      date: selectedDate,
      startTime: '',
      endTime: '',
      purpose: ''
    });
    setShowModal(true);
  };

  const handleConfirmReservation = () => {
    if (!reservationData.startTime || !reservationData.endTime || !reservationData.purpose) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (reservationData.startTime >= reservationData.endTime) {
      alert('O horário final deve ser posterior ao horário inicial.');
      return;
    }

    const newReservation = {
      spaceId: selectedSpace.id,
      userId: currentUser?.id,
      date: reservationData.date,
      startTime: reservationData.startTime,
      endTime: reservationData.endTime,
      purpose: reservationData.purpose
    };

    addReservation(newReservation);

    setShowModal(false);
    setShowSuccessMessage(true);

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 4000);
  };

  const getSpaceHours = (space) => {
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date(selectedDate).getDay()];
    const hours = space.availableHours?.[dayOfWeek] || [];

    return hours.flatMap(range => {
      const [start, end] = range.split('-');
      const startHour = parseInt(start.split(':')[0]);
      const endHour = parseInt(end.split(':')[0]);
      const result = [];
      for (let h = startHour; h < endHour; h++) {
        result.push(`${h.toString().padStart(2, '0')}:00`);
      }
      return result;
    });
  };

  return (
    <div className="flex-1 bg-[#F5EFED] p-8 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#03012C] mb-2">Espaços Acadêmicos</h1>
        <p className="text-gray-600">Visualize todos os espaços cadastrados e reserve os disponíveis</p>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 border-2 border-gray-200">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, código ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#058ED9] transition"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#058ED9] transition bg-white min-w-[200px]"
          >
            <option value="all">Todos os tipos</option>
            <option value="classroom">Salas de Aula</option>
            <option value="laboratory">Laboratórios</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#058ED9] transition bg-white min-w-[200px]"
          >
            <option value="all">Todos os status</option>
            <option value="active">Disponíveis</option>
            <option value="inactive">Ocupados</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#058ED9] transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-600">Total de Espaços</div>
            <Building className="w-5 h-5 text-[#058ED9]" />
          </div>
          <div className="text-4xl font-bold text-[#03012C]">{stats.totalSpaces}</div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-[#57CC99]">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-600">Disponíveis</div>
            <CheckCircle className="w-5 h-5 text-[#57CC99]" />
          </div>
          <div className="text-4xl font-bold text-[#57CC99]">{stats.availableSpaces}</div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-red-300">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-600">Ocupados</div>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-4xl font-bold text-red-500">{stats.occupiedSpaces}</div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-600">Laboratórios</div>
            <Monitor className="w-5 h-5 text-[#058ED9]" />
          </div>
          <div className="text-4xl font-bold text-[#03012C]">{stats.laboratories}</div>
        </div>
      </div>

      {filteredSpaces.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border-2 border-gray-200 text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#03012C] mb-2">Nenhum espaço encontrado</h3>
          <p className="text-gray-600">Não há espaços que correspondam aos filtros selecionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {filteredSpaces.map(space => {
            const spaceHours = getSpaceHours(space);
            const isAvailable = space.status === 'active';

            return (
              <div key={space.id} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="inline-flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-[#058ED9] text-white text-sm font-bold rounded">
                          {space.code}
                        </span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded flex items-center gap-1 ${
                          isAvailable ? 'bg-[#80ED99] text-[#03012C]' : 'bg-red-100 text-red-700'
                        }`}>
                          {isAvailable ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Disponível
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              Ocupado
                            </>
                          )}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#03012C] mb-1">{space.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        {space.type === 'laboratory' ? (
                          <>
                            <Monitor className="w-4 h-4" />
                            <span>Laboratório</span>
                          </>
                        ) : (
                          <>
                            <Building className="w-4 h-4" />
                            <span>Sala de Aula</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{space.description}</p>

                  <div className="flex items-center gap-6 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-4 h-4 text-[#058ED9]" />
                      <span className="font-semibold">{space.capacity} pessoas</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-[#058ED9]" />
                      <span className="font-semibold">{space.location}</span>
                    </div>
                  </div>

                  {space.type === 'laboratory' && space.software?.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-[#03012C] mb-2">Softwares instalados:</div>
                      <div className="flex flex-wrap gap-2">
                        {space.software.map((sw, idx) => (
                          <span key={idx} className="px-2 py-1 bg-[#058ED9]/10 text-[#058ED9] text-xs font-medium rounded border border-[#058ED9]/20">
                            {sw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="text-sm font-semibold text-[#03012C] mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Horários para {new Date(selectedDate).toLocaleDateString('pt-BR')}:
                    </div>
                    {isAvailable && spaceHours.length > 0 ? (
                      <>
                        <div className="grid grid-cols-6 gap-2">
                          {availableHours.slice(0, 12).map(hour => {
                            const isHourAvailable = spaceHours.includes(hour);
                            return (
                              <div
                                key={hour}
                                className={`text-center py-2 rounded text-xs font-semibold ${
                                  isHourAvailable
                                    ? 'bg-[#80ED99]/30 text-[#03012C] border border-[#57CC99]'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {hour}
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {spaceHours.length} horários disponíveis
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        {isAvailable ? 'Nenhum horário disponível para esta data' : 'Espaço inativo no momento'}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleReserveClick(space)}
                    disabled={!isAvailable}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      isAvailable
                        ? 'bg-[#03012C] text-white hover:bg-[#058ED9]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isAvailable ? 'Reservar Espaço' : 'Indisponível'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && selectedSpace && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-[#03012C] mb-2">Reservar Espaço</h2>
            <p className="text-gray-600 mb-6">{selectedSpace.name}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#03012C] mb-2">
                  Data da Reserva
                </label>
                <input
                  type="date"
                  value={reservationData.date}
                  onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#058ED9] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Horário Inicial
                  </label>
                  <input
                    type="time"
                    value={reservationData.startTime}
                    onChange={(e) => setReservationData({ ...reservationData, startTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#058ED9] transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Horário Final
                  </label>
                  <input
                    type="time"
                    value={reservationData.endTime}
                    onChange={(e) => setReservationData({ ...reservationData, endTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#058ED9] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#03012C] mb-2">
                  Finalidade da Reserva
                </label>
                <textarea
                  value={reservationData.purpose}
                  onChange={(e) => setReservationData({ ...reservationData, purpose: e.target.value })}
                  placeholder="Ex: Aula de Programação Web"
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#058ED9] transition resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReservation}
                className="flex-1 py-3 bg-[#57CC99] text-white font-semibold rounded-lg hover:bg-[#4AB889] transition"
              >
                Confirmar Reserva
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-xl border-2 border-[#57CC99] p-4 animate-slide-up z-50">
          <p className="text-sm font-semibold text-[#03012C]">Reserva confirmada com sucesso!</p>
          <p className="text-xs text-gray-600 mt-1">Você pode visualizar suas reservas na página "Minhas Reservas".</p>
        </div>
      )}
    </div>
  );
}

export default AvailableSpaces;
