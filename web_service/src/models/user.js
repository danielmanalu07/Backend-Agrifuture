class Customer {
    constructor(id, name, email, password, phone, address, photo, remember_token) {
        this.id = id,
            this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.address = address;
        this.photo = photo;
        this.remember_token = remember_token;
    }
}

module.exports = Customer;