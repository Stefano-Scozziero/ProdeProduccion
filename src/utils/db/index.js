import * as SQLite from 'expo-sqlite/legacy'

const db = SQLite.openDatabase('sessions.db')

export const init = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS sessionUser (localId TEXT NOT NULL, email TEXT NOT NULL, idToken TEXT NOT NULL, image TEXT NULL, name TEXT NULL, isAdmin INTEGER NOT NULL, emailVerified INTEGER NOT NULL, updateAt INTEGER)',
                [],
                resolve,
                (_, err) => reject(err)
            )
        })
    })
    return promise
}

export const insertSession = ({ localId, email, idToken, image, name, isAdmin, emailVerified }) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO sessionUser (localId, email, idToken, image, name, isAdmin, emailVerified, updateAt) VALUES (?,?,?,?,?,?,?,strftime('%s', 'now'))",
                [localId, email, idToken, image, name, isAdmin ? 1 : 0, emailVerified ? 1 : 0],
                (_, result) => resolve(result),
                (_, err) => reject(err)
            )
        })
    })
    return promise
}

export const fetchSession = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM sessionUser',
                [],
                (_, result) => resolve(result),
                (_, err) => reject(err)
            )
        })
    })
    return promise
}

export const deleteSession = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM sessionUser',
                [],
                (_, result) => resolve(result),
                (_, err) => reject(err)
            )
        })
    })
    return promise
}
