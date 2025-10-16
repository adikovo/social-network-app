
const Group = require("../models/Group");

//api endpoint to handle all CRUD operations
const handleGroupCommand = async (req, res) => {
    const { command, data } = req.body

    try {
        //determine which operation to perform based on command
        switch (command) {
            case 'insert':
                //create new group document
                const newGroup = new Group({
                    name: data.name,
                    description: data.description,
                    members: data.members,
                    createdBy: data.createdBy,
                    privacy: data.privacy,
                    posts: data.posts
                })

                //save group to db as new document
                await newGroup.save()
                return res.json({ message: 'group inserted successfully', group: newGroup })

            case 'select':
                //fetch all groups from db
                const groups = await Group.find({})
                return res.json({ message: 'all groups fetched successfully', groups: groups })

            case 'update':
                //find group by id and update their details
                const updateGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    { descripation: data.newDescripation },
                    { new: true }
                )
                if (!updateGroup) {
                    return res.json({ message: 'group not found' })
                }
                else {
                    return res.json({ message: 'group found & updated successfully', group: updateGroup })
                }

            case 'delete':
                //find group by id and delete them
                const deleteGroup = await (Group.findByIdAndDelete(data.groupId))
                if (!deleteGroup) {
                    return res.json({ message: 'group not found' })
                }
                else {
                    return res.json({ message: 'group found & deleted successfully', group: deleteGroup })
                }
            //if command is not recognized
            default:
                return res.json({ message: 'invalid command' })
        }
    }
    catch (error) {
        return res.json({ message: 'Error handling group command:', error: error.message })
    }
}

module.exports = { handleGroupCommand }