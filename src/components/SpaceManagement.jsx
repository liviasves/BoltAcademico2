import { Building, MapPin, Users, Monitor, Plus, Edit2, Trash2, X, Power } from 'lucide-react';
import { useState } from 'react';

function SpaceManagement() {
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const hours = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00'
  ];

  const [formData, setFormData] = useState({
    sigla: '',
    tipo: 'Laboratório',
    nome: '',
    capacidade: '',
    localizacao: '',
    descricao: '',
    horarios: hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
    softwares: []
  });

  const [editData, setEditData] = useState({
    sigla: 'LAB101',
    tipo: 'Laboratório',
    nome: 'Laboratório de Informática 101',
    capacidade: '30',
    localizacao: 'Bloco A - 1º Andar',
    descricao: 'Laboratório com 30 computadores Dell',
    horarios: hours.reduce((acc, hour) => ({ ...acc, [hour]: true }), {}),
    softwares: ['Windows 11', 'Office 365', 'Visual Studio', 'Adobe Creative Suite']
  });

  const [newSoftware, setNewSoftware] = useState('');

  const handleAddSoftware = () => {
    if (newSoftware.trim()) {
      setEditData({
        ...editData,
        softwares: [...editData.softwares, newSoftware.trim()]
      });
      setNewSoftware('');
    }
  };

  const handleRemoveSoftware = (index) => {
    setEditData({
      ...editData,
      softwares: editData.softwares.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#03012C] mb-2">Gerenciamento de Espaços</h1>
            <p className="text-gray-600">Gerencie salas de aula e laboratórios de informática</p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 bg-[#03012C] hover:bg-[#058ED9] text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Novo Espaço
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Total de Espaços</h3>
              <Building className="w-5 h-5 text-[#058ED9]" />
            </div>
            <div className="text-3xl font-bold text-[#03012C]">1</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-[#57CC99] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Ativos</h3>
              <div className="w-6 h-6 rounded-full bg-[#57CC99] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>
            <div className="text-3xl font-bold text-[#57CC99]">1</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Inativos</h3>
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>
            <div className="text-3xl font-bold text-red-500">0</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Laboratórios</h3>
              <Monitor className="w-5 h-5 text-[#058ED9]" />
            </div>
            <div className="text-3xl font-bold text-[#03012C]">1</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-[#03012C] text-white text-xs font-bold rounded">LAB101</span>
                    <span className="px-3 py-1 bg-[#57CC99] text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                      Ativo
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#03012C] mb-2">Laboratório de Informática 101</h3>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Laboratório
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{editData.descricao}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-[#058ED9]" />
                  <span className="font-semibold text-[#03012C]">Capacidade:</span>
                  <span className="text-gray-700">30 pessoas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#058ED9]" />
                  <span className="font-semibold text-[#03012C]">Localização:</span>
                  <span className="text-gray-700">{editData.localizacao}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-[#03012C] mb-2">Softwares:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#058ED9] text-white text-xs rounded-full">Windows 11</span>
                  <span className="px-3 py-1 bg-[#57CC99] text-white text-xs rounded-full">Office 365</span>
                  <span className="px-3 py-1 bg-[#80ED99] text-[#03012C] text-xs rounded-full">Visual Studio</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-semibold">
                  <Power className="w-4 h-4" />
                  Desativar
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#058ED9] hover:bg-[#057AB5] text-white rounded-lg transition font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-semibold">
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#03012C]">Cadastrar Novo Espaço Acadêmico</h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Sigla *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: LAB101"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={formData.sigla}
                    onChange={(e) => setFormData({ ...formData, sigla: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Tipo *
                  </label>
                  <select
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  >
                    <option>Laboratório</option>
                    <option>Sala de Aula</option>
                    <option>Auditório</option>
                    <option>Biblioteca</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#03012C] mb-2">
                  Nome do Espaço *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Laboratório de Informática 101"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Capacidade *
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 30"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={formData.capacidade}
                    onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Localização *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Bloco A - 1º Andar"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#03012C] mb-2">
                  Descrição
                </label>
                <textarea
                  placeholder="Descreva o espaço acadêmico..."
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent resize-none"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#03012C] mb-3">
                  Horários Disponíveis
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {hours.map((hour) => (
                    <label key={hour} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-[#058ED9]"
                        checked={formData.horarios[hour]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            horarios: { ...formData.horarios, [hour]: e.target.checked }
                          })
                        }
                      />
                      <span className="text-sm text-gray-700">{hour}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-[#03012C] hover:bg-[#058ED9] text-white font-bold py-3 rounded-lg transition">
                  Cadastrar Espaço
                </button>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#03012C]">Editar Espaço Acadêmico</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Sigla *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={editData.sigla}
                    onChange={(e) => setEditData({ ...editData, sigla: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Tipo *
                  </label>
                  <select
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={editData.tipo}
                    onChange={(e) => setEditData({ ...editData, tipo: e.target.value })}
                  >
                    <option>Laboratório</option>
                    <option>Sala de Aula</option>
                    <option>Auditório</option>
                    <option>Biblioteca</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#03012C] mb-2">
                  Nome do Espaço *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                  value={editData.nome}
                  onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Capacidade *
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={editData.capacidade}
                    onChange={(e) => setEditData({ ...editData, capacidade: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Localização *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={editData.localizacao}
                    onChange={(e) => setEditData({ ...editData, localizacao: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#03012C] mb-2">
                  Descrição
                </label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent resize-none"
                  value={editData.descricao}
                  onChange={(e) => setEditData({ ...editData, descricao: e.target.value })}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#03012C] mb-2">
                  Softwares Instalados
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editData.softwares.map((software, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#058ED9] text-white text-sm rounded-full flex items-center gap-2"
                    >
                      {software}
                      <button
                        onClick={() => handleRemoveSoftware(index)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Adicionar novo software..."
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={newSoftware}
                    onChange={(e) => setNewSoftware(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSoftware()}
                  />
                  <button
                    onClick={handleAddSoftware}
                    className="px-4 py-2 bg-[#57CC99] hover:bg-[#4AB889] text-white rounded-lg transition font-semibold"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#03012C] mb-3">
                  Horários Disponíveis
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {hours.map((hour) => (
                    <label key={hour} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-[#058ED9]"
                        checked={editData.horarios[hour]}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            horarios: { ...editData.horarios, [hour]: e.target.checked }
                          })
                        }
                      />
                      <span className="text-sm text-gray-700">{hour}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-[#03012C] hover:bg-[#058ED9] text-white font-bold py-3 rounded-lg transition">
                  Salvar Alterações
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
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

export default SpaceManagement;
