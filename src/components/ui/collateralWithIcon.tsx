import icons from '@/icons';

const CollateralWithIcon = ({ collateralType }: { collateralType: string }) => (
  <span className="flex">
    <img src={icons[collateralType.toLowerCase()] || icons.unknown} alt={collateralType} className="w-4 h-4" />{' '}
    <span className="flex-1 ml-2">{collateralType}</span>
  </span>
);

export default CollateralWithIcon;
