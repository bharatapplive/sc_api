import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
  listOfUsers = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'John Doe1', email: 'john.doe1@example.com' },
    { id: 3, name: 'John Doe2', email: 'john.doe2@example.com' },
    { id: 4, name: 'John Doe3', email: 'john.doe3@example.com' },
    { id: 5, name: 'John Doe4', email: 'john.doe4@example.com' },
    { id: 6, name: 'John Doe5', email: 'john.doe5@example.com' },
    { id: 7, name: 'John Doe6', email: 'john.doe6@example.com' },
    { id: 8, name: 'John Doe7', email: 'john.doe7@example.com' },
    { id: 9, name: 'John Doe8', email: 'john.doe8@example.com' },
  ];// this all will come from DB

  getAllUsers() {
    // we will show all users from DB in future, for now we are returning static data
    return this.listOfUsers;
  }

  getUserById(id: number) {
    // we will find a user by ID from DB in future, for now we are searching in static data
    return this.listOfUsers.find((user) => user.id === id);
  }
}
