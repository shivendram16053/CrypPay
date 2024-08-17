import { truncateMiddle } from "../../utils/string";

const Profile = ({ setModalOpen, avatar, userAddress, balance }) => {
    const onProfileOpen = () => {
        setModalOpen(true);
    };

    const truncatedAddress = userAddress
        ? truncateMiddle(userAddress, 5, 4)
        : "Wallet Not connected";

    return (
        <div onClick={onProfileOpen} className="flex cursor-pointer flex-col items-center space-y-3">
            <div className="h-16 w-16 rounded-full border-2 border-white">
                {avatar && (<img className="h-full w-full rounded-full object-cover" src={avatar} alt="Avatar" />)}
            </div>

            <div className="flex flex-col items-center space-y-1">
                <p className="font-semibold text-white">
                    User: {userAddress ? truncatedAddress : ""}
                </p>

                <p className="text-sm text-gray-100">{balance ? `${balance} SOL` : ""}</p>
            </div>
        </div>
    );
};

export default Profile;
