import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { PlanFormation } from '@/types/plan';

interface WelcomeProps extends PageProps {
    stats: {
        formateurs: number;
        plans: number;
        secteurs: number;
        totalHeures: number;
    };
    latestPlans: (PlanFormation & { 
        participants_count: number, 
        animateurs_count: number 
    })[];
    laravelVersion: string;
    phpVersion: string;
}

const FAQ_DATA = [
    {
        question: "Comment créer un nouveau plan de formation ?",
        answer: "Les Chefs de Complexe (CDC) peuvent initier un nouveau plan via le bouton 'Nouveau Plan' de leur dashboard. Le processus suit un stepper structuré : Identification, Thèmes, Participants et Logistique."
    },
    {
        question: "Quel est le circuit de validation d'un plan ?",
        answer: "Un plan est d'abord 'Soumis' par le CDC. Il est ensuite 'Confirmé' administrativement par la Direction Régionale (RF), puis 'Validé' techniquement une fois le planning et les ressources finalisés."
    },
    {
        question: "Comment sont affectés les animateurs ?",
        answer: "L'affectation se fait par thème. Un thème peut avoir un ou plusieurs animateurs (co-animation). Le système vérifie automatiquement la disponibilité des formateurs pour éviter les conflits de planning."
    },
    {
        question: "Qui peut accéder au Catalogue National ?",
        answer: "Le Catalogue National est une bibliothèque publique au sein de l'OFPPT. Tous les utilisateurs authentifiés peuvent consulter les plans ayant atteint le statut final 'Validé'."
    }
];

