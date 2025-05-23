import { ReactNode } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Box, Table2, ReplaceAll, LayoutGrid } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Footer } from './Footer';
import { Logo } from './Logo';
import { NoticeBanner } from './Banner';

type Props = {
  children?: ReactNode;
};

const menuItems = [
  {
    label: 'Inter Protocol',
    icon: <LayoutGrid />,
    to: '/',
  },
  {
    label: 'PSM',
    icon: <ReplaceAll />,
    to: '/psm',
  },
  {
    label: 'Vaults',
    icon: <Box />,
    to: '/vaults',
  },
  {
    label: 'Liquidations',
    icon: <Table2 />,
    to: '/liquidated',
  },
  {
    label: 'Reserve',
    icon: <ShieldCheck />,
    to: '/reserve',
  },
];

const chains: { [key: string]: string } = {
  mainnet: 'Mainnet',
};

export function MainLayout({ children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const sp = new URLSearchParams(location.search);
  const chain = sp.get('chain') || 'mainnet';

  const handleChainChange = (newChain: string) => {
    sp.set('chain', newChain);
    const newUrl = `${location.pathname}?${sp.toString()}`;
    navigate(newUrl);
  };

  return (
    <>
      <NoticeBanner bannerContent="By way of a community vote, Inter Protocol is being sunsetted, and is currently in a 60-day wind-down. Vault holders are encouraged to close their vaults expeditiously, and IST positions should be settled. Please see the FAQ (https://inter.trade/blog/inter-protocol-sunset-faq) for more information. The wind-down is scheduled to complete on June 26, 2025. " />
      <NoticeBanner bannerContent=" info.inter.trade is currently experiencing technical difficulties. The team is actively working on it. All other aspects of Inter Protocol are currently functioning as normal."/>
      <div className="lg:flex column-bg">
        <Helmet titleTemplate="%s | Inter Protocol Dashboard">
          <title>Home</title>
        </Helmet>

        <div className="lg:w-72 lg:min-h-screen flex flex-col">
          <div className="lg:block flex flex-1 flex-wrap items-center">
            <Link className="m-8 block w-full md:w-auto" to="/">
              <Logo />
            </Link>
            <div className="flex-1 lg:block flex flex-wrap m-4 lg:m-0">
              {menuItems.map((i) => {
                const to = `${i.to}?chain=${chain}`;

                return (
                  <NavLink to={to} key={i.label} className="text-black block flex lg:m-8 m-2 mr-0 nav-link">
                    {i.icon}
                    <div className="flex-1 ml-4">{i.label}</div>
                  </NavLink>
                );
              })}
            </div>
            <div className="flex lg:block w-full px-2">
              <Select onValueChange={handleChainChange}>
                <SelectTrigger className="w-full max-w-[170px] text-gray-700 border-gray-700 mx-4 my-4 bg-transparent flex-1">
                  <SelectValue placeholder={chains[chain]} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(chains).map((c) => (
                    <SelectItem key={c} value={c}>
                      {chains[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="hidden lg:block">
            <Footer />
          </div>
        </div>
        <div className="flex-1 bg-white min-h-[300px] rounded-3xl lg:rounded-r-none">{children || <Outlet />}</div>
        <div className="lg:hidden block">
          <Footer />
        </div>
      </div>
    </>
  );
}
