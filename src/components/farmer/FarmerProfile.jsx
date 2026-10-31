import Profile from '../Profile';

/**
 * FarmerProfile wrapper that forwards to the unified Profile component.
 */
const FarmerProfile = (props) => {
  return <Profile role="farmer" {...props} />;
};

export default FarmerProfile;
