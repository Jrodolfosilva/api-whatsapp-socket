import makeWASocket,{DisconnectReason, useMultiFileAuthState} from '@whiskeysockets/baileys'
import { stringify } from 'querystring';

async function goWhatsApp (key:number) {
    
    
    const {saveCreds,state} = await useMultiFileAuthState(`./db_auth/${key}`)
    const sock =  makeWASocket({
        printQRInTerminal: true,
        auth:state
    })

    sock?.ev.on('connection.update', async(update)=>{
        
        const {connection,lastDisconnect,qr}= update;
        const shuldReconnect = lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut.toString()
        if(qr){
            console.log(qr)
            
        }else if(connection === 'close' && shuldReconnect ){
            const keyRandom = Math.floor(Math.random()*10)
            goWhatsApp(keyRandom) 
        }
        else if(connection === 'close' && !shuldReconnect){
            goWhatsApp(key)
        }
        else if(connection === 'open') {
            console.log(`CONECTADO A INSTANCIA ${key}`)
        }

        

    });

    sock?.ev.on('creds.update',saveCreds)

    sock?.ev.on('messages.upsert',async(m)=>{
        const remoteJid = m?.messages[0].key.remoteJid;
        const notify = m?.type;
        const fromMe = m?.messages[0].key.fromMe;
        const message = m?.messages[0].message?.conversation;

        if(notify && !fromMe && typeof(remoteJid) === 'string'){
            await sock?.sendMessage(remoteJid,{text:"Olá, tudo bem?"})

        }
    })





}

goWhatsApp(4515)

