const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const dbURL = 'useyourownconnection';

const Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })

})

app.post('/messages', async (req, res) => {

    try {
        const message = new Message(req.body);

        const savedMessage = await message.save()
        console.log('saved');

        const censored = await Message.findOne({ message: 'badword' })

        if (censored) {
            await Message.remove({ _id: censored.id })
        } else {
            io.emit('message', req.body);
        }

        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
        return console.error(err)
    } finally {
        console.log('message post')
    }

})

io.on('connection', (socket) => {
    console.log('a user is connected');
})

mongoose.connect(dbURL, { useNewUrlParser: true }, (err) => {
    console.log('mongodb connection', err);
})


const server = http.listen(3000, () => {
    console.log(`Server is listening ${server.address().port}`)
});