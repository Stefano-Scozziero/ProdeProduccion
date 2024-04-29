import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('sessions.db')

export const init = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS sessionUser (localId TEXT NOT NULL, email TEXT NOT NULL, idToken TEXT NOT NULL, image TEXT NULL, name TEXT NULL, updateAt INTEGER)',
                [],
                () => {
                    tx.executeSql(
                        `CREATE TABLE IF NOT EXISTS fixtures (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            fecha TEXT NOT NULL,
                            hasPlayed INTEGER NOT NULL,  /* 0 for false, 1 for true */
                            equipo1_nombre TEXT NOT NULL,
                            equipo1_imagen TEXT NOT NULL,
                            equipo1_puntos INTEGER NOT NULL,
                            equipo2_nombre TEXT NOT NULL,
                            equipo2_imagen TEXT NOT NULL,
                            equipo2_puntos INTEGER NOT NULL
                        )`,
                        [],
                        (_, result) => resolve(result),
                        (_, err) => reject(err)
                    );
                },
                (_, err) => reject(err)
            );
        });
    });
    return promise;
};


export const insertSession = ({localId,email,idToken, image, name, updateAt}) => {
    const promise = new Promise((resolve,reject)=>{
        db.transaction(tx =>{
            tx.executeSql(
                "INSERT INTO sessionUser (localId,email,idToken,image,name,updateAt) VALUES (?,?,?,?,?,strftime('%s', 'now'))",
                [localId,email,idToken, image, name, updateAt],
                (_,result)=> resolve(result),
                (_,result)=> reject(result)
                )
        })
    })
    return promise
}

export const fetchSession = () => {
    const promise = new Promise((resolve,reject)=>{
        db.transaction(tx =>{
            tx.executeSql(
                'SELECT * FROM sessionUser',
                [],
                (_,result)=> resolve(result),
                (_,result)=> reject(result)
                )
        })
    })
    return promise
}

export const deleteSession = () => {
    const promise = new Promise((resolve,reject)=>{
        db.transaction(tx =>{
            tx.executeSql(
                'DELETE FROM sessionUser',
                [],
                (_,result)=> resolve(result),
                (_,result)=> reject(result)
                )
        })
    })
    return promise
}