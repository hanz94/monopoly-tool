import { db } from "./firebaseConfig";
import { child, get, ref, serverTimestamp, set } from "firebase/database";

type NewGameOptions = {
    currency: string;
    initialBalance: number;
    crossStartBonus: number;
    numberOfPlayers: number;
    playerNames: string[];
}

//get random integer (both min and max included)
const getRandomInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const checkIdExists = (id: number): Promise<boolean> => {
    return get(child(ref(db), `/ids/${id}`))
        .then((snapshot) => {
            return snapshot.exists();
        })
        .catch((error) => {
            console.error(error);
            throw new Error(`[checkIdExists] ${error.message}`); 
        });
};

const checkPlayerCodeExists = (playerCode: string): Promise<boolean> => {
    return get(child(ref(db), `/access/${playerCode}`))
        .then((snapshot) => {
            return snapshot.exists();
        })
        .catch((error) => {
            console.error(error);
            throw new Error(`[checkPlayerCodeExists] ${error.message}`); 
        });
}

const createRandomPlayerCode = (length = 6) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result.toUpperCase();
}

export const createGame = async (newGameOptions: NewGameOptions) => {
        
    // Create new random game id
        let newId = getRandomInteger(100000, 999999);

    //Make sure id doesn't already exist in database
        let idExists;
        idExists = await checkIdExists(newId);
        // console.log(idExists);
        while (idExists) {
            newId = getRandomInteger(100000, 999999);
            idExists = await checkIdExists(newId);
            console.log(idExists);
        }

    // Add new id in database with transactionHistory
    set(ref(db, `/ids/${newId}/transactionHistory`), 0).catch((error) => {
        console.error(error);
    });

    // Create playerCode for each player
    const playerNames = newGameOptions.playerNames;
    const newPlayerCodes = [];
    for (const _ of playerNames) {
        let newPlayerCode = createRandomPlayerCode();
        let playerCodeExists;
        playerCodeExists = await checkPlayerCodeExists(newPlayerCode);
        while (playerCodeExists) {
            newPlayerCode = createRandomPlayerCode();
            playerCodeExists = await checkPlayerCodeExists(newPlayerCode);
        }
        newPlayerCodes.push(newPlayerCode);
    }
    const newThisPlayerCode = newPlayerCodes[0];

    //TODO: set new token (uuidv4)
    const newToken = "empty";

    let playersDbObj: any = {};
    newPlayerCodes.forEach( (playerCode, index) => {
        playersDbObj[playerCode] = {
            name: playerNames[index],
            isBank: index == 0 ? "owner" : "false",
            balance: newGameOptions.initialBalance,
            status: "offline"
        }

        set(ref(db, `/access/${playerCode}`), {
            gameID: newId,
            token: newToken,
            notifications: { 1: { id: 1, type: "info", textPrimary: "Witamy w grze!", textSecondary: `Rozpoczynasz grę z kwotą ${newGameOptions.initialBalance} ${newGameOptions.currency}.`, timestamp: serverTimestamp(), read: false }}
        }).catch((error) => {
            console.error(error);
        });
    })

    // Add new games/game-newId in database
    const dbGameOptions = (({ playerNames, ...rest }) => rest)(newGameOptions);
    set(ref(db, `/games/game-${newId}`), {
        ...dbGameOptions,
        players: playersDbObj,
        whenCreated: Math.floor(Date.now() / 1000),
        whenExpired: Math.floor(Date.now() / 1000 + 604800)  //1 week

    });

    return {newId, newThisPlayerCode, newToken};
};


