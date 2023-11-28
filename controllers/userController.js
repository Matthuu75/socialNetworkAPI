const { User, Thought } = require("../models");

module.exports = {
    getUser(req, res) {
        User.find({})
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },

    getSingleUser(req, res) {
        User.findById(req.params.userId)
            .populate("thoughts")
            .populate("friends")
            .select("-__v")
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "No User found with that ID!" })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    createUser(req, res) {
        User.create(req.body)
            .then((userdb) => res.json(userdb))
            .catch((err) => {
                console.error(err);
                res.status(500).json(err);
            });
    },

    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((userdb) =>
                !userdb
                    ? res.status(404).json({ message: "No User found with this ID!" })
                    : res.json(userdb)
            )
            .catch((err) => res.status(500).json(err));
    },

    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((userdb) => {
                if (!userdb) {
                    return res.status(404).json({ message: "No User found with this ID!" });
                }
                return Thought.deleteMany({ _id: { $in: userdb.thoughts } });
            })
            .then(() => res.json({ message: "User and User's Thoughts deleted!" }))
            .catch((err) => res.status(500).json(err));
    },

    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((userdb) =>
                !userdb
                    ? res.status(404).json({ message: "No User found with this ID!" })
                    : res.json(userdb)
            )
            .catch((err) => res.status(500).json(err));
    },

    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
            .then((userdb) =>
                !userdb
                    ? res.status(404).json({ message: "No User found with this ID!" })
                    : res.json(userdb)
            )
            .catch((err) => res.status(500).json(err));
    },
};
