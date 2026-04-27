import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const DOCS = {
    introduction: {
        title: "Introduction & Vision",
        content: `
            Le Système de Gestion de l'Apprentissage et de la Formation Continue (SGAFO) est l'outil central de digitalisation du workflow de formation au sein de l'OFPPT. 
            Il permet de fluidifier les échanges entre les Directions Régionales, les Complexes de Formation et les Formateurs.
        `,
        steps: [
            "Centralisation du catalogue national pour une meilleure visibilité",
            "Automatisation de la planification logistique et des réservations",
            "Suivi pédagogique en temps réel et évaluation par QCM",
            "Dématérialisation des feuilles d'émargement et des attestations"
        ]
    },
    cdc: {
        title: "Guide Chef de Complexe (CDC)",
        content: "En tant que CDC, vous êtes le garant de l'ingénierie et de la planification opérationnelle des formations de votre complexe.",
        sections: [
            {
                subtitle: "1. Initialisation du Plan de Formation",
                text: "Depuis votre dashboard, cliquez sur 'Nouveau Plan'. Saisissez l'entité bénéficiaire, le titre du plan et les dates globales prévisionnelles. Un plan commence toujours à l'état 'Brouillon'."
            },
            {
                subtitle: "2. Ingénierie des Thèmes (Modules)",
                text: "Ajoutez chaque module en précisant le volume horaire, les objectifs SMART et les animateurs pressentis. Le système vérifie en temps réel que l'animateur n'a pas d'autre séance programmée sur la même période."
            },
            {
                subtitle: "3. Gestion des Participants",
                text: "Sélectionnez les formateurs participants. Vous pouvez filtrer par établissement, spécialité ou secteur. Le système bloquera l'ajout si le participant dépasse son quota d'heures annuel de formation."
            },
            {
                subtitle: "4. Réservation Logistique",
                text: "Une fois le plan 'Soumis', vous devez finaliser la logistique : choix du site de formation (Interne/Externe) et sélection des hôtels partenaires pour les participants venant hors-ville."
            }
        ]
    },
    rf: {
        title: "Guide Responsable Formation (RF)",
        content: "Le RF (Direction Régionale) assure le pilotage stratégique et la validation finale des plans au niveau régional.",
        sections: [
            {
                subtitle: "1. Validation Administrative (Confirmation)",
                text: "Examinez les plans soumis par les CDC. Vérifiez l'adéquation avec le plan de développement régional. Si conforme, passez le statut à 'Confirmé'. En cas de rejet, saisissez un motif précis pour guider le CDC."
            },
            {
                subtitle: "2. Validation Technique (Mise en Production)",
                text: "Après confirmation, le plan doit être planifié (séances). Une fois le planning complet, le RF effectue la validation finale pour injection dans le Catalogue National et ouverture des sessions."
            },
            {
                subtitle: "3. Pilotage & Tableaux de Bord",
                text: "Utilisez l'onglet 'Pilotage' pour suivre le taux de réalisation des formations, le budget consommé (hôtellerie/transport) et le taux de satisfaction des participants."
            }
        ]
    },
    animateur: {
        title: "Guide Animateur (Expert)",
        content: "L'animateur est un expert métier chargé de la transmission des compétences lors des sessions de formation.",
        sections: [
            {
                subtitle: "1. Préparation Pédagogique",
                text: "Accédez à vos thèmes assignés et déposez vos ressources (PDF, supports, liens). Ces documents seront visibles par les participants inscrits à vos modules."
            },
            {
                subtitle: "2. Gestion des Séances & Émargement",
                text: "Pour chaque séance, validez la présence numérique des participants. En fin de module, vous devez confirmer l'assiduité pour permettre la génération des attestations."
            },
            {
                subtitle: "3. Rapport d'Animation",
                text: "Après la clôture d'un module, saisissez votre bilan pédagogique : points forts, difficultés rencontrées et recommandations pour les sessions futures."
            }
        ]
    },
    participant: {
        title: "Guide Participant (Apprenant)",
        content: "Le participant utilise le système pour suivre son parcours de montée en compétences et accéder aux ressources.",
        sections: [
            {
                subtitle: "1. Consultation du Catalogue National",
                text: "Découvrez l'offre de formation disponible. Vous pouvez consulter les programmes validés et voir les dates prévues pour les prochaines sessions."
            },
            {
                subtitle: "2. Évaluations & QCM",
                text: "Répondez aux tests de positionnement avant le démarrage et passez l'évaluation finale. Vos scores sont enregistrés dans votre dossier de formation personnel."
            },
            {
                subtitle: "3. Documents & Attestations",
                text: "Téléchargez vos attestations de réussite une fois la formation clôturée. Vous avez également accès à l'historique complet de vos formations passées."
            }
        ]
    }
};

