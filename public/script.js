/**
 * Code pour une messagerie instantanée en Node.JS + socket.io
 * inspiré du blog https://blog.crowdbotics.com/build-chat-app-with-nodejs-socket-io/
 * Partie Client : modification pour gestion des messages en JSON
 * @author David ROUMANET <david.roumanet@ac-grenoble.fr>
 * @version 1.0.0
 */

 const socket = io()

 const chat = document.querySelector('.chat-form')
 const MsgName = document.querySelector('.chat-name')
 const MsgMessage = document.querySelector('.chat-input')
 const chatWindow = document.querySelector('.chat-window')
 
 // Ajout d'un événement de gestion du formulaire
 let spam
 chat.addEventListener('submit', event => {
   event.preventDefault()
   let msg = MsgMessage.value
   let nom = MsgName.value
   if (msg != spam) {
     if (msg.length > 2 && nom.length > 2 && msg.length < 20) {
       // Création de l'objet JSON a transmettre au serveur
       let fullMsg = `{"name":"${MsgName.value}", "message":"${MsgMessage.value}"}`
       socket.emit('chat', fullMsg)
     }
   }
   spam = MsgMessage.value
   MsgMessage.value = ''
 })
 
 // fonction d'ajout de message dans la partie 'render-message'
 const renderMessage = message => {
   const div = document.createElement('div')
   div.classList.add('render-message')
   div.innerHTML = message
   chatWindow.appendChild(div)
 }
 
 // Réception d'un message depuis le serveur
 socket.on('chat', message => {
   let JSONMsg = JSON.parse(message)
   console.log('From server: ', JSONMsg, JSONMsg.name)
   renderMessage("<strong>" + JSONMsg.name + "</strong> ► " + JSONMsg.message)
 })