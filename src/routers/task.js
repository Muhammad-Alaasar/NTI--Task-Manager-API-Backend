const express = require('express')
const auth = require('../middlewares/auth')
const routes = express.Router()

const Task = require('../models/Task')


// routes.post('/newtask', auth, (req, res) => {
//     const task = new Task(req.body)
//     task.save()
//         .then(() => res.send(task))
//         .catch(e => res.send(e))
// })

routes.post('/newtask', auth, (req, res) => {
    const task = new Task({ ...req.body, owner: req.user._id })
    task.save()
        .then(() => res.send(task))
        .catch(e => res.send(e))
})

routes.get('/tasks', auth, (req, res) => {
    req.user.populate('tasks')
        .then(data => {
            if (!data) return res.send("Not found any task!")
            res.send(data.tasks)
        })
        .catch(e => res.send(e))
})

// routes.get('/tasks', auth, (req, res) => {
//     Task.find({ owner: req.user._id })
//         .then(data => {
//             if (!data.length) return res.send("Not found any task!")
//             res.send(data)
//         })
//         .catch(e => res.send(e))
// })

routes.get('/task/:id', auth, (req, res) => {
    Task.findOne({ _id: req.params.id, owner: req.user._id })
        .then(user => {
            if (!user) return res.send('No Task has this ID')
            res.send(user)
        })
        .catch(e => res.send(e))
})

// routes.patch('/task/:id',auth, (req,res)=> {
//     Task.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     })
//     .then(user => {
//         if (!user) return res.send('No Task has this ID')
//         res.send(user)
//     })
//     .catch(e => res.send(e))
// })


routes.patch('/task/:id', auth, (req, res) => {
    const user = Task.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, {
        new: true,
        runValidators: true
    })
        .then((data) => {
            if (!data) return res.send('No Task has this ID')
            // const updates = Object.keys(req.body)
            // updates.forEach(i => data[i] = req.body[i])
            res.send(data)
        })
        .catch(e => res.send(e))
})

routes.delete('/task/:id', auth, (req, res) => {
    Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        .then(user => {
            if (!user) return res.send("No Task has this ID")
            // user.save()
            res.send(user)
        }).catch(e => res.send(e))
})

routes.get('/:taskId', auth, (req, res) => {
    Task.findById(req.params.taskId)
    .then( data => data.populate('owner'))
    .then( d => res.send(d.owner))
})

// routes.get('/:taskId', auth, async (req, res) => {
//     const task = await Task.findById(req.params.taskId)
//     await task.populate('owner')
//     res.send(task.owner)
//     console.log(task.owner);
// })

module.exports = routes