const User = require("../models/User")
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

            case 'joinGroup':
                //add user to group members
                const joinGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    { $addToSet: { members: data.userId } },
                    { new: true }
                )
                if (!joinGroup) {
                    return res.json({ message: 'group not found' })
                }

                //add group to user's groups array
                await User.findByIdAndUpdate(
                    data.userId,
                    { $addToSet: { groups: data.groupId } },
                    { new: true }
                )

                return res.json({ message: 'user joined group successfully', group: joinGroup })

            case 'leaveGroup':
                //remove user from group members
                const leaveGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    { $pull: { members: data.userId } },
                    { new: true }
                )
                if (!leaveGroup) {
                    return res.json({ message: 'group not found' })
                }

                //also remove group from user's groups array
                await User.findByIdAndUpdate(
                    data.userId,
                    { $pull: { groups: data.groupId } },
                    { new: true }
                )

                return res.json({ message: 'user left group successfully', group: leaveGroup })

            case 'addAdmin':
                //grant admin permissions to group member
                const addAdminGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    { $addToSet: { admins: data.userId } },
                    { new: true }
                )
                if (!addAdminGroup) {
                    return res.json({ message: 'group not found' })
                }
                return res.json({ message: 'admin added successfully', group: addAdminGroup })

            case 'removeAdmin':
                //revoke admin permissions from group member
                const removeAdminGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    { $pull: { admins: data.userId } },
                    { new: true }
                )
                if (!removeAdminGroup) {
                    return res.json({ message: 'group not found' })
                }
                return res.json({ message: 'admin removed successfully', group: removeAdminGroup })

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