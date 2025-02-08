import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import styles from "../styles/followButton.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addFollowing, removeFollowing } from "../store/slices/userSlice";

const FollowButton = ({ user, fetchPosts }) => {
  const { userId, followingIds } = useSelector((state) => state.user);
  const [isFollower, setIsFollower] = useState(false);

  const dispatch = useDispatch();
  const currUserId = userId;

  //   useEffect(() => {
  //     const fetchDetails = async () => {
  //       try {
  //         const followerResponse = await axios.get(
  //           `/api/users/is-follower/${user._id}`
  //         );
  //         setIsFollower(followerResponse.data);
  //       } catch (err) {
  //         console.log("Error while fetching follower response: " + err);
  //       }
  //     };
  //     fetchDetails();
  //   }, [user._id]);

  //   useEffect(() => {
  //     setIsFollower(followingIds.includes(user._id));
  //   }, []);
  useEffect(() => {
    setIsFollower(followingIds.includes(user._id));
  }, [followingIds, user._id]);

  const handleFollowRequest = async () => {
    try {
      if (isFollower && currUserId !== user._id) {
        await axios.delete(`/api/users/remove-following/${user._id}`);
        setIsFollower(false);
        toast.success(`Unfollowed ${user.name}`);
        dispatch(removeFollowing(user._id));
      } else if (currUserId !== user._id) {
        await axios.post(`/api/users/add-following/${user._id}`);
        setIsFollower(true);
        toast.success(`Followed ${user.name}`);
        dispatch(addFollowing(user._id));
      }
      fetchPosts();
    } catch (err) {
      console.log("Error while updating follow status: " + err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.followBtn}>
        <button
          onClick={handleFollowRequest}
          type="button"
          className={`btn ${styles.btnprimary}`}
        >
          {isFollower ? <FaMinus /> : <FaPlus />}
          &nbsp;
          {isFollower ? "Unfollow" : "Follow"}
        </button>
      </div>
    </div>
  );
};

export default FollowButton;
