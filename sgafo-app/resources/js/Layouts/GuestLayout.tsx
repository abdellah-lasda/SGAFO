import { PropsWithChildren } from 'react';
import Logo from '@/Components/Logo';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ofppt-800 to-ofppt-600 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                
                <div className="relative z-10 text-center max-w-lg">
                    <div className="flex justify-center mb-8">
                        <Logo variant="light" size="xl" />
                    </div>
                    <p className="text-ofppt-100 text-lg leading-relaxed mt-6">
                        Système de Gestion des Formations des Formateurs de l'OFPPT.
                        Plateforme centralisée pour la planification, l'exécution et l'évaluation continue.
                    </p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl lg:shadow-none lg:p-0 lg:bg-transparent">
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">Espace Connexion</h2>
                        <p className="mt-2 text-sm text-gray-600">Connectez-vous pour accéder à votre espace de travail</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
