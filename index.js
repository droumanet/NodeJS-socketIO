/**
 * Code pour une messagerie instantanée en Node.JS + socket.io
 * inspiré du blog https://blog.crowdbotics.com/build-chat-app-with-nodejs-socket-io/
 * Ajout du nom et gestion JSON du message transmis, déboguage
 * @author David ROUMANET <david.roumanet@ac-grenoble.fr>
 * @version 1.1.0
 * 1.1.0 Ajout d'une sécurité antispam au niveau serveur
 */

// Récupération des modules nécessaires
const express = require('express')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// Paramètres de l'application
const port = process.env.PORT || 3000
app.use(express.static(path.join(__dirname + '/public')))

/**
 * Cette fonction peut tester la validité du contenu des messages
 * @param {objet} message objet JSON contenant name et message
 * @returns {boolean} true si le message peut être publié, sinon false
 */
function checkMsg(message) {
  let result = true
  if (message.message.length < 3 || message.message.length > 60) result = false
  if (message.name.length < 3) result = false
  console.log("checkMsg = ", result)
  return result
}

// Gestion des événements du module socket.io
io.on('connection', socket => {
  socket.on('chat', message => {
    console.log('client: ', message, message.name)

    // renvoie le message reçu aux clients connectés
    if (checkMsg(JSON.parse(message))) {
      io.emit('chat', message)
    }
  })
})

// Vérification de la route par défaut (si absence de fichier index.html)
app.get('/', (req, res) => {
  res.status(200).send('Le serveur est actif mais sans page index.html a la racine.')
})

// Finalement, lancement du serveur Node.JS
server.listen(port, () => {
  console.log(`Serveur opérationnel sur le port: ${port}`)
})