import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
            <Head title="SGAFO • OFPPT - Portail Institutionnel" />

            {/* Navigation - Institutional Style */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center p-1 shadow-lg">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="currentColor">
                                <path d="M20 20h60v10H20zM20 45h60v10H20zM20 70h60v10H20z" className="opacity-20" />
                                <path d="M10 10v80h80V10H10zm70 70H20V20h60v60z" />
                                <circle cx="50" cy="50" r="15" />
                            </svg>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-2xl font-black tracking-tighter text-slate-900">SGAFO</span>
                            <span className="text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">OFPPT Maroc</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <a href="#vision" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Notre Vision</a>
                        <a href="#workflow" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Processus Digital</a>
                        <div className="h-6 w-px bg-slate-200" />
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-slate-900/10"
                            >
                                Mon Espace de Travail
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-600/20"
                            >
                                Connexion Intranet
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="pt-20">
                {/* Hero Section - Inspired by Catalogue National Hero */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative overflow-hidden rounded-[40px] bg-slate-900 p-12 md:p-24 shadow-2xl">
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
                            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]"></div>
                            
                            <div className="relative z-10 max-w-3xl">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-10">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-blue-400">Plateforme de Gestion Intégrée</span>
                                </div>
                                
                                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-8">
                                    La Digitalisation au <br />
                                    <span className="text-blue-500">Service de la Formation.</span>
                                </h1>
                                
                                <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-2xl">
                                    SGAFO est le système centralisé de l'OFPPT pour la planification, le suivi et l'évaluation continue des programmes de formation des formateurs.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    {!auth.user ? (
                                        <Link
                                            href={route('login')}
                                            className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-slate-100 transition-all shadow-2xl shadow-white/5 flex items-center justify-center gap-3 group"
                                        >
                                            Accéder à l'espace sécurisé
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7M5 12h16" />
                                            </svg>
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('dashboard')}
                                            className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-slate-100 transition-all shadow-2xl shadow-white/5"
                                        >
                                            Mon Tableau de bord
                                        </Link>
                                    )}
                                    <a href="#workflow" className="w-full sm:w-auto text-white/60 hover:text-white font-black uppercase tracking-widest text-xs transition-colors">
                                        Découvrir le workflow →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Institutional Roles Section - Clean Card Style */}
                <section id="vision" className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-20">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6">
                                Un Écosystème <span className="text-blue-600">Structuré.</span>
                            </h2>
                            <p className="text-slate-500 max-w-xl font-medium text-lg leading-relaxed">
                                Le système SGAFO s'adapte à chaque niveau de responsabilité pour garantir une fluidité totale de l'information.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { title: 'Direction Régionale', role: 'Responsable Formation', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', desc: 'Pilotage stratégique, validation des plans et suivi de la performance régionale.' },
                                { title: 'Chef de Complexe', role: 'Planification Locale', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', desc: 'Gestion opérationnelle des instituts et planification hebdomadaire des sessions.' },
                                { title: 'Espace Formateur', role: 'Parcours Hybride', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', desc: 'Gestion des séances, ressources pédagogiques et auto-évaluation continue.' }
                            ].map((item, i) => (
                                <div key={i} className="group bg-white p-8 rounded-[32px] border border-slate-200 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-8">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">{item.title}</h3>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">{item.role}</div>
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Workflow Digital - Timeline Style */}
                <section id="workflow" className="py-24 px-6 bg-white border-y border-slate-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4">Le Workflow Digitalisé.</h2>
                            <p className="text-slate-400 font-medium italic">Une traçabilité totale de l'expression du besoin à la clôture.</p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-12 relative">
                            {/* Horizontal Line for Desktop */}
                            <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-slate-100" />
                            
                            {[
                                { step: '01', title: 'Planification', desc: 'Saisie et configuration par les Chefs de Complexe.' },
                                { step: '02', title: 'Logistique', desc: 'Affectation des sites, hôtels et ressources.' },
                                { step: '03', title: 'Validation', desc: 'Validation technique et administrative par le RF.' },
                                { step: '04', title: 'Exécution', desc: 'Déroulement des séances et suivi de présence.' }
                            ].map((item, i) => (
                                <div key={i} className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                                    <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-50 shadow-xl flex items-center justify-center mb-8 hover:scale-110 transition-transform">
                                        <span className="text-2xl font-black text-slate-900">{item.step}</span>
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 mb-3">{item.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Institutional Clean */}
            <footer className="py-20 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shadow-sm">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                                <circle cx="50" cy="50" r="30" />
                            </svg>
                        </div>
                        <div className="flex flex-col text-left leading-none">
                            <span className="text-2xl font-black tracking-tighter text-slate-900">SGAFO</span>
                            <span className="text-[10px] font-black text-slate-400 tracking-[0.1em] uppercase">Espace Intranet • OFPPT 2026</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-10 text-[11px] font-black uppercase tracking-widest text-slate-400">
                        <a href="#" className="hover:text-blue-600 transition-colors">Portail OFPPT</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Assistance</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Sécurité</a>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                         <div className="px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm text-[10px] font-black text-slate-500">
                            Laravel v{laravelVersion} • PHP v{phpVersion}
                        </div>
                        <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">© 2026 Tous droits réservés</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
