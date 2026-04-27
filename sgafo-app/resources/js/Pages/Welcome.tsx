import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30 font-sans selection:text-blue-200">
            <Head title="SGAFO • OFPPT - Système de Gestion de la Formation" />

            {/* Navigation Institutional */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Styled OFPPT-like Logo Wrapper */}
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-1 shadow-lg ring-1 ring-white/10">
                                <svg viewBox="0 0 100 100" className="w-full h-full text-[#0f172a]" fill="currentColor">
                                    <path d="M20 20h60v10H20zM20 45h60v10H20zM20 70h60v10H20z" className="opacity-20" />
                                    <path d="M10 10v80h80V10H10zm70 70H20V20h60v60z" />
                                    <circle cx="50" cy="50" r="15" />
                                </svg>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-xl font-black tracking-tighter text-white">SGAFO</span>
                                <span className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase">OFPPT Maroc</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#ecosysteme" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Écosystème</a>
                        <a href="#workflow" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Workflow</a>
                        <div className="h-4 w-px bg-white/10" />
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-blue-600/20"
                            >
                                Mon Tableau de bord
                            </Link>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link
                                    href={route('login')}
                                    className="px-6 py-2.5 bg-white text-[#0f172a] text-xs font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
                                >
                                    Espace Authentifié
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Institutional Section */}
            <section className="relative pt-48 pb-32 overflow-hidden border-b border-white/5">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1)_0%,transparent_50%)] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-10">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12V11.12a1 1 0 00.553.894l4 2a1 1 0 00.894 0l4-2a1 1 0 00.553-.894V10.12l1.69-.724a1 1 0 011.144 1.707L11.394 15.12a1 1 0 01-.788 0L4.456 11.12a1 1 0 011.144-1.707H3.31z" />
                        </svg>
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-blue-400">Digitalisation de la Formation Continue</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-8">
                        Système de Gestion de l'Apprentissage <br />
                        <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">et de la Formation</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                        Plateforme institutionnelle centralisée pour l'optimisation des parcours de formation des formateurs de l'OFPPT. 
                        Gérez vos complexes, planifiez vos sessions et analysez la performance pédagogique.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        {!auth.user ? (
                            <Link
                                href={route('login')}
                                className="w-full sm:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 group"
                            >
                                Accéder à l'espace sécurisé
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ) : (
                            <Link
                                href={route('dashboard')}
                                className="w-full sm:w-auto px-12 py-5 bg-white text-[#0f172a] font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-2xl shadow-white/5 flex items-center justify-center gap-3 group"
                            >
                                Retour au Dashboard
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        )}
                        <a href="#ecosysteme" className="w-full sm:w-auto px-10 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-black uppercase tracking-widest text-sm rounded-xl transition-all border border-white/5">
                            En savoir plus
                        </a>
                    </div>
                </div>
            </section>

            {/* Ecosystem Sections */}
            <section id="ecosysteme" className="py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-8 leading-tight">
                                Une architecture pensée pour <br />
                                <span className="text-blue-500 text-4xl md:text-6xl">chaque niveau d'action.</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg mb-1">Direction Régionale (RF)</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">Pilotage stratégique, validation des plans et suivi de la performance régionale.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg mb-1">Chef de Complexe (CDC)</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">Gestion opérationnelle des instituts et planification des sessions locales.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg mb-1">Formateurs & Apprenants</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">Espace pédagogique dédié pour l'animation et le suivi des formations reçues.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-blue-500/10 blur-3xl rounded-full" />
                            <div className="relative bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl">
                                <div className="space-y-6">
                                    <div className="h-4 bg-white/10 rounded-full w-1/3" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-32 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-white">95%</div>
                                                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Taux Présence</div>
                                            </div>
                                        </div>
                                        <div className="h-32 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-white">12</div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Plans Actifs</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-40 bg-white/5 rounded-2xl border border-white/5 p-4">
                                        <div className="flex gap-2 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-red-400" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                            <div className="w-2 h-2 rounded-full bg-green-400" />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-2 bg-white/10 rounded-full w-full" />
                                            <div className="h-2 bg-white/10 rounded-full w-5/6" />
                                            <div className="h-2 bg-white/10 rounded-full w-4/6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Timeline Section */}
            <section id="workflow" className="py-32 bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-6 text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Workflow Digitalisé</h2>
                    <p className="text-slate-400 font-medium max-w-xl mx-auto italic">De l'expression du besoin à la validation finale.</p>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
                    {[
                        { step: '01', title: 'Planification', desc: 'Saisie des besoins et sessions par les CDC.' },
                        { step: '02', title: 'Logistique', desc: 'Affectation des sites et ressources.' },
                        { step: '03', title: 'Validation', desc: 'Revue technique et administrative par le RF.' },
                        { step: '04', title: 'Exécution', desc: 'Lancement des séances et suivi pédagogique.' },
                    ].map((item) => (
                        <div key={item.step} className="relative p-8 rounded-3xl bg-white/5 border border-white/10 text-left hover:bg-white/[0.08] transition-all">
                            <div className="text-4xl font-black text-blue-500/20 absolute top-4 right-6">{item.step}</div>
                            <h3 className="text-xl font-black mb-3 text-white">{item.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
            
            {/* CTA Institutional Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-12 md:p-20 overflow-hidden text-center">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none" />
                        
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 relative z-10">
                            Prêt à digitaliser vos <br /> processus de formation ?
                        </h2>
                        <p className="text-blue-100 mb-12 max-w-2xl mx-auto font-medium text-lg relative z-10">
                            Accédez à votre espace personnel pour gérer vos séances, consulter vos ressources et suivre votre progression.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                            <Link
                                href={route('login')}
                                className="w-full sm:w-auto px-12 py-5 bg-white text-blue-600 font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-blue-50 transition-all shadow-2xl shadow-blue-900/40"
                            >
                                Se connecter à l'intranet
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Institutional */}
            <footer className="py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1">
                                <svg viewBox="0 0 100 100" className="w-full h-full text-[#0f172a]" fill="currentColor">
                                    <circle cx="50" cy="50" r="30" />
                                    <path d="M20 20h60v60H20z" className="opacity-10" />
                                </svg>
                            </div>
                            <div className="flex flex-col text-left leading-none">
                                <span className="text-2xl font-black tracking-tighter">SGAFO</span>
                                <span className="text-[10px] font-bold text-slate-500 tracking-[0.1em] uppercase">Espace Intranet • OFPPT</span>
                            </div>
                        </div>

                        <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <a href="#" className="hover:text-blue-400 transition-colors">Portail OFPPT</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Support Technique</a>
                            <a href="#" className="hover:text-blue-400 transition-colors">Conditions d'Accès</a>
                        </div>
                    </div>
                    
                    <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-bold text-slate-500">
                        <p>© 2026 Système de Gestion Apprentissage et Formation Continue. Tous droits réservés.</p>
                        <p className="px-4 py-2 bg-white/5 rounded-full border border-white/5">Infrastructure : Laravel v{laravelVersion} <span className="mx-2 opacity-30">/</span> PHP v{phpVersion}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
