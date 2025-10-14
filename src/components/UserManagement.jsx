import { Users, Plus, Mail, Shield, Building2, Edit2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import UserModal from './UserModal';

function UserManagement() {
  const { users } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const uniqueUsers = useMemo(() => {
    return Array.from(new Map(users.map(u => [u.id, u])).values());
  }, [users]);

  const stats = useMemo(() => {
    const professors = uniqueUsers.filter(u => u.role === 'professor').length;
    const admins = uniqueUsers.filter(u => u.role === 'admin').length;
    return {
      total: uniqueUsers.length,
      professors,
      admins
    };
  }, [uniqueUsers]);

  const handleNewUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <main className="flex-1 p-8 overflow-auto bg-[#F5EFED]">
      <div className="bg-[#03012C] rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciamento de Usuários</h1>
            <p className="text-[#80ED99]">
              Cadastre e gerencie os usuários do sistema AcademiGold
            </p>
          </div>
          <button
            onClick={handleNewUser}
            className="bg-[#57CC99] hover:bg-[#4AB889] text-white font-semibold px-6 py-3 rounded-lg transition flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Novo Usuário
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm text-[#80ED99]">Total de Usuários</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-3xl font-bold mb-1">{stats.professors}</div>
            <div className="text-sm text-[#80ED99]">Professores</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-3xl font-bold mb-1">{stats.admins}</div>
            <div className="text-sm text-[#80ED99]">Administradores</div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-[#03012C] mb-6">Usuários Cadastrados</h2>

        {uniqueUsers.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border-2 border-gray-200">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold">Nenhum usuário cadastrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#058ED9] hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#03012C] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#03012C]">{user.name}</h3>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                          user.role === 'admin'
                            ? 'bg-[#058ED9]/10 text-[#058ED9]'
                            : 'bg-[#57CC99]/10 text-[#57CC99]'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {user.role === 'admin' ? 'Administrador' : 'Professor'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-[#058ED9]" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.department && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4 text-[#058ED9]" />
                      <span className="truncate">{user.department}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleEditUser(user)}
                  className="w-full bg-[#03012C] hover:bg-[#058ED9] text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && (
        <UserModal
          user={editingUser}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
}

export default UserManagement;
