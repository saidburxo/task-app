const mainCtrl = {
    home: async (req, res) => {
        const locals = {
            title: "NodeJs Task App",
            description: "Free NodeJs Task App"
        }

        res.render('index', { locals, layouts: '../views/layouts/front-page' })
    },

    about: async (req, res) => {
        const locals = {
            title: "About NodeJs Task App",
            description: "Free NodeJs Task App"
        }

        res.render('about', { locals })
    },

    contact: async (req, res) => {
        const locals = {
            title: "About NodeJs Task App",
            description: "Free NodeJs Task App"
        }

        res.render('contact', { locals })
    },
}

module.exports = mainCtrl