export default function Documentation() {
    const [activeSection, setActiveSection] = useState<keyof typeof DOCS>('introduction');

    return (
        <div className="bg-slate-50 min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Head title="Documentation Intégrale SGAFO" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                {/* Header Navigation */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-12 px-4 gap-6">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center p-3 shadow-2xl shadow-slate-900/20 group-hover:bg-blue-600 transition-all">
                                <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="currentColor"><circle cx="50" cy="50" r="40" /></svg>
                        </div>
                        <div className="flex flex-col leading-none text-left">
                            <span className="text-3xl font-black tracking-tighter text-slate-900 uppercase">SGAFO</span>
                            <span className="text-[11px] font-black text-blue-600 tracking-widest uppercase">Espace Aide & Support</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-4">
                        <a 
                            href={route('documentation.download')} 
                            className="px-8 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-slate-900/20 hover:bg-blue-600 transition-all flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3" /></svg>
                            Télécharger Guide PDF
                        </a>
                        <Link href={route('login')} className="px-8 py-4 bg-white text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-2xl border border-slate-200 shadow-xl hover:bg-slate-50 transition-all">Connexion</Link>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-2xl shadow-slate-200/50 sm:rounded-[48px] flex flex-col md:flex-row min-h-[75vh] border border-slate-100">
                    
                    {/* Sidebar */}
                    <div className="w-full md:w-80 border-r border-slate-100 bg-slate-50/50 p-10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10 border-b border-slate-200 pb-3">Sommaire du Manuel</h3>
                        <nav className="space-y-3">
                            {Object.entries(DOCS).map(([key, section]) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveSection(key as keyof typeof DOCS)}
                                    className={`w-full text-left px-6 py-5 rounded-[24px] text-sm font-bold transition-all flex items-center justify-between group ${
                                        activeSection === key 
                                        ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' 
                                        : 'text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
                                    }`}
                                >
                                    <span className="truncate">{section.title}</span>
                                    <svg className={`w-4 h-4 shrink-0 transition-transform ${activeSection === key ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            ))}
                        </nav>
                        
                        <div className="mt-16 p-8 bg-blue-600 rounded-[32px] text-white shadow-2xl shadow-blue-600/30">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-4">Assistance OFPPT</p>
                            <p className="text-xs font-medium leading-relaxed mb-6 italic opacity-90">Une équipe dédiée pour vous accompagner sur SGAFO.</p>
                            <a href="mailto:support.sgafo@ofppt.ma" className="text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4">support.sgafo@ofppt.ma</a>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 md:p-20 bg-white">
                        <div className="max-w-3xl text-left">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-12 border border-slate-100">
                                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                Guide de Référence Certifié • v1.0.5
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-10 leading-[0.95]">
                                {DOCS[activeSection].title}
                            </h1>
                            
                            <p className="text-2xl text-slate-400 font-medium leading-relaxed mb-16 border-l-[6px] border-blue-600 pl-8 py-3">
                                {DOCS[activeSection].content}
                            </p>

                            {'steps' in DOCS[activeSection] && (
                                <div className="grid gap-8">
                                    {(DOCS[activeSection] as any).steps.map((step: string, i: number) => (
                                        <div key={i} className="flex items-start gap-8 p-10 bg-slate-50 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                                            <div className="shrink-0 w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-lg group-hover:bg-blue-600 transition-colors">
                                                0{i + 1}
                                            </div>
                                            <span className="font-bold text-slate-700 text-xl leading-tight pt-3">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {'sections' in DOCS[activeSection] && (
                                <div className="space-y-20">
                                    {(DOCS[activeSection] as any).sections.map((sec: any, i: number) => (
                                        <div key={i} className="relative pl-16 border-l-2 border-slate-100 group">
                                            <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-4 border-slate-200 group-hover:border-blue-600 group-hover:scale-125 transition-all shadow-md" />
                                            <h4 className="text-3xl font-black text-slate-900 mb-6 tracking-tight group-hover:text-blue-600 transition-colors leading-none">{sec.subtitle}</h4>
                                            <p className="text-xl text-slate-500 leading-relaxed font-medium">{sec.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <footer className="py-20 px-6 border-t border-slate-200 mt-20">
                 <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center p-2">
                             <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="currentColor"><circle cx="50" cy="50" r="40" /></svg>
                        </div>
                        <span className="text-xl font-black text-slate-900">SGAFO</span>
                    </div>
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">© 2026 Portail Institutionnel de la Formation Continue • OFPPT Maroc</p>
                 </div>
            </footer>
        </div>
    );
}
