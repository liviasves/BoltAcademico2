import { Monitor, CheckCircle, XCircle, Clock, Send } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

function SoftwareRequest() {
  const { software, addSoftware, currentUser } = useApp();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    description: '',
    category: '',
    type: 'free'
  });

  const myRequests = useMemo(() => {
    return (software || [])
      .filter(s => s.requestedBy === currentUser.id)
      .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
  }, [software, currentUser.id]);

  const stats = useMemo(() => {
    const pending = myRequests.filter(s => s.status === 'pending').length;
    const approved = myRequests.filter(s => s.status === 'approved').length;
    const rejected = myRequests.filter(s => s.status === 'rejected').length;

    return { pending, approved, rejected };
  }, [myRequests]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmitRequest = () => {
    if (!formData.name || !formData.version || !formData.category) {
      showToast('Por favor, preencha todos os campos obrigatórios', 'error');
      return;
    }

    const newRequest = {
      ...formData,
      status: 'pending',
      requestedBy: currentUser.id,
      requestDate: new Date().toISOString()
    };

    addSoftware(newRequest);
    showToast('Solicitação enviada com sucesso!', 'success');
    setShowRequestModal(false);
    setFormData({
      name: '',
      version: '',
      description: '',
      category: '',
      type: 'free'
    });
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#03012C] mb-2">Solicitar Software</h1>
            <p className="text-gray-600">Envie solicitações de instalação de softwares para os laboratórios</p>
          </div>
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-2 bg-[#03012C] hover:bg-[#058ED9] text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg"
          >
            <Send className="w-5 h-5" />
            Nova Solicitação
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
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

        <h2 className="text-2xl font-bold text-[#03012C] mb-6">Minhas Solicitações</h2>

        {myRequests.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border-2 border-gray-200 text-center">
            <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#03012C] mb-2">Nenhuma solicitação ainda</h3>
            <p className="text-gray-600 mb-4">Você ainda não enviou nenhuma solicitação de software.</p>
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-6 py-3 bg-[#03012C] hover:bg-[#058ED9] text-white font-semibold rounded-lg transition"
            >
              Enviar Primeira Solicitação
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {myRequests.map(sw => (
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

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-semibold text-[#03012C]">Categoria:</span>
                    <span>{sw.category || 'Não especificada'}</span>
                    <span className="font-semibold text-[#03012C] ml-4">Enviada em:</span>
                    <span>{new Date(sw.requestDate).toLocaleDateString('pt-BR')}</span>
                  </div>

                  {sw.status === 'approved' && sw.approvedDate && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                      <p className="text-green-800">
                        <strong>Aprovado em:</strong> {new Date(sw.approvedDate).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-green-700 mt-1">
                        O software está disponível nos laboratórios!
                      </p>
                    </div>
                  )}

                  {sw.status === 'rejected' && sw.rejectedDate && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                      <p className="text-red-800">
                        <strong>Rejeitado em:</strong> {new Date(sw.rejectedDate).toLocaleDateString('pt-BR')}
                      </p>
                      {sw.rejectionReason && (
                        <p className="text-red-700 mt-1">
                          <strong>Motivo:</strong> {sw.rejectionReason}
                        </p>
                      )}
                    </div>
                  )}

                  {sw.status === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                      <p className="text-yellow-800">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Aguardando análise do administrador
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-[#03012C]">Nova Solicitação de Software</h2>
              <button
                onClick={() => setShowRequestModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#03012C] mb-2">
                  Nome do Software *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Visual Studio Code"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Versão *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 1.85.0"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Categoria *
                  </label>
                  <select
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    <option value="Desenvolvimento">Desenvolvimento</option>
                    <option value="Design">Design</option>
                    <option value="Produtividade">Produtividade</option>
                    <option value="Educação">Educação</option>
                    <option value="Redes">Redes</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Banco de Dados">Banco de Dados</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#03012C] mb-2">
                  Tipo *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="free"
                      checked={formData.type === 'free'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-4 h-4 accent-[#058ED9]"
                    />
                    <span className="text-sm text-gray-700">Livre</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="proprietary"
                      checked={formData.type === 'proprietary'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-4 h-4 accent-[#058ED9]"
                    />
                    <span className="text-sm text-gray-700">Proprietário</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#03012C] mb-2">
                  Justificativa *
                </label>
                <textarea
                  placeholder="Descreva por que este software é necessário e como será utilizado nas aulas..."
                  rows="4"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitRequest}
                  className="flex-1 bg-[#03012C] hover:bg-[#058ED9] text-white font-bold py-3 rounded-lg transition"
                >
                  Enviar Solicitação
                </button>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className={`rounded-lg shadow-2xl px-6 py-4 flex items-center gap-3 min-w-[300px] ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-white flex-shrink-0" />
            )}
            <p className="text-white font-semibold">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SoftwareRequest;
