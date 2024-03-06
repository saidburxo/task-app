const mongoose = require("mongoose")

const Task = require("../model/taskModel")

const dashCtrl = {
    dashboard: async (req, res) => {
        const locals = {
            title: 'Dashboard',
            description: 'My super app.'
        }

        let perPage = 6;
        let page = (req.query.page * 1) || 1;

        try {
            // tasks
            const tasks = await Task.aggregate([
                { $sort: { updatedAt: -1 } },
                { $match: { user: new mongoose.Types.ObjectId(req.user.id) } }
            ]).skip(perPage * page - perPage).limit(perPage).exec()

            let count = await Task.find({ user: req.user.id })
            count = count.length


            res.render('dashboard/index', { userName: req.user.firstname, locals, tasks, current: page, pages: Math.ceil(count / perPage), layout: '../views/layouts/dashboard' })
        } catch (error) {
            console.log(error)
        }
    },

    // get create task page
    addPage: async (req, res) => {
        res.render('dashboard/add', { layouts: '../views/layouts/dashboard' })
    },

    //add new task
    addTask: async (req, res) => {
        req.body.user = req.user.id
        try {
            await Task.create(req.body)
            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
        }
    },

    // view task
    viewTask: async (req, res) => {
        const { id } = req.params
        try {
            const task = await Task.findById(id)
            if (task) {
                res.render('dashboard/view-task', { taskId: id, task, layouts: '../views/layouts/dashboard' })
            } else {
                res.send('Something went wrong!')
            }
        } catch (error) {
            console.log(error)
        }
    },

    // update a task
    updateTask: async (req, res) => {
        const { id } = req.params
        const { title, body } = req.body

        try {
            await Task.findByIdAndUpdate({ _id: id }, { title, body, updatedAt: Date.now() })
            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
        }
    },

    // search task a page get
    searchTask: async (req, res) => {
        try {
            res.render('dashboard/search', { searchResult: "", layout: '../views/layouts/dashboard' })
        } catch (error) {
            console.log(error)
        }
    },

    // delete rasks
    deleteTask: async (req, res) => {
        const { id } = req.params
        try {
            await Task.findByIdAndDelete(id)
            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
        }
    },

    // search task post
    searchResult: async (req, res) => {
        const { termin } = req.body

        try {
            const key = new RegExp(termin, 'i')
            const searchResult = await Task.find({
                $or: [{ title: { $regex: key } }, { body: { $regex: key } }]
            })

            res.render('dashboard/search', { searchResult, layout: '../views/layouts/dashboard' })
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = dashCtrl