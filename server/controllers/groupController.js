const User = require("../models/User")
const Group = require("../models/Group");

//api endpoint to handle all CRUD operations
const handleGroupCommand = async (req, res) => {
    const { command, data } = req.body

    console.log('Group command received:', command, 'Data:', data);

    try {
        //determine which operation to perform based on command
        switch (command) {
            case 'create':
                //get the creator name for easy searching
                const creator = await User.findById(data.createdBy);
                const creatorName = creator ? creator.name : 'Unknown';

                //create new group document
                const newGroup = new Group({
                    name: data.name,
                    description: data.description,
                    members: data.members,
                    createdBy: data.createdBy,
                    createdByName: creatorName,
                    admins: [data.createdBy],
                    privacy: data.privacy,
                    posts: data.posts
                })

                //save group to db
                await newGroup.save()

                return res.json({ message: 'group inserted successfully', group: newGroup })

            case 'list':
                //fetch all groups from db
                let query = {}
                //if userId is given, fetch all groups the user is a member 
                if (data.userId) {
                    query = { members: data.userId }
                }
                //otherwise fetch all groups
                const groups = await Group.find(query)

                //for each group fetch the creator name in paralel and wait for all async results
                const groupsWithNames = await Promise.all(groups.map(async (group) => {

                    const creator = await User.findById(group.createdBy);
                    const creatorName = creator ? creator.name : 'Unknown user';

                    return {
                        //copy the original group and add the creator name
                        ...group.toObject(),
                        createdByName: creatorName
                    };
                }));

                return res.json({ message: 'all groups fetched successfully', groups: groupsWithNames })

            case 'search':
                const { name, description, createdBy } = data
                const groupSearchQuery = {}

                //build search query based on provided parameters
                if (name) {
                    groupSearchQuery.name = { $regex: name, $options: 'i' }
                }
                if (description) {
                    groupSearchQuery.description = { $regex: description, $options: 'i' }
                }
                if (createdBy) {
                    groupSearchQuery.createdByName = { $regex: createdBy, $options: 'i' }
                }

                const groupSearchResults = await Group.find(groupSearchQuery)

                return res.json({
                    message: 'group search completed successfully',
                    groups: groupSearchResults,
                    searchCriteria: groupSearchQuery
                })

            case 'update':
                //find group first to check if user is authorized to update it
                const groupToUpdate = await Group.findById(data.groupId)
                if (!groupToUpdate) {
                    return res.json({ message: 'group not found' })
                }

                //check if the user is the creator or an admin of the group
                if (groupToUpdate.createdBy !== data.userId && !groupToUpdate.admins.includes(data.userId)) {
                    return res.status(403).json({ message: 'unauthorized: only group creators and admins can update groups' })
                }

                //update the group if user is authorized
                const updateGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    {
                        $set: {
                            name: data.newName,
                            description: data.newDescription,
                            privacy: data.newPrivacy
                        }
                    },
                    { new: true }
                )
                return res.json({ message: 'group found & updated successfully', group: updateGroup })

            case 'delete':
                //find group first to check if user is authorized to delete it
                const groupToDelete = await Group.findById(data.groupId)
                if (!groupToDelete) {
                    return res.json({ message: 'group not found' })
                }

                //check if the user is the creator of the group
                if (groupToDelete.createdBy !== data.userId) {
                    return res.status(403).json({ message: 'unauthorized: only group creators can delete groups' })
                }

                //delete the group if user is authorized
                const deleteGroup = await Group.findByIdAndDelete(data.groupId)
                return res.json({ message: 'group found & deleted successfully', group: deleteGroup })

            //membership actions

            case 'joinGroup':
                //get the group to check privacy
                const groupToJoin = await Group.findById(data.groupId)
                if (!groupToJoin) {
                    return res.json({ message: 'group not found' })
                }

                //check if group is private
                if (groupToJoin.privacy === 'private') {
                    //for private groups, add to join requests instead of members
                    const updatedGroup = await Group.findByIdAndUpdate(
                        data.groupId,
                        { $addToSet: { joinRequests: data.userId } },
                        { new: true }
                    )
                    return res.json({ message: 'join request sent successfully', group: updatedGroup })
                } else {
                    //for public groups, add user to group members directly
                    const joinGroup = await Group.findByIdAndUpdate(
                        data.groupId,
                        { $addToSet: { members: data.userId } },
                        { new: true }
                    )

                    //add group to user's groups array
                    await User.findByIdAndUpdate(
                        data.userId,
                        { $addToSet: { groups: data.groupId } },
                        { new: true }
                    )

                    return res.json({ message: 'user joined group successfully', group: joinGroup })
                }

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

            //admin operations
            case 'addAdmin':
                //find group first to check if requesting user is authorized
                const groupToAddAdmin = await Group.findById(data.groupId)
                if (!groupToAddAdmin) {
                    return res.json({ message: 'group not found' })
                }

                //check if the requesting user is the creator or an admin
                if (groupToAddAdmin.createdBy !== data.requestingUserId && !groupToAddAdmin.admins.includes(data.requestingUserId)) {
                    return res.status(403).json({ message: 'unauthorized: only group creators and admins can add admins' })
                }

                //grant admin permissions to group member and ensure they're also a member
                const addAdminGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    {
                        $addToSet: {
                            admins: data.userId,
                            members: data.userId
                        }
                    },
                    { new: true }
                )
                return res.json({ message: 'admin added successfully', group: addAdminGroup })

            case 'removeAdmin':
                //find group first to check if requesting user is authorized
                const groupToRemoveAdmin = await Group.findById(data.groupId)
                if (!groupToRemoveAdmin) {
                    return res.json({ message: 'group not found' })
                }

                //check if the requesting user is the creator or an admin
                if (groupToRemoveAdmin.createdBy !== data.requestingUserId && !groupToRemoveAdmin.admins.includes(data.requestingUserId)) {
                    return res.status(403).json({ message: 'unauthorized: only group creators and admins can remove admins' })
                }

                //revoke admin permissions from group member
                const removeAdminGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    { $pull: { admins: data.userId } },
                    { new: true }
                )
                return res.json({ message: 'admin removed successfully', group: removeAdminGroup })

            case 'getGroup':
                //get a specific group with member names
                const singleGroup = await Group.findById(data.groupId)

                if (!singleGroup) {
                    return res.json({ message: 'group not found' })
                }

                // Check if group is private and user is not a member
                const isPrivateAndNotMember = singleGroup.privacy === 'private' && !singleGroup.members.includes(data.userId);

                // Get creator name
                const groupCreator = await User.findById(singleGroup.createdBy);
                const groupCreatorName = groupCreator ? groupCreator.name : 'Unknown';

                if (isPrivateAndNotMember) {
                    // For private groups where user is not a member, return basic info only
                    return res.json({
                        message: 'group fetched successfully',
                        group: {
                            _id: singleGroup._id,
                            name: singleGroup.name,
                            description: singleGroup.description,
                            privacy: singleGroup.privacy,
                            createdBy: singleGroup.createdBy,
                            createdByName: groupCreatorName,
                            members: singleGroup.members,
                            membersCount: singleGroup.members.length,
                            admins: singleGroup.admins,
                            isPrivateAndNotMember: true
                        }
                    });
                } else {
                    // For public groups or private groups where user is a member, return full info
                    const memberNames = await Promise.all(
                        singleGroup.members.map(async (memberId) => {
                            const member = await User.findById(memberId);
                            return {
                                id: memberId,
                                name: member ? member.name : 'Unknown',
                                email: member ? member.email : '',
                                profilePicture: member ? member.profilePicture : null
                            };
                        })
                    );

                    return res.json({
                        message: 'group fetched successfully',
                        group: {
                            ...singleGroup.toObject(),
                            createdByName: groupCreatorName,
                            membersWithNames: memberNames,
                            isPrivateAndNotMember: false
                        }
                    });
                }

            case 'getGroupPosts':
                //get all posts in a specific group with privacy check
                const Post = require("../models/Post")
                const group = await Group.findById(data.groupId)

                if (!group) {
                    return res.json({ message: 'group not found' })
                }

                //check if group is private and user is not a member
                if (group.privacy === 'private' && !group.members.includes(data.userId)) {
                    return res.json({ message: 'group posts fetched successfully', posts: [] })
                }

                const groupPosts = await Post.find({ groupId: data.groupId })
                    .sort({ createdAt: -1 })
                return res.json({
                    message: 'group posts retrieved successfully',
                    posts: groupPosts
                })

            case 'checkAdmin':
                //check if user is admin of the group
                const checkGroup = await Group.findById(data.groupId);
                if (!checkGroup) {
                    return res.json({ message: 'group not found', isAdmin: false })
                }

                const isAdmin = checkGroup.admins && checkGroup.admins.includes(data.userId);
                return res.json({
                    message: 'admin check completed',
                    isAdmin: isAdmin
                })

            case 'getJoinRequests':
                //get all join requests for groups where user is admin
                const userGroups = await Group.find({
                    $or: [
                        { createdBy: data.userId },
                        { admins: data.userId }
                    ]
                }).populate('joinRequests', 'name email profilePicture');

                const allJoinRequests = [];
                userGroups.forEach(group => {
                    if (group.joinRequests && group.joinRequests.length > 0) {
                        group.joinRequests.forEach(user => {
                            allJoinRequests.push({
                                _id: user._id,
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                profilePicture: user.profilePicture,
                                groupId: group._id,
                                groupName: group.name,
                                message: `wants to join ${group.name}`
                            });
                        });
                    }
                });

                return res.json({
                    message: 'join requests retrieved successfully',
                    joinRequests: allJoinRequests
                });

            case 'acceptJoinRequest':
                //accept a join request - add user to group members
                const acceptGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    {
                        $pull: { joinRequests: data.requestUserId },
                        $addToSet: { members: data.requestUserId }
                    },
                    { new: true }
                );

                if (!acceptGroup) {
                    return res.json({ message: 'group not found' });
                }

                //add group to user's groups array
                await User.findByIdAndUpdate(
                    data.requestUserId,
                    { $addToSet: { groups: data.groupId } },
                    { new: true }
                );

                // Add notification to the user who requested to join
                const adminUser = await User.findById(data.userId);
                console.log('Creating join group approval notification for user:', data.requestUserId);
                console.log('Admin user:', adminUser?.name);
                console.log('Group name:', acceptGroup.name);

                await User.findByIdAndUpdate(
                    data.requestUserId,
                    {
                        $push: {
                            notifications: {
                                type: 'joinGroupApproved',
                                fromUserId: data.userId,
                                fromUserName: adminUser.name,
                                fromUserProfilePicture: adminUser.profilePicture,
                                groupId: data.groupId,
                                groupName: acceptGroup.name,
                                message: `Your request to join "${acceptGroup.name}" was approved!`
                            }
                        }
                    }
                );
                console.log('Join group approval notification created successfully');

                return res.json({ message: 'join request accepted successfully', group: acceptGroup });

            case 'declineJoinRequest':
                //decline a join request - remove from join requests
                const declineGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    { $pull: { joinRequests: data.requestUserId } },
                    { new: true }
                );

                if (!declineGroup) {
                    return res.json({ message: 'group not found' });
                }

                // Add notification to the user who requested to join
                const declineAdminUser = await User.findById(data.userId);
                await User.findByIdAndUpdate(
                    data.requestUserId,
                    {
                        $push: {
                            notifications: {
                                type: 'joinGroupDeclined',
                                fromUserId: data.userId,
                                fromUserName: declineAdminUser.name,
                                fromUserProfilePicture: declineAdminUser.profilePicture,
                                groupId: data.groupId,
                                groupName: declineGroup.name,
                                message: `Your request to join "${declineGroup.name}" was declined.`
                            }
                        }
                    }
                );

                return res.json({ message: 'join request declined successfully', group: declineGroup });

            case 'checkJoinRequestStatus':
                //check if user has pending join request for a group
                const checkJoinRequestGroup = await Group.findOne({
                    _id: data.groupId,
                    joinRequests: data.userId
                });

                return res.json({
                    message: 'join request status checked',
                    hasPendingRequest: !!checkJoinRequestGroup
                });

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