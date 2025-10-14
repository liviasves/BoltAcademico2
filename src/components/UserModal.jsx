import { X, User, Mail, Lock, Shield, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

function UserModal({ user, onClose }) {
  const { addUser, updateUser } = useApp();
  const isEditing = !!user;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'professor',
    department: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
        role: user.role || 'professor',
        department: user.department || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    if (isEditing) {
      updateUser(user.id, formData);
    } else {
      addUser(formData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="bg-[#03012C] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {isEditing ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
              </h2>
              <p className="text-sm text-[#80ED99]">
                {isEditing ? 'Atualize as informações do usuário' : 'Preencha os dados do novo usuário'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-[#03012C] mb-2">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#058ED9]" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: João Silva"
                className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-[#03012C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent transition"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-[#03012C] mb-2">
              Perfil <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-[#058ED9]" />
              </div>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-[#03012C] focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent transition appearance-none bg-white"
                required
              >
                <option value="professor">Professor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[#03012C] mb-2">
              E-mail <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#058ED9]" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="usuario@academigold.com"
                className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-[#03012C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent transition"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-[#03012C] mb-2">
              Senha <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#058ED9]" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite a senha"
                className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-[#03012C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent transition"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-semibold text-[#03012C] mb-2">
              Escola/Departamento
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-[#058ED9]" />
              </div>
              <input
                id="department"
                name="department"
                type="text"
                value={formData.department}
                onChange={handleChange}
                placeholder="Ex: Escola de Tecnologia"
                className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-[#03012C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#058ED9] focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#03012C] font-semibold py-3 px-4 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#57CC99] hover:bg-[#4AB889] text-white font-semibold py-3 px-4 rounded-lg transition shadow-lg"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;
