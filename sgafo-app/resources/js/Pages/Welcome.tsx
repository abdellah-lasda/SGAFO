import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Logo from '@/Components/Logo';
import { PlanFormation } from '@/types/plan';
import { ArrowRight, Users, BookOpen, Clock, Shield, Award, ChevronDown, MonitorPlay, Zap, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    laravelVersion?: string;
    phpVersion?: string;
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

// Framer Motion Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

export default function Welcome({
    auth,
    stats,
    latestPlans,
}: WelcomeProps) {
    const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

    // Auto-slide logic
    useEffect(() => {
        if (latestPlans.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentPlanIndex((prev) => (prev + 1) % latestPlans.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [latestPlans]);

    // Scroll listener for Navbar
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
            <Head title="SGAFO • Portail Institutionnel" />

            {/* Glowing Soft Orbs Background for Light Mode */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse" 
                    style={{ animationDuration: '8s' }} 
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse" 
                    style={{ animationDuration: '10s' }} 
                />
            </div>

            {/* Premium Glass Navbar Light */}
            <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 py-4 shadow-sm shadow-slate-200/50' : 'bg-transparent py-6'}`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <Logo variant="brand" size="lg" showText={false} className="group-hover:scale-110 transition-transform duration-500 shadow-md shadow-blue-500/20" />
                        <div className="flex flex-col leading-none">
                            <span className="text-2xl font-black tracking-tighter text-slate-900">SGAFO</span>
                            <span className="text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">OFPPT Maroc</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-8">
                            <a href="#performance" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Performance</a>
                            <a href="#catalogue" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Catalogue</a>
                            <a href="#support" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Support</a>
                        </div>
                        <div className="h-6 w-px bg-slate-200" />
                        {auth.user ? (
                            <Link href={route('dashboard')} className="px-6 py-2.5 bg-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all duration-300 shadow-sm border border-slate-200/50">Mon Espace</Link>
                        ) : (
                            <Link href={route('login')} className="px-6 py-2.5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 hover:-translate-y-0.5 transition-all duration-300">Connexion</Link>
                        )}
                    </div>
                </div>
            </motion.nav>

            <main>
                {/* Cinematic Hero Section Light */}
                <section className="relative pt-40 pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh]">
                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="max-w-5xl mx-auto text-center relative z-10"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8 shadow-sm shadow-blue-100">
                            <Zap className="w-4 h-4 text-blue-600" />
                            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-blue-600">Plateforme Intranet Officielle</span>
                        </motion.div>
                        
                        <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[1.05] mb-8 drop-shadow-sm">
                            L'Excellence <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                                Pédagogique Digitalisée.
                            </span>
                        </motion.h1>
                        
                        <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed mb-14 max-w-3xl mx-auto">
                            SGAFO centralise la planification stratégique, l'ingénierie et le pilotage des actions de formation continue pour le réseau OFPPT.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                href={route('login')}
                                className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-blue-600 hover:shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group"
                            >
                                Accéder au Système
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="#catalogue" className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-700 font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-slate-50 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group">
                                Voir le Catalogue
                                <MonitorPlay className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            </a>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Light Stats Section with Scroll Animation */}
                <section id="performance" className="py-24 px-6 relative z-10 overflow-hidden">
                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="max-w-7xl mx-auto"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Formateurs Experts', value: stats.formateurs, icon: Users, color: 'blue' },
                                { label: 'Programmes Validés', value: stats.plans, icon: Award, color: 'indigo' },
                                { label: 'Secteurs Couverts', value: stats.secteurs, icon: Shield, color: 'emerald' },
                                { label: 'Volume Horaire', value: `${stats.totalHeures}h`, icon: Clock, color: 'orange' },
                            ].map((stat, i) => (
                                <motion.div 
                                    variants={fadeInUp}
                                    key={i} 
                                    className="group relative bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-xl shadow-slate-200/20 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-3xl group-hover:bg-${stat.color}-500/10 transition-colors duration-500`} />
                                    
                                    <div className="relative z-10">
                                        <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 border border-${stat.color}-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                            <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                                        </div>
                                        <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tighter">{stat.value}</div>
                                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Modern Light Catalogue Showcase */}
                <section id="catalogue" className="py-32 px-6">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="max-w-7xl mx-auto"
                    >
                        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                            <motion.div variants={fadeInUp} className="max-w-2xl">
                                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">Catalogue National.</h2>
                                <p className="text-slate-500 text-lg md:text-xl font-medium">Découvrez les dernières thématiques d'ingénierie certifiées et déployées sur l'ensemble du réseau.</p>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="flex gap-4">
                                <button onClick={() => setCurrentPlanIndex((prev) => (prev - 1 + latestPlans.length) % latestPlans.length)} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-blue-600 shadow-sm transition-all group">
                                    <ArrowRight className="w-6 h-6 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <button onClick={() => setCurrentPlanIndex((prev) => (prev + 1) % latestPlans.length)} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-blue-600 shadow-sm transition-all group">
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        </div>

                        {latestPlans.length > 0 ? (
                            <motion.div variants={fadeInUp} className="relative min-h-[500px]">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentPlanIndex}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute inset-0 z-20"
                                    >
                                        <div className="bg-white rounded-[40px] border border-slate-200/80 shadow-2xl shadow-slate-200/50 overflow-hidden group h-full">
                                            <div className="grid lg:grid-cols-2 gap-0 h-full">
                                                
                                                {/* Card Content Light */}
                                                <div className="p-10 md:p-16 flex flex-col justify-center">
                                                    <div className="flex items-center gap-3 mb-8">
                                                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                                            {latestPlans[currentPlanIndex].entite?.secteur?.nom}
                                                        </span>
                                                        <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                                            {latestPlans[currentPlanIndex].plateforme ? 'À distance' : 'Présentiel'}
                                                        </span>
                                                    </div>
                                                    
                                                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tighter line-clamp-3">
                                                        {latestPlans[currentPlanIndex].titre}
                                                    </h3>
                                                    
                                                    <p className="text-slate-500 font-medium text-lg leading-relaxed line-clamp-2 mb-10">
                                                        {latestPlans[currentPlanIndex].themes?.[0]?.objectifs || 'Amélioration des compétences techniques et pédagogiques spécifiques au secteur.'}
                                                    </p>

                                                    <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                                                        <div>
                                                            <div className="text-3xl font-black text-slate-900">{latestPlans[currentPlanIndex].themes?.length || 0}</div>
                                                            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Modules</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-3xl font-black text-slate-900">{latestPlans[currentPlanIndex].animateurs_count}</div>
                                                            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Experts</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-3xl font-black text-slate-900">{latestPlans[currentPlanIndex].participants_count}</div>
                                                            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Inscrits</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card Visual / Abstract Light */}
                                                <div className="hidden lg:flex relative bg-slate-50 p-16 items-center justify-center border-l border-slate-100 overflow-hidden">
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                                    
                                                    <div className="relative z-10 w-full max-w-sm">
                                                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white p-8 shadow-2xl shadow-slate-200/60 transform translate-x-4 group-hover:translate-x-0 transition-transform duration-700">
                                                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6 shadow-inner border border-blue-200/50">
                                                                <BookOpen className="w-6 h-6 text-blue-600" />
                                                            </div>
                                                            <div className="text-slate-900 font-bold text-xl mb-2">{latestPlans[currentPlanIndex].entite?.titre}</div>
                                                            <div className="text-slate-500 text-sm font-medium">
                                                                {new Date(latestPlans[currentPlanIndex].date_debut).toLocaleDateString('fr-FR')} - {new Date(latestPlans[currentPlanIndex].date_fin).toLocaleDateString('fr-FR')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Progress Indicator */}
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
                                    {latestPlans.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPlanIndex(i)}
                                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                                i === currentPlanIndex ? 'w-10 bg-blue-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div variants={fadeInUp} className="bg-white rounded-[48px] p-32 text-center border border-slate-200/60 shadow-sm">
                                <MonitorPlay className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Catalogue en cours de mise à jour</h3>
                                <p className="text-slate-500 font-medium">Les programmes certifiés apparaîtront ici prochainement.</p>
                            </motion.div>
                        )}
                    </motion.div>
                </section>

                {/* Light Support & FAQ */}
                <section id="support" className="py-32 px-6 border-t border-slate-200 bg-white">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="max-w-7xl mx-auto"
                    >
                        <div className="grid lg:grid-cols-2 gap-20">
                            <motion.div variants={fadeInUp}>
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8 shadow-sm">
                                    <Shield className="w-4 h-4 text-indigo-600" />
                                    <span className="text-[11px] font-black tracking-[0.2em] uppercase text-indigo-600">Assistance Intégrale</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6">Nous sommes là pour vous.</h2>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12">
                                    Découvrez nos guides d'utilisation interactifs ou contactez l'équipe d'administration centrale pour toute requête technique liée à votre espace de travail.
                                </p>
                                
                                <div className="flex gap-4">
                                    <Link href={route('documentation')} className="px-8 py-4 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 flex items-center gap-3 group">
                                        Documentation Globale
                                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Link>
                                    <a href="mailto:support.sgafo@ofppt.ma" className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all hover:-translate-y-1">
                                        <MonitorPlay className="w-6 h-6" />
                                    </a>
                                </div>
                            </motion.div>

                            <motion.div variants={staggerContainer} className="space-y-4">
                                {FAQ_DATA.map((faq, i) => (
                                    <motion.div 
                                        variants={fadeInUp}
                                        key={i} 
                                        className={`bg-slate-50 border rounded-2xl transition-all duration-300 overflow-hidden ${activeFaqIndex === i ? 'border-blue-500/50 shadow-md shadow-blue-500/10 bg-white' : 'border-slate-200 hover:border-slate-300 hover:bg-white'}`}
                                    >
                                        <button 
                                            onClick={() => setActiveFaqIndex(activeFaqIndex === i ? null : i)}
                                            className="w-full flex items-center justify-between p-6 text-left"
                                        >
                                            <span className={`text-sm font-bold ${activeFaqIndex === i ? 'text-blue-600' : 'text-slate-900'}`}>{faq.question}</span>
                                            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeFaqIndex === i ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                                        </button>
                                        <div 
                                            className={`transition-all duration-500 ease-in-out ${activeFaqIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                                        >
                                            <p className="px-6 pb-6 text-sm text-slate-500 leading-relaxed font-medium">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* Light Footer */}
            <motion.footer 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="py-12 px-6 border-t border-slate-200 bg-slate-50 relative overflow-hidden"
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <Logo variant="brand" size="lg" showText={false} />
                        <div className="flex flex-col text-left leading-none">
                            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">SGAFO</span>
                            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase mt-1">Plateforme Intranet • 2026</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span>Assistance Centrale</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span>Support Technique</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span>OFPPT MAROC</span>
                    </div>
                </div>
            </motion.footer>
        </div>
    );
}
