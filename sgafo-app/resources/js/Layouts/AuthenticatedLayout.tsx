import Dropdown from '@/Components/Dropdown';
import Sidebar from '@/Components/Sidebar';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
            {/* Sidebar Desktop */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <Sidebar user={user} />
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Navigation Bar */}
                <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
                    {/* Mobile Hamburger (To do: implement mobile sidebar) */}
                    <div className="flex items-center lg:hidden">
                        <button className="text-gray-500 focus:outline-none hover:text-gray-700">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <span className="ml-3 font-semibold text-ofppt-800">SGAFO</span>
                    </div>

                    <div className="hidden lg:block flex-1"></div>

                    {/* Right side Profile Dropdown */}
                    <div className="flex items-center">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="flex items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ofppt-500 focus:ring-offset-2"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-ofppt-100 text-ofppt-700 flex items-center justify-center font-bold">
                                        {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
                                    </div>
                                    <span className="ml-2 hidden text-sm font-medium text-gray-700 lg:block">
                                        {user.prenom} {user.nom}
                                    </span>
                                    <svg className="ml-1 hidden h-4 w-4 text-gray-400 lg:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Mon Profil</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Déconnexion
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
                    {header && (
                        <div className="bg-white shadow-sm border-b border-gray-200">
                            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </div>
                    )}
                    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