export default function Welcome({
    auth,
    stats,
    latestPlans,
    laravelVersion,
    phpVersion,
}: WelcomeProps) {
    const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

    // Auto-slide logic
    useEffect(() => {
        if (latestPlans.length <= 1) return;
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [latestPlans, currentPlanIndex]);

    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentPlanIndex((prev) => (prev + 1) % latestPlans.length);
            setIsAnimating(false);
        }, 500);
    };

    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentPlanIndex((prev) => (prev - 1 + latestPlans.length) % latestPlans.length);
            setIsAnimating(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
            <Head title="SGAFO • OFPPT - Portail Institutionnel" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center p-1.5 shadow-xl shadow-slate-900/10">
                             <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="currentColor"><circle cx="50" cy="50" r="35" /><path d="M20 20h60v10H20zM20 70h60v10H20z" className="opacity-30"/></svg>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-2xl font-black tracking-tighter text-slate-900">SGAFO</span>
                            <span className="text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">OFPPT Maroc</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-6">
                            <a href="#stats" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all">Performance</a>
                            <a href="#carousel" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all">Actualités</a>
                            <a href="#support" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all">Support</a>
                        </div>
                        <div className="h-6 w-px bg-slate-200" />
                        {auth.user ? (
                            <Link href={route('dashboard')} className="px-6 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">Tableau de bord</Link>
                        ) : (
                            <Link href={route('login')} className="px-6 py-3 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">Espace Sécurisé</Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="pt-20">
                {/* Hero Institutional */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative overflow-hidden rounded-[48px] bg-slate-900 p-12 md:p-24 shadow-2xl">
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
                            
                            <div className="relative z-10 max-w-4xl">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-10 animate-fade-in">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[11px] font-black tracking-[0.2em] uppercase text-blue-400">Digitalisation des Flux de Formation</span>
                                </div>
                                
                                <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-[1] mb-8">
                                    L'Excellence <br />
                                    <span className="text-blue-500">Pédagogique Digitalisée.</span>
                                </h1>
                                
                                <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed mb-14 max-w-3xl">
                                    Plateforme centralisée pour la planification stratégique, la logistique et l'évaluation continue des formateurs de l'OFPPT.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-8">
                                    <Link
                                        href={route('login')}
                                        className="w-full sm:w-auto px-12 py-5 bg-white text-slate-900 font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4 group"
                                    >
                                        Connexion Intranet
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7M5 12h16" /></svg>
                                    </Link>
                                    <a href="#carousel" className="text-white/40 hover:text-white font-black uppercase tracking-widest text-xs transition-colors border-b-2 border-white/10 pb-1">Voir les derniers plans</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statistics Banner */}
                <section id="stats" className="pb-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                            {[
                                { label: 'Formateurs', value: stats.formateurs, icon: 'Users', color: 'bg-blue-50 text-blue-600' },
                                { label: 'Plans Validés', value: stats.plans, icon: 'Clipboard', color: 'bg-indigo-50 text-indigo-600' },
                                { label: 'Secteurs', value: stats.secteurs, icon: 'Layers', color: 'bg-emerald-50 text-emerald-600' },
                                { label: 'Heures / An', value: `${stats.totalHeures}h`, icon: 'Clock', color: 'bg-orange-50 text-orange-600' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-xl shadow-slate-200/20 hover:scale-105 transition-all group">
                                    <div className="text-5xl font-black text-slate-900 mb-3 tracking-tighter group-hover:scale-110 transition-transform">{stat.value}</div>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${stat.color.replace('text-', 'bg-')}`} />
                                        <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Enhanced Carousel Section */}
                <section id="carousel" className="py-32 px-6 bg-white border-y border-slate-100 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                            <div className="text-left max-w-2xl">
                                <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">Dernières Validations.</h2>
                                <p className="text-slate-400 text-lg font-medium italic">Zoom sur les nouveaux programmes de formation certifiés par la Direction Régionale.</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={handlePrev} className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button onClick={handleNext} className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>

                        {latestPlans.length > 0 ? (
                            <div className="relative min-h-[900px] md:min-h-[600px] lg:min-h-[500px]">
                                {latestPlans.map((plan, index) => (
                                    <div
                                        key={plan.id}
                                        className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                                            index === currentPlanIndex 
                                                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                                                : 'opacity-0 scale-95 translate-y-8 pointer-events-none'
                                        }`}
                                    >
                                        <div className="grid lg:grid-cols-12 gap-0 overflow-hidden bg-white rounded-[32px] md:rounded-[48px] border border-slate-200 shadow-2xl h-full min-h-[900px] md:min-h-[600px] lg:min-h-[500px]">
                                            {/* Left Column: Main Info */}
                                            <div className="lg:col-span-7 p-6 sm:p-10 md:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-100">
                                                <div className="flex items-center gap-3 mb-8">
                                                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-black uppercase tracking-widest border border-blue-100">
                                                        {plan.entite?.secteur?.nom}
                                                    </span>
                                                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border ${
                                                        plan.plateforme ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                                    }`}>
                                                        {plan.plateforme ? `À distance (${plan.plateforme})` : 'Présentiel'}
                                                    </span>
                                                </div>
                                                
                                                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6 md:mb-8 tracking-tighter">
                                                    {plan.titre}
                                                </h3>
                                                
                                                <div className="space-y-4 mb-10">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-1 h-1 rounded-full bg-blue-600 mt-2" />
                                                        <p className="text-slate-500 font-medium text-lg leading-relaxed line-clamp-2 italic">
                                                            "{plan.themes?.[0]?.objectifs || 'Amélioration des compétences techniques et pédagogiques...'}"
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4 sm:gap-8 p-6 sm:p-8 bg-slate-50 rounded-2xl sm:rounded-[32px] border border-slate-100">
                                                    <div>
                                                        <div className="text-3xl font-black text-slate-900 tracking-tighter">{plan.themes?.length || 0}</div>
                                                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Modules</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-3xl font-black text-slate-900 tracking-tighter">{plan.animateurs_count}</div>
                                                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Animateurs</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xl sm:text-3xl font-black text-slate-900 tracking-tighter">{plan.participants_count}</div>
                                                        <div className="text-[8px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest text-center sm:text-left">Participants</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Meta Info */}
                                            <div className="lg:col-span-5 bg-slate-50/50 p-6 sm:p-10 md:p-16 flex flex-col justify-center space-y-6 md:space-y-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-slate-100 text-xl font-black text-slate-900 uppercase">
                                                        {plan.createur?.prenom[0]}{plan.createur?.nom[0]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xl font-black text-slate-900">{plan.createur?.prenom} {plan.createur?.nom}</span>
                                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Responsable de Plan</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-6 pt-6 border-t border-slate-200">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Période</span>
                                                        <span className="text-sm font-black text-slate-900 uppercase">Du {new Date(plan.date_debut).toLocaleDateString('fr-FR')} au {new Date(plan.date_fin).toLocaleDateString('fr-FR')}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Volume</span>
                                                        <span className="text-sm font-black text-slate-900">{plan.themes?.reduce((acc, t) => acc + Number(t.duree_heures), 0)} Heures</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Entité</span>
                                                        <span className="text-sm font-black text-blue-600 truncate max-w-[200px]">{plan.entite?.titre}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Progress Dots */}
                                <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 flex gap-3">
                                    {latestPlans.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPlanIndex(i)}
                                            className={`h-2.5 rounded-full transition-all duration-500 ${
                                                i === currentPlanIndex ? 'w-12 bg-blue-600' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-[48px] p-32 text-center border-2 border-dashed border-slate-200">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                                    <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Aucune actualité disponible</h3>
                                <p className="text-slate-400 font-medium">Les nouveaux plans validés apparaîtront ici automatiquement.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Institutional Support Hub */}
                <section id="support" className="py-40 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12 text-center md:text-left">
                            <div className="max-w-2xl">
                                <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">Assistance Technique.</h2>
                                <p className="text-slate-500 text-xl font-medium leading-relaxed">
                                    Un problème d'accès ? Besoin d'un guide ? Notre équipe est là pour vous accompagner dans la prise en main de l'écosystème SGAFO.
                                </p>
                            </div>
                            <div className="shrink-0">
                                <a href="mailto:support.sgafo@ofppt.ma" className="inline-flex flex-col items-center gap-4 group">
                                    <div className="w-24 h-24 rounded-[32px] bg-slate-900 flex items-center justify-center text-white shadow-2xl group-hover:bg-blue-600 transition-all">
                                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-900 transition-colors">Ouvrir un ticket</span>
                                </a>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-10">
                            {/* FAQ Interactive */}
                            <div className="group bg-white p-10 md:p-12 rounded-[48px] border border-slate-200/60 shadow-xl shadow-slate-200/10 hover:border-blue-500/30 transition-all">
                                <h4 className="text-2xl font-black mb-8 uppercase tracking-tighter">Questions Fréquentes</h4>
                                <div className="space-y-4">
                                    {FAQ_DATA.map((faq, i) => (
                                        <div key={i} className="border-b border-slate-100 last:border-0 pb-4">
                                            <button 
                                                onClick={() => setActiveFaqIndex(activeFaqIndex === i ? null : i)}
                                                className="w-full flex items-center justify-between text-left group/item"
                                            >
                                                <span className={`text-sm font-bold transition-colors ${activeFaqIndex === i ? 'text-blue-600' : 'text-slate-600 group-hover/item:text-slate-900'}`}>
                                                    {faq.question}
                                                </span>
                                                <svg 
                                                    className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${activeFaqIndex === i ? 'rotate-180 text-blue-500' : ''}`} 
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <div className={`overflow-hidden transition-all duration-300 ${activeFaqIndex === i ? 'max-h-40 mt-4' : 'max-h-0'}`}>
                                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            {/* Guides */}
                            <div className="group bg-white p-12 rounded-[48px] border border-slate-200/60 shadow-xl shadow-slate-200/10 hover:border-blue-500/30 transition-all">
                                <h4 className="text-2xl font-black mb-8 uppercase tracking-tighter">Documentation</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <Link 
                                        href={route('documentation')}
                                        className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-900 hover:text-white transition-all group/btn"
                                    >
                                        <span className="text-[11px] font-black uppercase tracking-widest">Guide Intégral (Portail)</span>
                                        <svg className="w-5 h-5 text-slate-300 group-hover/btn:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3" /></svg>
                                    </Link>
                                    <button className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-900 hover:text-white transition-all group/btn">
                                        <span className="text-[11px] font-black uppercase tracking-widest">Tutoriel Vidéo CDC</span>
                                        <svg className="w-5 h-5 text-slate-300 group-hover/btn:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Infrastructure */}
                            <div className="bg-blue-600 p-12 rounded-[48px] shadow-2xl shadow-blue-600/30 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                                <h4 className="text-2xl font-black mb-6 uppercase tracking-tighter relative z-10">Infrastructure</h4>
                                <div className="space-y-4 relative z-10">
                                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                        <div className="text-[10px] font-black uppercase text-white/60 mb-1">Version Logicielle</div>
                                        <div className="font-bold">Laravel v{laravelVersion} / PHP v{phpVersion}</div>
                                    </div>
                                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                        <div className="text-[10px] font-black uppercase text-white/60 mb-1">Environnement</div>
                                        <div className="font-bold uppercase tracking-widest text-xs">Production Intranet</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Institutional Footer */}
            <footer className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-sm">
                             <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor"><circle cx="50" cy="50" r="40" /></svg>
                        </div>
                        <div className="flex flex-col text-left leading-none">
                            <span className="text-3xl font-black tracking-tighter text-slate-900 uppercase">SGAFO</span>
                            <span className="text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase">Espace Intranet • OFPPT 2026</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-12 text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <a href="#" className="hover:text-blue-600 transition-colors">Portail</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Sécurité</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Cookies</a>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-16 pt-10 border-t border-slate-200/60 text-center">
                    <p className="text-[11px] text-slate-300 font-bold uppercase tracking-[0.3em]">© 2026 Office de la Formation Professionnelle et de la Promotion du Travail</p>
                </div>
            </footer>
        </div>
    );
}
