import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md transition-transform duration-300 hover:scale-110">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-[#192562]" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-bold bg-gradient-to-r from-[#192562] to-[#D18CF9] dark:from-[#D18CF9] dark:to-blue-300 bg-clip-text text-transparent">SuppTracker</span>
            </div>
        </>
    );
}

