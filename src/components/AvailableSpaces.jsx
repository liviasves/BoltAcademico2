import { useState, useMemo } from 'react';
import { Search, MapPin, Users, Calendar, Clock, Monitor, Building, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

function AvailableSpaces() {
  const { spaces, currentUser, addReservation, reservations } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [showModal, setShowModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [selectedHours, setSelectedHours] = useState([]);
  const [rangeStart, setRangeStart] = useState(null);
  const [purpose, setPurpose] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [conflictError, setConflictError] = useState(null);

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

  const getDayOfWeekInPortuguese = (dateString) => {
    const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return days[date.getDay()];
  };

  const handleReserveClick = (space) => {
    if (space.status !== 'active') {
      alert('Este espaço está inativo e não pode ser reservado no momento.');
      return;
    }

    setSelectedSpace(space);
    setSelectedHours([]);
    setRangeStart(null);
    setPurpose('');
    setConflictError(null);
    setShowModal(true);
  };

  const handleHourClick = (hour, availableHours) => {
    if (!rangeStart) {
      setRangeStart(hour);
      setSelectedHours([hour]);
    } else {
      const startIndex = availableHours.indexOf(rangeStart);
      const endIndex = availableHours.indexOf(hour);

      const minIndex = Math.min(startIndex, endIndex);
      const maxIndex = Math.max(startIndex, endIndex);

      const rangeHours = availableHours.slice(minIndex, maxIndex + 1);
      setSelectedHours(rangeHours);
      setRangeStart(null);
    }
  };

  const checkTimeConflict = (selectedHours, date) => {
    const professorReservations = reservations.filter(r =>
      r.userId === currentUser?.id &&
      r.date === date &&
      r.status === 'confirmed'
    );

    for (const reservation of professorReservations) {
      const reservedHours = reservation.hours || [];
      const hasConflict = selectedHours.some(hour => reservedHours.includes(hour));

      if (hasConflict) {
        const space = spaces.find(s => s.id === reservation.spaceId);
        return {
          hasConflict: true,
          conflictingSpace: space?.name || 'Espaço desconhecido',
          conflictingHours: reservedHours.filter(h => selectedHours.includes(h))
        };
      }
    }

    return { hasConflict: false };
  };

  const handleConfirmReservation = () => {
    if (selectedHours.length === 0) {
      alert('Por favor, selecione pelo menos um horário.');
      return;
    }

    if (!purpose.trim()) {
      alert('Por favor, informe a finalidade da reserva.');
      return;
    }

    const conflict = checkTimeConflict(selectedHours, selectedDate);

    if (conflict.hasConflict) {
      setConflictError({
        space: conflict.conflictingSpace,
        hours: conflict.conflictingHours
      });
      return;
    }

    const newReservation = {
      spaceId: selectedSpace.id,
      userId: currentUser?.id,
      date: selectedDate,
      hours: selectedHours,
      purpose: purpose
    };

    addReservation(newReservation);

    setShowModal(false);
    setSelectedHours([]);
    setRangeStart(null);
    setPurpose('');
    setShowSuccessMessage(true);

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 4000);
  };

  const getSpaceHours = (space, dateString) => {
    const dayOfWeek = getDayOfWeekInPortuguese(dateString);
    const hours = space.schedule?.[dayOfWeek] || [];

    const spaceReservations = reservations.filter(r =>
      r.spaceId === space.id &&
      r.date === dateString &&
      r.status === 'confirmed'
    );

    const reservedHours = spaceReservations.flatMap(r => r.hours || []);

    return hours.filter(hour => !reservedHours.includes(hour));
  };

  const getOccupiedHours = (space, dateString) => {
    const spaceReservations = reservations.filter(r =>
      r.spaceId === space.id &&
      r.date === dateString &&
      r.status === 'confirmed'
    );

    return spaceReservations.flatMap(r => r.hours || []);
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
            const spaceHours = getSpaceHours(space, selectedDate);
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
                      Horários para {getDayOfWeekInPortuguese(selectedDate)} ({new Date(selectedDate.split('-')[0], selectedDate.split('-')[1] - 1, selectedDate.split('-')[2]).toLocaleDateString('pt-BR')}):
                    </div>
                    {isAvailable && spaceHours.length > 0 ? (
                      <>
                        <div className="grid grid-cols-6 gap-2">
                          {spaceHours.slice(0, 10).map(hour => (
                            <div
                              key={hour}
                              className="text-center py-2 rounded text-xs font-semibold bg-[#80ED99]/30 text-[#03012C] border border-[#57CC99]"
                            >
                              {hour}
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-[#058ED9] font-semibold mt-2">
                          +{spaceHours.length} disponíveis
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

      {showModal && selectedSpace && (() => {
        const modalSpaceHours = getSpaceHours(selectedSpace, selectedDate);
        const occupiedHours = getOccupiedHours(selectedSpace, selectedDate);
        const dayOfWeek = getDayOfWeekInPortuguese(selectedDate);
        const allScheduledHours = selectedSpace.schedule?.[dayOfWeek] || [];

        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-[#03012C] mb-2">Reservar Espaço</h2>
              <p className="text-gray-600 mb-6">{selectedSpace.name}</p>

              {conflictError && (
                <div className="mb-4 bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-red-800 mb-1">
                        Você já possui uma reserva neste horário. Verifique suas reservas antes de continuar.
                      </p>
                      <p className="text-xs text-red-700 mb-2">
                        <strong>Espaço:</strong> {conflictError.space}
                      </p>
                      <p className="text-xs text-red-700">
                        <strong>Horários conflitantes:</strong> {conflictError.hours.join(', ')}
                      </p>
                      <button
                        onClick={() => setConflictError(null)}
                        className="mt-2 text-xs text-red-600 hover:text-red-800 font-semibold underline"
                      >
                        Fechar aviso
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Data da Reserva
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getTodayDate()}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#058ED9] transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-3">
                    Selecione os horários (clique em dois horários para selecionar um intervalo):
                  </label>

                  <div className="flex items-center gap-4 mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#80ED99] rounded border border-[#57CC99]"></div>
                      <span>Disponível</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#058ED9] rounded"></div>
                      <span>Selecionado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-400 rounded"></div>
                      <span>Ocupado</span>
                    </div>
                  </div>

                  {rangeStart && (
                    <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800 font-semibold">
                        Horário inicial selecionado: {rangeStart}
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Clique no horário final para completar a seleção do intervalo
                      </p>
                    </div>
                  )}

                  {allScheduledHours.length > 0 ? (
                    <>
                      <div className="grid grid-cols-5 gap-2">
                        {allScheduledHours.map(hour => {
                          const isOccupied = occupiedHours.includes(hour);
                          const isSelected = selectedHours.includes(hour);
                          const isRangeStart = hour === rangeStart;
                          return (
                            <button
                              key={hour}
                              onClick={() => !isOccupied && handleHourClick(hour, modalSpaceHours)}
                              disabled={isOccupied}
                              className={`text-center py-3 rounded text-sm font-semibold transition ${
                                isOccupied
                                  ? 'bg-red-400 text-white border-2 border-red-500 cursor-not-allowed opacity-60'
                                  : isSelected
                                  ? 'bg-[#058ED9] text-white border-2 border-[#058ED9]'
                                  : isRangeStart
                                  ? 'bg-yellow-200 text-[#03012C] border-2 border-yellow-400'
                                  : 'bg-[#80ED99]/30 text-[#03012C] border-2 border-[#57CC99] hover:bg-[#80ED99]/50'
                              }`}
                            >
                              {hour}
                            </button>
                          );
                        })}
                      </div>
                      {selectedHours.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedHours([]);
                            setRangeStart(null);
                          }}
                          className="mt-3 text-sm text-[#058ED9] hover:text-[#03012C] font-semibold underline"
                        >
                          Limpar seleção
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
                      Nenhum horário disponível para {dayOfWeek}
                    </div>
                  )}

                  {selectedHours.length > 0 && (
                    <div className="mt-4 bg-[#058ED9]/10 rounded-lg p-4">
                      <p className="text-sm font-semibold text-[#03012C] mb-1">
                        Horários selecionados: {selectedHours.length} horário{selectedHours.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-600">
                        {selectedHours[0]} até {selectedHours[selectedHours.length - 1]}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Finalidade da Reserva
                  </label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
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
                  className="flex-1 py-3 bg-[#03012C] text-white font-semibold rounded-lg hover:bg-[#058ED9] transition"
                >
                  Confirmar Reserva
                </button>
              </div>
            </div>
          </div>
        );
      })()}

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
