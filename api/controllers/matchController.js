import User from "../models/User.js"


export const swipeRight = async (req, res) => {
    try {
        const {likedUserId} = req.params
        const currentUser = await User.findById(req.user._id)
        const likedUser = await User.findById(likedUserId)

        if(!currentUser.likes.includes(likedUserId)) {
            currentUser.likes.push(likedUserId)
            await currentUser.save()
            // if liked user has liked currentUser, then add them to their matches
            if(likedUser.likes.includes(currentUser._id)) {
                likedUser.matches.push(currentUser._id)
                currentUser.matches.push(likedUser._id)
                // save both users
                await Promise.all([likedUser.save(), currentUser.save()])
            }
        }
        res.status(200).json({success: true, user: currentUser})
    } catch (error) {
        console.log("Error in swipeRight controller: ", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export const swipeLeft = async (req, res)  => {
    try {
        const {dislikedUserId} = req.params
        const currentUser = await User.findById(req.user._id)

        if(!currentUser.dislikes.includes(dislikedUserId)) {
            currentUser.dislikes.push(dislikedUserId)
            await currentUser.save()
        }
        res.status(200).json({success: true, user: currentUser})
    } catch (error) {
        console.log("Error in swipeLeft controller: ", error)
        res.status(500).json({message: "Internal server error"})
    }
}

// export const getMatches = async (req, res)  => {
//     try {
//         const user = User.findById(req.user.id).populate("matches", "name image")

//         res.status(200).json({success: true, matches: user.matches})
//     } catch (error) {
//         console.log("Error in getMatches controller: ", error)
//         res.status(500).json({message: "Internal server error"})
//     }
   
// }

export const getMatches = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate("matches", "name image");

		res.status(200).json({
			success: true,
			matches: user.matches,
		});
	} catch (error) {
		console.log("Error in getMatches: ", error);

		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const getUserProfiles = async (req, res)  => {
    try {
        const currentUser = await User.findById(req.user._id)

        const users = await User.find({
            $and: [
                { _id: {$ne: currentUser._id} },
                { _id: {$nin: currentUser.likes} },
                { _id: {$nin: currentUser.dislikes} },
                { _id: {$nin: currentUser.matches} },
                { 
                    gender: currentUser.genderPreference === 'both' 
                    ? {$in: ['male', 'fermale']} 
                    : currentUser.genderPreference 
                },
                { genderPreference: {$in: [currentUser.gender, 'both']} }
            ]
        })

        res.status(200).json({success: true, users})
    } catch (error) {
        console.log("Error in getUserProfiles controller: ", error)
        res.status(500).json({message: "Internal server error"})
    }
}