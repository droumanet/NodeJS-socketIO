/**
 * Code pour une messagerie instantanée en Node.JS + socket.io
 * inspiré du blog https://blog.crowdbotics.com/build-chat-app-with-nodejs-socket-io/
 * Partie Client : modification pour gestion des messages en JSON
 * @author David ROUMANET <david.roumanet@ac-grenoble.fr>
 * @version 1.1.0
 * 1.1.0  Ajout d'un son à la réception + coloration des utilisateurs
 */

 const socket = io()

 const chat = document.querySelector('.chat-form')
 const MsgName = document.querySelector('.chat-name')
 const MsgMessage = document.querySelector('.chat-input')
 const chatWindow = document.querySelector('.chat-window')
 const MsgReceived = new Audio("MsgReceived.mp3")
 MsgReceived.volume = 0.3
 
 // Ajout d'un événement de gestion du formulaire
 let spam
 chat.addEventListener('submit', event => {
   event.preventDefault()
   let msg = MsgMessage.value
   let nom = MsgName.value
   if (msg != spam) {
     if (msg.length < 60) {
       // Création de l'objet JSON a transmettre au serveur
       let fullMsg = `{"name":"${nom}", "message":"${msg}"}`
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
   MsgReceived.play();
   if (JSONMsg.name == MsgName.value) {
    renderMessage("<strong class='Me'>" + JSONMsg.name + "</strong> ► " + JSONMsg.message)
   } else {
    renderMessage("<strong class='Other'>" + JSONMsg.name + "</strong> ► " + JSONMsg.message)
   }
 })