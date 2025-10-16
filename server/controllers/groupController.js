
const Group = require("../models/Group");

//api endpoint to handle all CRUD operations
const handleGroupCommand = async (req, res) => {
    const { command, data } = req.body

    try {
        //determine which operation to perform based on command
        switch (command) {
            case 'create':
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

            case 'list':
                //fetch all groups from db
                //TODO add fetch all users in a group?????
                const groups = await Group.find({})
                return res.json({ message: 'all groups fetched successfully', groups: groups })

            case 'search':
                //multi-parameter search for groups
                const { name, description, privacy, createdBy, memberId } = data
                const groupSearchQuery = {}

                // Build search query based on provided parameters
                if (name) {
                    groupSearchQuery.name = { $regex: name, $options: 'i' }
                }
                if (description) {
                    groupSearchQuery.description = { $regex: description, $options: 'i' }
                }
                if (privacy) {
                    groupSearchQuery.privacy = privacy
                }
                if (createdBy) {
                    groupSearchQuery.createdBy = createdBy
                }
                if (memberId) {
                    groupSearchQuery.members = memberId
                }

                const groupSearchResults = await Group.find(groupSearchQuery)
                return res.json({
                    message: 'group search completed successfully',
                    groups: groupSearchResults,
                    searchCriteria: groupSearchQuery
                })

            case 'update':
                //find group by id and update their details
                const updateGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    { description: data.newDescription },
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