import { useState } from 'react';
import X from '../icons/X';
import Megaphone from '../icons/Megaphone';

export type NoticeBannerProps = {
  bannerContent: string;
};

export const NoticeBanner = ({ bannerContent }: NoticeBannerProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const isVisible =
    !isDismissed && bannerContent && bannerContent.trim().length;

  return (
    isVisible ? (
      <div className="bg-orange-500 overflow-hidden">
        <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex w-0 flex-1 items-center">
              <span className="flex rounded-lgp-2">
                <Megaphone className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="ml-3 font-medium text-black">{bannerContent}</p>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
              <button
                onClick={() => setIsDismissed(true)}
                type="button"
                className="-mr-1 flex rounded-md p-2 hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
};