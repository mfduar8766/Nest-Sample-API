// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fs } = require('fs');

const removeFile = (path) => {
  try {
    fs.unlinkSync(path);
  } catch (error) {
    console.error('Delete File Error: ', error);
  }
};

(async () => {
  const dbFile = 'mongo-seed/initDb.json';
  const dbUsers = JSON.stringify(
    [
      {
        roles: ['ADMIN', 'SUPER_USER'],
        userName: '',
        firstName: 'John',
        lastName: 'Doe',
        age: 29,
        email: 'john@gmail.com',
        password: 'testPassword21!',
        createdAt: Date.now(),
        updatedAt: null,
        activationCode: '',
      },
      {
        roles: ['ADMIN'],
        userName: '',
        firstName: 'Jane',
        lastName: 'Doe',
        age: 29,
        email: 'jane@gmail.com',
        password: 'testIIPassword21!',
        createdAt: Date.now(),
        updatedAt: null,
        activationCode: '',
      },
    ],
    null,
    4,
  );
  try {
    if (fs.existsSync(dbFile)) {
      removeFile(dbFile);
    }
    fs.writeFileSync(dbFile, dbUsers);
  } catch (error) {
    console.error(
      'Create DBName: sample with collection: users error: ',
      error,
    );
  }
})();
