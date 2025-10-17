import { Monitor, CheckCircle, XCircle, Clock, User, Calendar, Package, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';

function AdminSoftwareManagement() {
  const { software, approveSoftware, rejectSoftware, currentUser, getUserById } = useApp();
  const { showSuccess } = useNotification();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = useMemo(() => {
    const allSoftware = software || [];
    const total = allSoftware.length;
    const pending = allSoftware.filter(s => s.status === 'pending').length;
    const approved = allSoftware.filter(s => s.status === 'approved').length;
    const rejected = allSoftware.filter(s => s.status === 'rejected').length;

    return { total, pending, approved, rejected };
  }, [software]);

  const filteredSoftware = useMemo(() => {
    let filtered = software || [];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status === filterStatus);
    }

    return filtered.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
  }, [software, filterStatus]);

  const handleApproveClick = (softwareId) => {
    setConfirmAction({
      type: 'approve',
      softwareId,
      title: 'Confirmar Aprovação',
      message: 'Deseja realmente aprovar este software? Ele ficará disponível nos laboratórios.'
    });
    setShowConfirmModal(true);
  };

  const handleRejectClick = (softwareId) => {
    setConfirmAction({
      type: 'reject',
      softwareId,
      title: 'Confirmar Rejeição',
      message: 'Deseja realmente rejeitar esta solicitação?'
    });
    setRejectionReason('');
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction.type === 'approve') {
      approveSoftware(confirmAction.softwareId, currentUser.id);
      showSuccess('Software aprovado com sucesso!');
    } else if (confirmAction.type === 'reject') {
      rejectSoftware(confirmAction.softwareId, currentUser.id, rejectionReason || 'Sem motivo especificado');
      showSuccess('Solicitação rejeitada com sucesso');
    }

    setShowConfirmModal(false);
    setConfirmAction(null);
    setRejectionReason('');
  };

  const handleCancelAction = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setRejectionReason('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pendente
          </span>
        );
      case 'approved':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Aprovado
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejeitado
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type) => {
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${
        type === 'free'
          ? 'bg-[#80ED99] text-[#03012C]'
          : 'bg-[#058ED9] text-white'
      }`}>
        {type === 'free' ? 'Livre' : 'Proprietário'}
      </span>
    );
  };

  return (
    <div className="flex-1 p-8 overflow-auto bg-[#F5EFED]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#03012C] mb-2">Solicitações de Softwares</h1>
            <p className="text-gray-600">Gerencie as solicitações de instalação de softwares enviadas pelos professores</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Total de Solicitações</h3>
              <Package className="w-5 h-5 text-[#058ED9]" />
            </div>
            <div className="text-3xl font-bold text-[#03012C]">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-yellow-300 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Pendentes</h3>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-green-300 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Aprovadas</h3>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-red-300 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Rejeitadas</h3>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 mb-6 border-2 border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === 'all'
                  ? 'bg-[#03012C] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Aprovadas
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejeitadas
            </button>
          </div>
        </div>

        {filteredSoftware.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border-2 border-gray-200 text-center">
            <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#03012C] mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-gray-600">Não há solicitações com o filtro selecionado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredSoftware.map(sw => {
              const requester = getUserById(sw.requestedBy);

              return (
                <div key={sw.id} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-[#058ED9] rounded-lg flex items-center justify-center">
                            <Monitor className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-[#03012C]">{sw.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusBadge(sw.status)}
                              {getTypeBadge(sw.type || 'free')}
                              <span className="text-xs text-gray-500">v{sw.version}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{sw.description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#058ED9]" />
                        <span className="font-semibold text-[#03012C]">Categoria:</span>
                        <span className="text-gray-700">{sw.category || 'Não especificada'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#058ED9]" />
                        <span className="font-semibold text-[#03012C]">Solicitante:</span>
                        <span className="text-gray-700">{requester?.name || 'Desconhecido'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#058ED9]" />
                        <span className="font-semibold text-[#03012C]">Data:</span>
                        <span className="text-gray-700">
                          {new Date(sw.requestDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {sw.status === 'approved' && sw.approvedDate && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm">
                        <p className="text-green-800">
                          <strong>Aprovado em:</strong> {new Date(sw.approvedDate).toLocaleDateString('pt-BR')} por {getUserById(sw.approvedBy)?.name || 'Admin'}
                        </p>
                      </div>
                    )}

                    {sw.status === 'rejected' && sw.rejectedDate && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm">
                        <p className="text-red-800">
                          <strong>Rejeitado em:</strong> {new Date(sw.rejectedDate).toLocaleDateString('pt-BR')} por {getUserById(sw.rejectedBy)?.name || 'Admin'}
                        </p>
                        {sw.rejectionReason && (
                          <p className="text-red-700 mt-1">
                            <strong>Motivo:</strong> {sw.rejectionReason}
                          </p>
                        )}
                      </div>
                    )}

                    {sw.status === 'pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproveClick(sw.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition font-semibold"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Aprovar
                        </button>
                        <button
                          onClick={() => handleRejectClick(sw.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-semibold"
                        >
                          <XCircle className="w-4 h-4" />
                          Rejeitar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  confirmAction.type === 'approve' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {confirmAction.type === 'approve' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-[#03012C]">{confirmAction.title}</h2>
              </div>

              <p className="text-gray-700 mb-4">{confirmAction.message}</p>

              {confirmAction.type === 'reject' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Motivo da rejeição (opcional)
                  </label>
                  <textarea
                    placeholder="Informe o motivo da rejeição..."
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent resize-none"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  ></textarea>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmAction}
                  className={`flex-1 font-bold py-3 rounded-lg transition text-white ${
                    confirmAction.type === 'approve'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Confirmar
                </button>
                <button
                  onClick={handleCancelAction}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminSoftwareManagement;
