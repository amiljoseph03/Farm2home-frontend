import Profile from '../Profile';

/**
 * BuyerProfile wrapper that forwards to the unified Profile component.
 */
const BuyerProfile = (props) => {
  return <Profile role="buyer" {...props} />;
};

export default BuyerProfile;
