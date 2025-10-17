import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';

function MyReservations() {
  const { reservations, currentUser, getSpaceById, updateReservation } = useApp();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const myReservations = useMemo(() => {
    const userReservations = (reservations || []).filter(r => r.userId === currentUser?.id);

    return userReservations
      .map(reservation => {
        const space = getSpaceById(reservation.spaceId);
        return {
          ...reservation,
          spaceName: space ? `${space.code} - ${space.name}` : 'Espaço Desconhecido',
          spaceCode: space?.code || 'N/A'
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateB - dateA !== 0) return dateB - dateA;

        const timeA = a.hours?.[0] || '00:00';
        const timeB = b.hours?.[0] || '00:00';
        return timeB.localeCompare(timeA);
      });
  }, [reservations, currentUser?.id, getSpaceById]);

  const stats = useMemo(() => {
    const total = myReservations.length;
    const confirmed = myReservations.filter(r => r.status === 'confirmed').length;
    const completed = myReservations.filter(r => r.status === 'completed').length;
    const cancelled = myReservations.filter(r => r.status === 'cancelled').length;

    return { total, confirmed, completed, cancelled };
  }, [myReservations]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 bg-[#80ED99] text-[#03012C] text-xs font-bold rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Confirmada
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Finalizada
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Cancelada
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-400 text-white text-xs font-bold rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Pendente
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHourRange = (hours) => {
    if (!hours || hours.length === 0) return 'N/A';
    const sortedHours = [...hours].sort();
    const firstHour = sortedHours[0];
    const lastHour = sortedHours[sortedHours.length - 1];

    const lastHourNum = parseInt(lastHour.split(':')[0]) + 1;
    const endTime = `${lastHourNum.toString().padStart(2, '0')}:00`;

    return `${firstHour} - ${endTime}`;
  };

  const canConfirmUsage = (reservation) => {
    if (reservation.status !== 'confirmed') return false;

    const now = new Date();
    const [year, month, day] = reservation.date.split('-').map(Number);
    const reservationDate = new Date(year, month - 1, day);
    const hours = reservation.hours || [];
    const lastHour = [...hours].sort()[hours.length - 1];

    if (!lastHour) return false;

    const [hour] = lastHour.split(':').map(Number);
    const endHour = hour + 1;
    const reservationEnd = new Date(year, month - 1, day, endHour, 0);

    return now >= reservationEnd;
  };

  const handleConfirmUsage = (reservation) => {
    setSelectedReservation(reservation);
    setShowConfirmModal(true);
  };

  const confirmUsage = () => {
    if (selectedReservation) {
      updateReservation(selectedReservation.id, {
        status: 'completed',
        completedAt: new Date().toISOString()
      });
      setShowConfirmModal(false);
      setSelectedReservation(null);
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 4000);
    }
  };

  return (
    <div className="flex-1 bg-[#F5EFED] p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#03012C] mb-2">Minhas Reservas</h1>
          <p className="text-gray-600">Gerencie suas reservas de espaços acadêmicos</p>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Total</h3>
              <Calendar className="w-5 h-5 text-[#03012C]" />
            </div>
            <div className="text-4xl font-bold text-[#03012C]">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Confirmadas</h3>
              <CheckCircle className="w-5 h-5 text-[#80ED99]" />
            </div>
            <div className="text-4xl font-bold text-[#80ED99]">{stats.confirmed}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-green-300 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Finalizadas</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-4xl font-bold text-green-500">{stats.completed}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-red-300 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Canceladas</h3>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-4xl font-bold text-red-500">{stats.cancelled}</div>
          </div>
        </div>

        {myReservations.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border-2 border-gray-200 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#03012C] mb-2">Nenhuma reserva encontrada</h3>
            <p className="text-gray-600">Você ainda não fez nenhuma reserva de espaço acadêmico.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myReservations.map(reservation => (
              <div
                key={reservation.id}
                className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {getStatusBadge(reservation.status)}
                  </div>

                  <h3 className="text-lg font-bold text-[#03012C] mb-4">
                    {reservation.spaceName}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-[#058ED9]" />
                      <span className="font-semibold">{formatDate(reservation.date)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-[#058ED9]" />
                      <span className="font-semibold">{getHourRange(reservation.hours)}</span>
                    </div>

                    {reservation.purpose && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Finalidade:</p>
                        <p className="text-sm text-gray-700">{reservation.purpose}</p>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Criado em: {formatDateTime(reservation.createdAt)}
                      </p>
                    </div>
                  </div>

                  {reservation.status === 'confirmed' && canConfirmUsage(reservation) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleConfirmUsage(reservation)}
                        className="w-full py-2 bg-[#03012C] text-white text-sm font-semibold rounded-lg hover:bg-[#058ED9] transition"
                      >
                        Confirmar Uso
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showConfirmModal && selectedReservation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-[#03012C] mb-4">Confirmar Uso do Espaço</h2>
              <p className="text-gray-600 mb-6">
                Você está confirmando que utilizou o espaço <strong>{selectedReservation.spaceName}</strong> no dia <strong>{formatDate(selectedReservation.date)}</strong> no horário <strong>{getHourRange(selectedReservation.hours)}</strong>.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Esta confirmação é apenas indicativa. O sistema já liberou o espaço automaticamente após o horário final da reserva.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmUsage}
                  className="flex-1 py-3 bg-[#03012C] text-white font-semibold rounded-lg hover:bg-[#058ED9] transition"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessMessage && (
          <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-xl border-2 border-[#57CC99] p-4 z-50">
            <p className="text-sm font-semibold text-[#03012C]">Uso confirmado com sucesso!</p>
            <p className="text-xs text-gray-600 mt-1">A reserva foi marcada como finalizada.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReservations;
