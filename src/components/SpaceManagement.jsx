import { Building, MapPin, Users, Monitor, Plus, Edit2, Trash2, X, Power, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';

function SpaceManagement() {
  const { spaces, addSpace, updateSpace, deleteSpace } = useApp();
  const { showError, showSuccess, confirm } = useNotification();
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const hours = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00', '22:00'
  ];

  const [formData, setFormData] = useState({
    code: '',
    type: 'laboratory',
    name: '',
    capacity: '',
    location: '',
    description: '',
    status: 'active',
    software: [],
    schedule: {
      'segunda-feira': [],
      'terça-feira': [],
      'quarta-feira': [],
      'quinta-feira': [],
      'sexta-feira': [],
      'sábado': [],
      'domingo': []
    }
  });

  const [newSoftware, setNewSoftware] = useState('');
  const [selectedHours, setSelectedHours] = useState({
    'segunda-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
    'terça-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
    'quarta-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
    'quinta-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
    'sexta-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
    'sábado': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
    'domingo': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {})
  });

  const filteredSpaces = useMemo(() => {
    let filtered = spaces || [];

    if (searchTerm) {
      filtered = filtered.filter(space =>
        space.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        space.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        space.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(space => space.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(space => space.type === typeFilter);
    }

    return filtered;
  }, [spaces, searchTerm, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const allSpaces = spaces || [];
    const totalSpaces = allSpaces.length;
    const activeSpaces = allSpaces.filter(s => s.status === 'active').length;
    const inactiveSpaces = allSpaces.filter(s => s.status === 'inactive').length;
    const laboratories = allSpaces.filter(s => s.type === 'laboratory').length;
    const classrooms = allSpaces.filter(s => s.type === 'classroom').length;

    return { totalSpaces, activeSpaces, inactiveSpaces, laboratories, classrooms };
  }, [spaces]);

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'laboratory',
      name: '',
      capacity: '',
      location: '',
      description: '',
      status: 'active',
      software: [],
      schedule: {
        'segunda-feira': [],
        'terça-feira': [],
        'quarta-feira': [],
        'quinta-feira': [],
        'sexta-feira': [],
        'sábado': [],
        'domingo': []
      }
    });
    setSelectedHours({
      'segunda-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
      'terça-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
      'quarta-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
      'quinta-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
      'sexta-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
      'sábado': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
      'domingo': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {})
    });
    setNewSoftware('');
  };

  const handleAddSoftware = () => {
    if (newSoftware.trim() && !formData.software.includes(newSoftware.trim())) {
      setFormData({
        ...formData,
        software: [...formData.software, newSoftware.trim()]
      });
      setNewSoftware('');
    }
  };

  const handleRemoveSoftware = (index) => {
    setFormData({
      ...formData,
      software: formData.software.filter((_, i) => i !== index)
    });
  };

  const convertHoursToArray = (dayHours) => {
    return hours.filter(hour => dayHours[hour]);
  };

  const handleSubmitNew = () => {
    if (!formData.code || !formData.name || !formData.capacity || !formData.location) {
      showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const schedule = {};
    Object.keys(selectedHours).forEach(day => {
      schedule[day] = convertHoursToArray(selectedHours[day]);
    });

    const newSpace = {
      ...formData,
      capacity: parseInt(formData.capacity),
      schedule
    };

    addSpace(newSpace);
    showSuccess('Espaço cadastrado com sucesso!');
    setShowNewModal(false);
    resetForm();
  };

  const handleEdit = (space) => {
    setEditingSpace(space);
    setFormData({
      code: space.code,
      type: space.type,
      name: space.name,
      capacity: space.capacity.toString(),
      location: space.location,
      description: space.description || '',
      status: space.status,
      software: [...(space.software || [])],
      schedule: space.schedule
    });

    const newSelectedHours = {
      'segunda-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
      'terça-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
      'quarta-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
      'quinta-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
      'sexta-feira': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
      'sábado': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {}),
      'domingo': hours.reduce((acc, hour) => ({ ...acc, [hour]: false }), {})
    };

    Object.keys(space.schedule || {}).forEach(day => {
      const dayHours = space.schedule[day];
      dayHours.forEach(hour => {
        if (newSelectedHours[day] && newSelectedHours[day][hour] !== undefined) {
          newSelectedHours[day][hour] = true;
        }
      });
    });

    setSelectedHours(newSelectedHours);
    setShowEditModal(true);
  };

  const handleSubmitEdit = () => {
    if (!formData.code || !formData.name || !formData.capacity || !formData.location) {
      showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const schedule = {};
    Object.keys(selectedHours).forEach(day => {
      schedule[day] = convertHoursToArray(selectedHours[day]);
    });

    const updatedSpace = {
      code: formData.code,
      type: formData.type,
      name: formData.name,
      capacity: parseInt(formData.capacity),
      location: formData.location,
      description: formData.description,
      status: formData.status,
      software: formData.software,
      schedule
    };

    updateSpace(editingSpace.id, updatedSpace);
    showSuccess('Espaço atualizado com sucesso!');
    setShowEditModal(false);
    setEditingSpace(null);
    resetForm();
  };

  const handleToggleStatus = (space) => {
    const newStatus = space.status === 'active' ? 'inactive' : 'active';
    updateSpace(space.id, { status: newStatus });
    showSuccess(`Espaço ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso!`);
  };

  const handleDelete = async (spaceId) => {
    const confirmed = await confirm('Tem certeza que deseja excluir este espaço?');
    if (confirmed) {
      deleteSpace(spaceId);
      showSuccess('Espaço excluído com sucesso!');
    }
  };

  return (
    <div className="flex-1 p-8 overflow-auto bg-[#F5EFED]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#03012C] mb-2">Gerenciamento de Espaços</h1>
            <p className="text-gray-600">Gerencie salas de aula e laboratórios de informática</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowNewModal(true);
            }}
            className="flex items-center gap-2 bg-[#03012C] hover:bg-[#058ED9] text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Novo Espaço
          </button>
        </div>

        <div className="grid grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Total de Espaços</h3>
              <Building className="w-5 h-5 text-[#058ED9]" />
            </div>
            <div className="text-3xl font-bold text-[#03012C]">{stats.totalSpaces}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-[#57CC99] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Ativos</h3>
              <div className="w-6 h-6 rounded-full bg-[#57CC99] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>
            <div className="text-3xl font-bold text-[#57CC99]">{stats.activeSpaces}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-red-300 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Inativos</h3>
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>
            <div className="text-3xl font-bold text-red-500">{stats.inactiveSpaces}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Laboratórios</h3>
              <Monitor className="w-5 h-5 text-[#058ED9]" />
            </div>
            <div className="text-3xl font-bold text-[#03012C]">{stats.laboratories}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Salas de Aula</h3>
              <Building className="w-5 h-5 text-[#058ED9]" />
            </div>
            <div className="text-3xl font-bold text-[#03012C]">{stats.classrooms}</div>
          </div>
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
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#058ED9] transition bg-white"
            >
              <option value="all">Todos os tipos</option>
              <option value="classroom">Salas de Aula</option>
              <option value="laboratory">Laboratórios</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#058ED9] transition bg-white"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>

        {filteredSpaces.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border-2 border-gray-200 text-center">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#03012C] mb-2">Nenhum espaço encontrado</h3>
            <p className="text-gray-600">Não há espaços que correspondam aos filtros selecionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredSpaces.map(space => (
              <div key={space.id} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-[#03012C] text-white text-xs font-bold rounded">{space.code}</span>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${
                          space.status === 'active'
                            ? 'bg-[#57CC99] text-white'
                            : 'bg-red-500 text-white'
                        }`}>
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                          {space.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#03012C] mb-2">{space.name}</h3>
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        {space.type === 'laboratory' ? <Monitor className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                        {space.type === 'laboratory' ? 'Laboratório' : 'Sala de Aula'}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{space.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-[#058ED9]" />
                      <span className="font-semibold text-[#03012C]">Capacidade:</span>
                      <span className="text-gray-700">{space.capacity} pessoas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-[#058ED9]" />
                      <span className="font-semibold text-[#03012C]">Localização:</span>
                      <span className="text-gray-700">{space.location}</span>
                    </div>
                  </div>

                  {space.software && space.software.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-[#03012C] mb-2">Softwares:</p>
                      <div className="flex flex-wrap gap-2">
                        {space.software.map((sw, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#058ED9] text-white text-xs rounded-full">{sw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleToggleStatus(space)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold ${
                        space.status === 'active'
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-[#57CC99] hover:bg-[#4AB889] text-white'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                      {space.status === 'active' ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      onClick={() => handleEdit(space)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#058ED9] hover:bg-[#057AB5] text-white rounded-lg transition font-semibold"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(space.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                    Código *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: LAB101"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Tipo *
                  </label>
                  <select
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="laboratory">Laboratório</option>
                    <option value="classroom">Sala de Aula</option>
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
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
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              {formData.type === 'laboratory' && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Softwares Instalados
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.software.map((software, index) => (
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
              )}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#03012C] mb-3">
                  Horários Disponíveis por Dia da Semana
                </label>
                {Object.keys(selectedHours).map(day => (
                  <div key={day} className="mb-4">
                    <h4 className="text-sm font-semibold text-[#03012C] mb-2 capitalize">{day}</h4>
                    <div className="grid grid-cols-8 gap-2">
                      {hours.map((hour) => (
                        <label key={hour} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-[#058ED9]"
                            checked={selectedHours[day][hour]}
                            onChange={(e) =>
                              setSelectedHours({
                                ...selectedHours,
                                [day]: { ...selectedHours[day], [hour]: e.target.checked }
                              })
                            }
                          />
                          <span className="text-xs text-gray-700">{hour}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitNew}
                  className="flex-1 bg-[#03012C] hover:bg-[#058ED9] text-white font-bold py-3 rounded-lg transition"
                >
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                    Código *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Tipo *
                  </label>
                  <select
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="laboratory">Laboratório</option>
                    <option value="classroom">Sala de Aula</option>
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Localização *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              {formData.type === 'laboratory' && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#03012C] mb-2">
                    Softwares Instalados
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.software.map((software, index) => (
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
              )}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#03012C] mb-3">
                  Horários Disponíveis por Dia da Semana
                </label>
                {Object.keys(selectedHours).map(day => (
                  <div key={day} className="mb-4">
                    <h4 className="text-sm font-semibold text-[#03012C] mb-2 capitalize">{day}</h4>
                    <div className="grid grid-cols-8 gap-2">
                      {hours.map((hour) => (
                        <label key={hour} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-[#058ED9]"
                            checked={selectedHours[day][hour]}
                            onChange={(e) =>
                              setSelectedHours({
                                ...selectedHours,
                                [day]: { ...selectedHours[day], [hour]: e.target.checked }
                              })
                            }
                          />
                          <span className="text-xs text-gray-700">{hour}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitEdit}
                  className="flex-1 bg-[#03012C] hover:bg-[#058ED9] text-white font-bold py-3 rounded-lg transition"
                >
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
