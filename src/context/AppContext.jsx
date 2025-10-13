import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
};

const initialUsers = [
  {
    id: 1,
    name: 'João Silva',
    email: 'admin@academigold.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'professor@academigold.com',
    password: 'prof123',
    role: 'professor',
    department: 'Ciência da Computação',
    createdAt: new Date().toISOString()
  }
];

const initialSpaces = [
  {
    id: 1,
    code: 'LAB01',
    name: 'Laboratório de Informática 101',
    description: 'Laboratório equipado com 30 computadores de última geração',
    capacity: 30,
    location: 'Bloco A - 1º Andar',
    status: 'active',
    type: 'laboratory',
    software: ['Visual Studio Code', 'IntelliJ IDEA', 'Git', 'Node.js'],
    availableHours: {
      monday: ['07:00-12:00', '13:00-18:00', '19:00-22:00'],
      tuesday: ['07:00-12:00', '13:00-18:00', '19:00-22:00'],
      wednesday: ['07:00-12:00', '13:00-18:00', '19:00-22:00'],
      thursday: ['07:00-12:00', '13:00-18:00', '19:00-22:00'],
      friday: ['07:00-12:00', '13:00-18:00', '19:00-22:00'],
      saturday: ['08:00-12:00'],
      sunday: []
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    code: 'LAB02',
    name: 'Laboratório de Redes',
    description: 'Laboratório especializado em infraestrutura de redes',
    capacity: 25,
    location: 'Bloco A - 2º Andar',
    status: 'active',
    type: 'laboratory',
    software: ['Cisco Packet Tracer', 'Wireshark', 'GNS3'],
    availableHours: {
      monday: ['07:00-12:00', '13:00-18:00'],
      tuesday: ['07:00-12:00', '13:00-18:00'],
      wednesday: ['07:00-12:00', '13:00-18:00'],
      thursday: ['07:00-12:00', '13:00-18:00'],
      friday: ['07:00-12:00', '13:00-18:00'],
      saturday: [],
      sunday: []
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    code: 'SALA101',
    name: 'Sala de Aula 101',
    description: 'Sala de aula tradicional com projetor multimídia',
    capacity: 40,
    location: 'Bloco B - 1º Andar',
    status: 'inactive',
    type: 'classroom',
    software: [],
    availableHours: {
      monday: ['07:00-12:00', '13:00-18:00', '19:00-22:00'],
      tuesday: ['07:00-12:00', '13:00-18:00', '19:00-22:00'],
      wednesday: ['07:00-12:00', '13:00-18:00', '19:00-22:00'],
      thursday: ['07:00-12:00', '13:00-18:00', '19:00-22:00'],
      friday: ['07:00-12:00', '13:00-18:00', '19:00-22:00'],
      saturday: ['08:00-12:00'],
      sunday: []
    },
    createdAt: new Date().toISOString()
  }
];

const initialSoftware = [
  {
    id: 1,
    name: 'Visual Studio Code',
    version: '1.85',
    status: 'approved',
    requestedBy: 2,
    requestDate: new Date('2024-01-15').toISOString(),
    approvedDate: new Date('2024-01-16').toISOString(),
    approvedBy: 1,
    description: 'Editor de código moderno e versátil'
  },
  {
    id: 2,
    name: 'Adobe Photoshop',
    version: '2024',
    status: 'pending',
    requestedBy: 2,
    requestDate: new Date('2024-02-01').toISOString(),
    description: 'Software de edição de imagens profissional'
  }
];

const initialReservations = [
  {
    id: 1,
    spaceId: 1,
    userId: 2,
    date: '2024-09-08',
    startTime: '07:00',
    endTime: '12:00',
    status: 'completed',
    purpose: 'Aula de Programação Web',
    createdAt: new Date('2024-09-01').toISOString()
  },
  {
    id: 2,
    spaceId: 2,
    userId: 2,
    date: '2024-09-08',
    startTime: '07:00',
    endTime: '12:00',
    status: 'completed',
    purpose: 'Aula de Redes de Computadores',
    createdAt: new Date('2024-09-01').toISOString()
  },
  {
    id: 3,
    spaceId: 1,
    userId: 2,
    date: '2024-09-08',
    startTime: '07:00',
    endTime: '12:00',
    status: 'completed',
    purpose: 'Laboratório de Banco de Dados',
    createdAt: new Date('2024-09-01').toISOString()
  }
];

export function AppProvider({ children }) {
  const [users, setUsers] = useLocalStorage('academigold_users', initialUsers);
  const [spaces, setSpaces] = useLocalStorage('academigold_spaces', initialSpaces);
  const [software, setSoftware] = useLocalStorage('academigold_software', initialSoftware);
  const [reservations, setReservations] = useLocalStorage('academigold_reservations', initialReservations);
  const [currentUser, setCurrentUser] = useState(null);

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, message: 'Credenciais inválidas' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);
    return newUser;
  };

  const updateUser = (userId, userData) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...userData } : u));
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const addSpace = (spaceData) => {
    const newSpace = {
      ...spaceData,
      id: spaces.length > 0 ? Math.max(...spaces.map(s => s.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    };
    setSpaces([...spaces, newSpace]);
    return newSpace;
  };

  const updateSpace = (spaceId, spaceData) => {
    setSpaces(spaces.map(s => s.id === spaceId ? { ...s, ...spaceData } : s));
  };

  const deleteSpace = (spaceId) => {
    setSpaces(spaces.filter(s => s.id !== spaceId));
  };

  const addSoftware = (softwareData) => {
    const newSoftware = {
      ...softwareData,
      id: software.length > 0 ? Math.max(...software.map(s => s.id)) + 1 : 1,
      status: 'pending',
      requestDate: new Date().toISOString()
    };
    setSoftware([...software, newSoftware]);
    return newSoftware;
  };

  const updateSoftware = (softwareId, softwareData) => {
    setSoftware(software.map(s => s.id === softwareId ? { ...s, ...softwareData } : s));
  };

  const deleteSoftware = (softwareId) => {
    setSoftware(software.filter(s => s.id !== softwareId));
  };

  const approveSoftware = (softwareId, approvedBy) => {
    updateSoftware(softwareId, {
      status: 'approved',
      approvedDate: new Date().toISOString(),
      approvedBy
    });
  };

  const rejectSoftware = (softwareId, rejectedBy, reason) => {
    updateSoftware(softwareId, {
      status: 'rejected',
      rejectedDate: new Date().toISOString(),
      rejectedBy,
      rejectionReason: reason
    });
  };

  const addReservation = (reservationData) => {
    const newReservation = {
      ...reservationData,
      id: reservations.length > 0 ? Math.max(...reservations.map(r => r.id)) + 1 : 1,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    setReservations([...reservations, newReservation]);
    return newReservation;
  };

  const updateReservation = (reservationId, reservationData) => {
    setReservations(reservations.map(r => r.id === reservationId ? { ...r, ...reservationData } : r));
  };

  const cancelReservation = (reservationId) => {
    updateReservation(reservationId, {
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    });
  };

  const getReservationsByUser = (userId) => {
    return reservations.filter(r => r.userId === userId);
  };

  const getReservationsBySpace = (spaceId) => {
    return reservations.filter(r => r.spaceId === spaceId);
  };

  const getAvailableSpaces = () => {
    return spaces.filter(s => s.status === 'active');
  };

  const getSpaceById = (spaceId) => {
    return spaces.find(s => s.id === spaceId);
  };

  const getUserById = (userId) => {
    return users.find(u => u.id === userId);
  };

  const value = {
    users,
    spaces,
    software,
    reservations,
    currentUser,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
    addSpace,
    updateSpace,
    deleteSpace,
    addSoftware,
    updateSoftware,
    deleteSoftware,
    approveSoftware,
    rejectSoftware,
    addReservation,
    updateReservation,
    cancelReservation,
    getReservationsByUser,
    getReservationsBySpace,
    getAvailableSpaces,
    getSpaceById,
    getUserById
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
