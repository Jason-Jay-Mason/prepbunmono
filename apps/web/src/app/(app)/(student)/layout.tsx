const Layout: React.FC<any> = async ({ children }) => {
  return <main className="z-10 min-h-[75dvh] bg-background">{children}</main>;
};

export default Layout;
