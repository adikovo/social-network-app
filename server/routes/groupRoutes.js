
const express = require("express");
const router = express.Router();
const {
    createGroup,
    listGroups,
    searchGroups,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    addAdmin,
    removeAdmin,
    getGroup,
    getGroupPosts,
    checkAdmin,
    getJoinRequests,
    acceptJoinRequest,
    declineJoinRequest,
    checkJoinRequestStatus,
    getGroupStats
} = require("../controllers/groupController");

// Individual route handlers for each group operation
router.post("/create", async (req, res) => {
    try {
        const result = await createGroup(req.body);
        if (result.status) {
            return res.status(result.status).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error creating group:', error: error.message });
    }
});

router.post("/list", async (req, res) => {
    try {
        const result = await listGroups(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error listing groups:', error: error.message });
    }
});

router.post("/search", async (req, res) => {
    try {
        const result = await searchGroups(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error searching groups:', error: error.message });
    }
});

router.post("/update", async (req, res) => {
    try {
        const result = await updateGroup(req.body);
        if (result.status) {
            return res.status(result.status).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating group:', error: error.message });
    }
});

router.post("/delete", async (req, res) => {
    try {
        const result = await deleteGroup(req.body);
        if (result.status) {
            return res.status(result.status).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting group:', error: error.message });
    }
});

router.post("/join", async (req, res) => {
    try {
        const result = await joinGroup(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error joining group:', error: error.message });
    }
});

router.post("/leave", async (req, res) => {
    try {
        const result = await leaveGroup(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error leaving group:', error: error.message });
    }
});

router.post("/add-admin", async (req, res) => {
    try {
        const result = await addAdmin(req.body);
        if (result.status) {
            return res.status(result.status).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error adding admin:', error: error.message });
    }
});

router.post("/remove-admin", async (req, res) => {
    try {
        const result = await removeAdmin(req.body);
        if (result.status) {
            return res.status(result.status).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error removing admin:', error: error.message });
    }
});

router.post("/get", async (req, res) => {
    try {
        const result = await getGroup(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error getting group:', error: error.message });
    }
});

router.post("/posts", async (req, res) => {
    try {
        const result = await getGroupPosts(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error getting group posts:', error: error.message });
    }
});

router.post("/check-admin", async (req, res) => {
    try {
        const result = await checkAdmin(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error checking admin status:', error: error.message });
    }
});

router.post("/join-requests", async (req, res) => {
    try {
        const result = await getJoinRequests(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error getting join requests:', error: error.message });
    }
});

router.post("/accept-join-request", async (req, res) => {
    try {
        const result = await acceptJoinRequest(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error accepting join request:', error: error.message });
    }
});

router.post("/decline-join-request", async (req, res) => {
    try {
        const result = await declineJoinRequest(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error declining join request:', error: error.message });
    }
});

router.post("/check-join-request-status", async (req, res) => {
    try {
        const result = await checkJoinRequestStatus(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error checking join request status:', error: error.message });
    }
});

router.post("/stats", async (req, res) => {
    try {
        const result = await getGroupStats(req.body);
        if (result.status) {
            return res.status(result.status).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error getting group stats:', error: error.message });
    }
});

module.exports = router;