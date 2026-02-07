// In a real app, this would be a database call or interaction with an ORM
// For now, it stays simple but separated in a service layer.

const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
];

export const getAllUsers = async () => {
    return users;
};

export const getUserById = async (id) => {
    return users.find(u => u.id === parseInt(id));
};
