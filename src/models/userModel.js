
class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}

const users = [
    new User(1, 'John Doe', 'john@example.com'),
    new User(2, 'Jane Doe', 'jane@example.com')
];

export const findAll = async () => {
    return users;
};

export const findById = async (id) => {
    return users.find(u => u.id === parseInt(id));
};

export default User;
