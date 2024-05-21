import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('database.db');

export const setupDB = () => {
    db.transaction(tx => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY AUTOINCREMENT, designation TEXT, quantity INTEGER, image TEXT);",
            [],
            null,
            (_, error) => console.log(error)
        );
    });
};

export const savePhotoToDB = (designation, quantity, image, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            "INSERT INTO photos (designation, quantity, image) VALUES (?, ?, ?);",
            [designation, quantity, image],
            (_, result) => {
                const insertId = result.insertId;
                if (insertId) {
                    callback(true);
                } else {
                    callback(false);
                }
            },
            (_, error) => {
                console.log(error);
                callback(false);
            }
        );
    });
};

export const retrievePhotosFromDB = (callback) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM photos;",
        [],
        (_, result) => {
          const rows = result.rows;
          const photos = [];
          for (let i = 0; i < rows.length; i++) {
            photos.push(rows.item(i));
          }
          callback(photos);
        },
        (_, error) => {
          console.log(error);
          callback([]);
        }
      );
    });
  };
  

export const deletePhotoFromDB = (id, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            "DELETE FROM photos WHERE id = ?;",
            [id],
            (_, result) => {
                const rowsAffected = result.rowsAffected;
                if (rowsAffected > 0) {
                    callback(true);
                } else {
                    callback(false);
                }
            },
            (_, error) => {
                console.log(error);
                callback(false);
            }
        );
    });
};
export const modifPhotoFromDB = (id, newDesignation, newQuantity, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            "UPDATE photos SET designation = ?, quantity = ? WHERE id = ?;",
            [newDesignation, newQuantity, id],
            (_, result) => {
                const rowsAffected = result.rowsAffected;
                if (rowsAffected > 0) {
                    callback(true);
                } else {
                    callback(false);
                }
            },
            (_, error) => {
                console.log(error);
                callback(false);
            }
        );
    });
};
