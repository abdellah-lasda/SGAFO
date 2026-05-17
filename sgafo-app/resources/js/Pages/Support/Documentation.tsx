import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Logo from '@/Components/Logo';
import { Search, ChevronRight, Hash, BookOpen, Layers, Layout, Box, Code, GraduationCap, MessageSquare } from 'lucide-react';

const TOP_SIDEBAR_LINKS = [
    { name: "Documentation", icon: BookOpen, active: true },
    { name: "Components", icon: Layers },
    { name: "Templates", icon: Layout },
    { name: "UI Kit", icon: Box },
    { name: "Playground", icon: Code },
    { name: "Course", icon: GraduationCap, badge: "NEW" },
    { name: "Community", icon: MessageSquare },
];

const NAVIGATION = [
    {
        title: "GETTING STARTED",
        links: [
            { id: "introduction", title: "Introduction & Vision" },
            { id: "architecture", title: "Architecture du Système" },
        ]
    },
    {
        title: "GUIDES UTILISATEURS",
        links: [
            { id: "cdc", title: "Chef de Complexe (CDC)" },
            { id: "rf", title: "Responsable Formation (RF)" },
            { id: "animateur", title: "Animateur (Expert)" },
            { id: "participant", title: "Participant (Apprenant)" },
        ]
    },
    {
        title: "RESSOURCES",
        links: [
            { id: "faq", title: "Foire Aux Questions" },
            { id: "support", title: "Assistance Technique" },
        ]
    }
];

const CONTENT = {
    introduction: {
        title: "Introduction & Vision",
        description: "Découvrez le Système de Gestion de l'Apprentissage et de la Formation Continue (SGAFO).",
        body: (
            <>
                <p>
                    SGAFO est l'outil central de digitalisation du workflow de formation au sein de l'OFPPT. 
                    Il permet de fluidifier les échanges entre les Directions Régionales, les Complexes de Formation et les Formateurs, offrant une visibilité en temps réel sur l'ensemble du processus de formation continue.
                </p>
                <h2 id="objectifs-principaux">Objectifs Principaux</h2>
                <p>
                    Le déploiement de cette plateforme s'inscrit dans une démarche globale de modernisation et vise plusieurs objectifs stratégiques :
                </p>
                <ul>
                    <li><strong>Centralisation :</strong> Un catalogue national unique pour une meilleure visibilité.</li>
                    <li><strong>Automatisation :</strong> Planification logistique et gestion des réservations fluidifiées.</li>
                    <li><strong>Suivi :</strong> Évaluation pédagogique en temps réel et suivi par QCM.</li>
                    <li><strong>Dématérialisation :</strong> Fin du format papier pour les feuilles d'émargement et les attestations.</li>
                </ul>
                <h2 id="public-cible">Public Cible</h2>
                <p>
                    SGAFO a été conçu pour répondre aux besoins spécifiques de plusieurs profils utilisateurs, chacun disposant d'une interface et de fonctionnalités dédiées à son périmètre d'action.
                </p>
                <pre><code className="language-bash"># Accès Rapide
1. Chefs de Complexe (CDC) - Ingénierie et planification
2. Responsables Formation (RF) - Validation et pilotage
3. Animateurs - Évaluation et suivi pédagogique
4. Participants - Inscription et montée en compétences</code></pre>
            </>
        )
    },
    architecture: {
        title: "Architecture du Système",
        description: "Comprendre comment SGAFO est structuré techniquement et fonctionnellement.",
        body: (
            <>
                <p>
                    L'architecture de SGAFO repose sur une séparation claire entre la planification stratégique (au niveau central/régional) et l'exécution opérationnelle (au niveau des complexes).
                </p>
                <h2 id="cycle-de-vie">Cycle de Vie d'un Plan</h2>
                <p>
                    Tout plan de formation passe par un workflow de validation strict :
                </p>
                <ol>
                    <li><strong>Brouillon :</strong> Initialisation par le CDC.</li>
                    <li><strong>Soumis :</strong> Envoi pour révision à la Direction Régionale.</li>
                    <li><strong>Confirmé :</strong> Validation administrative par le RF.</li>
                    <li><strong>Validé :</strong> Validation technique et injection dans le Catalogue National.</li>
                </ol>
            </>
        )
    },
    cdc: {
        title: "Guide Chef de Complexe (CDC)",
        description: "Gérez l'ingénierie et la planification opérationnelle des formations de votre complexe.",
        body: (
            <>
                <p>
                    En tant que CDC, vous êtes le point de départ du processus de formation. C'est vous qui identifiez les besoins et structurez les plans.
                </p>
                <h2 id="nouveau-plan">1. Initialisation du Plan</h2>
                <p>
                    Depuis votre dashboard, cliquez sur <strong>Nouveau Plan</strong>. Saisissez l'entité bénéficiaire, le titre du plan et les dates globales prévisionnelles. Un plan commence toujours à l'état <em>Brouillon</em>.
                </p>
                <h2 id="modules-themes">2. Ingénierie des Thèmes</h2>
                <p>
                    Ajoutez chaque module en précisant le volume horaire, les objectifs SMART et les animateurs pressentis. Le système vérifie en temps réel que l'animateur n'a pas d'autre séance programmée sur la même période.
                </p>
                <h2 id="gestion-participants">3. Gestion des Participants</h2>
                <p>
                    Sélectionnez les formateurs participants. Vous pouvez filtrer par établissement, spécialité ou secteur. Le système bloquera l'ajout si le participant dépasse son quota d'heures annuel de formation.
                </p>
            </>
        )
    },
    rf: {
        title: "Guide Responsable Formation (RF)",
        description: "Pilotez et validez les plans de formation au niveau de votre Direction Régionale.",
        body: (
            <>
                <p>
                    Le RF assure le pilotage stratégique et la validation finale des plans au niveau régional, garantissant l'alignement avec les objectifs de l'OFPPT.
                </p>
                <h2 id="validation-admin">1. Validation Administrative</h2>
                <p>
                    Examinez les plans soumis par les CDC. Vérifiez l'adéquation avec le plan de développement régional. Si conforme, passez le statut à <em>Confirmé</em>. En cas de rejet, saisissez un motif précis pour guider le CDC.
                </p>
                <h2 id="validation-tech">2. Validation Technique</h2>
                <p>
                    Après confirmation, le plan doit être planifié (séances). Une fois le planning complet, le RF effectue la validation finale pour injection dans le Catalogue National et ouverture des sessions.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded-r-lg">
                    <p className="text-sm text-blue-800 m-0 font-medium">
                        <strong>Note importante :</strong> Seuls les plans "Validés" apparaissent dans le Catalogue National.
                    </p>
                </div>
            </>
        )
    },
    animateur: {
        title: "Guide Animateur (Expert)",
        description: "Gérez vos sessions de formation et évaluez les participants.",
        body: (
            <>
                <p>
                    L'animateur est un expert métier chargé de la transmission des compétences lors des sessions de formation. SGAFO vous fournit les outils nécessaires pour animer et évaluer efficacement.
                </p>
                <h2 id="preparation">1. Préparation Pédagogique</h2>
                <p>
                    Accédez à vos thèmes assignés et déposez vos ressources (PDF, supports, liens). Ces documents seront visibles par les participants inscrits à vos modules.
                </p>
                <h2 id="emargement">2. Émargement</h2>
                <p>
                    Pour chaque séance, validez la présence numérique des participants. En fin de module, vous devez confirmer l'assiduité pour permettre la génération des attestations.
                </p>
            </>
        )
    },
    participant: {
        title: "Guide Participant (Apprenant)",
        description: "Suivez votre parcours de formation et accédez à vos attestations.",
        body: (
            <>
                <p>
                    En tant que formateur participant à une formation continue, SGAFO est votre portail pour suivre votre montée en compétences.
                </p>
                <h2 id="catalogue">1. Consultation du Catalogue</h2>
                <p>
                    Découvrez l'offre de formation disponible. Vous pouvez consulter les programmes validés et voir les dates prévues pour les prochaines sessions.
                </p>
                <h2 id="evaluations">2. Évaluations</h2>
                <p>
                    Répondez aux tests de positionnement avant le démarrage et passez l'évaluation finale. Vos scores sont enregistrés dans votre dossier de formation personnel.
                </p>
            </>
        )
    },
    faq: {
        title: "Foire Aux Questions",
        description: "Les réponses aux questions les plus fréquentes sur l'utilisation de SGAFO.",
        body: (
            <>
                <h2 id="mot-de-passe">Comment réinitialiser mon mot de passe ?</h2>
                <p>
                    Contactez l'administrateur de votre complexe ou utilisez le lien "Mot de passe oublié" sur la page de connexion si votre email institutionnel est configuré.
                </p>
                <h2 id="quota-heures">Comment est calculé le quota d'heures ?</h2>
                <p>
                    Chaque formateur dispose d'un quota annuel d'heures de formation continue. Le système déduit automatiquement les heures des formations terminées et validées.
                </p>
            </>
        )
    },
    support: {
        title: "Assistance Technique",
        description: "Comment obtenir de l'aide en cas de problème technique.",
        body: (
            <>
                <p>
                    Si vous rencontrez un blocage ou une erreur technique, notre équipe d'assistance est à votre disposition.
                </p>
                <h2 id="contact">Contact</h2>
                <p>
                    Envoyez un email détaillé (avec captures d'écran si possible) à : <a href="mailto:support.sgafo@ofppt.ma">support.sgafo@ofppt.ma</a>
                </p>
                <h2 id="horaires">Horaires d'ouverture</h2>
                <p>
                    L'équipe support est disponible du lundi au vendredi, de 8h30 à 16h30.
                </p>
            </>
        )
    }
};

// Extracts h2 ids and texts from a body component for the Right Sidebar TOC
const getTableOfContents = (body: any) => {
    const toc: { id: string, title: string }[] = [];
    if (body && body.props && body.props.children) {
        const children = Array.isArray(body.props.children) ? body.props.children : [body.props.children];
        children.forEach((child: any) => {
            if (child.type === 'h2' && child.props.id) {
                toc.push({
                    id: child.props.id,
                    title: child.props.children
                });
            }
        });
    }
    return toc;
};

export default function Documentation() {
    const [activeSection, setActiveSection] = useState<keyof typeof CONTENT>('introduction');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const currentDoc = CONTENT[activeSection];
    const tableOfContents = getTableOfContents(currentDoc.body);

    return (
        <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900">
            <Head title={`${currentDoc.title} - Documentation SGAFO`} />

            {/* Top Navbar (Tailwind Docs Style) */}
            <header className="sticky top-0 z-50 w-full backdrop-blur flex-none transition-colors duration-500 border-b border-slate-900/10 bg-white/95">
                <div className="max-w-8xl mx-auto">
                    <div className="py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 mx-4 lg:mx-0">
                        <div className="relative flex items-center">
                            <Link href="/" className="flex items-center gap-2 group mr-3 w-[2.0625rem] overflow-hidden md:w-auto">
                                <Logo variant="brand" size="sm" showText={false} />
                                <span className="text-base font-bold text-slate-900 sr-only md:not-sr-only">SGAFO <span className="font-normal text-slate-500">Docs</span></span>
                            </Link>
                            
                            <div className="relative hidden lg:flex items-center ml-auto">
                                <nav className="text-sm leading-6 font-semibold text-slate-700">
                                    <ul className="flex space-x-8">
                                        <li><Link href="/" className="hover:text-sky-500 transition-colors">Portail</Link></li>
                                        <li><a href={route('documentation.download')} className="hover:text-sky-500 transition-colors">Télécharger PDF</a></li>
                                        <li><Link href={route('login')} className="hover:text-sky-500 transition-colors">Connexion</Link></li>
                                    </ul>
                                </nav>
                                <div className="flex items-center border-l border-slate-200 ml-6 pl-6">
                                    <a href="#" className="text-slate-400 hover:text-slate-500 transition-colors">
                                        <span className="sr-only">Support OFPPT</span>
                                        <svg viewBox="0 0 16 16" className="w-5 h-5" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                                    </a>
                                </div>
                            </div>
                            
                            {/* Mobile Search Bar Fake */}
                            <button type="button" className="ml-auto md:hidden text-slate-500 w-8 h-8 flex items-center justify-center hover:text-slate-600">
                                <span className="sr-only">Search</span>
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Desktop Search Bar Fake */}
                            <div className="hidden md:flex ml-auto lg:ml-8 items-center bg-slate-100 hover:bg-slate-200/80 transition-colors rounded-full px-3 py-1.5 cursor-text text-slate-500 text-sm">
                                <Search className="w-4 h-4 mr-2" />
                                <span>Rechercher...</span>
                                <span className="ml-8 font-sans font-semibold text-xs text-slate-400">⌘K</span>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="ml-2 -my-1 p-1 flex items-center justify-center text-slate-500 lg:hidden">
                                <span className="sr-only">Open Menu</span>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:flex">
                
                {/* Left Sidebar */}
                <div className={`fixed z-40 inset-0 flex-none h-full bg-black/20 backdrop-blur-sm lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-[19rem] lg:block hidden`}>
                    <div className="h-full overflow-y-auto scrolling-touch lg:h-[calc(100vh-3rem)] lg:block lg:sticky lg:top-[3.8125rem] bg-white lg:bg-transparent shadow-xl lg:shadow-none mr-24 lg:mr-0 border-r border-slate-100">
                        <nav className="px-1 pt-6 overflow-y-auto font-medium text-base sm:px-3 xl:px-5 lg:text-sm pb-10 lg:pt-10 lg:pb-14 sticky?lg:h-(screen-18)">
                            
                            {/* Top Navigation Links with Icons */}
                            <ul className="space-y-4 mb-10">
                                {TOP_SIDEBAR_LINKS.map(link => (
                                    <li key={link.name}>
                                        <a href="#" className={`flex items-center gap-3 text-sm transition-colors ${link.active ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-900'}`}>
                                            <div className={`p-1 rounded-md ${link.active ? 'bg-white shadow-sm ring-1 ring-slate-900/5' : 'bg-transparent'}`}>
                                                <link.icon className={`w-[18px] h-[18px] ${link.active ? 'text-slate-900' : 'text-slate-400'}`} />
                                            </div>
                                            {link.name}
                                            {link.badge && (
                                                <span className="ml-auto rounded bg-sky-100 text-sky-600 px-1.5 py-0.5 text-[10px] font-bold tracking-widest">{link.badge}</span>
                                            )}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            {/* Section Links */}
                            <ul className="space-y-9">
                                {NAVIGATION.map((section, index) => (
                                    <li key={index}>
                                        <h5 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">{section.title}</h5>
                                        <ul className="space-y-3 border-l border-slate-100">
                                            {section.links.map(link => (
                                                <li key={link.id}>
                                                    <button 
                                                        onClick={() => setActiveSection(link.id as keyof typeof CONTENT)}
                                                        className={`block w-full text-left -ml-px border-l pl-4 py-0.5 transition-colors ${
                                                            activeSection === link.id
                                                            ? 'border-slate-900 text-slate-900 font-semibold'
                                                            : 'border-transparent text-slate-500 hover:border-slate-400 hover:text-slate-900'
                                                        }`}
                                                    >
                                                        {link.title}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-auto min-w-0 flex w-full">
                    <main className="max-w-3xl flex-auto px-4 pt-10 pb-24 sm:px-6 xl:px-8 lg:pb-16">
                        
                        <div className="mb-8">
                            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mb-3">{NAVIGATION.find(n => n.links.some(l => l.id === activeSection))?.title || 'Documentation'}</p>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{currentDoc.title}</h1>
                            <p className="mt-4 text-lg text-slate-500">{currentDoc.description}</p>
                        </div>

                        {/* Content Body Styled like Tailwind Prose */}
                        <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:font-semibold prose-a:text-slate-900 hover:prose-a:text-sky-500 prose-pre:bg-slate-800 prose-pre:shadow-lg prose-pre:rounded-xl">
                            {currentDoc.body}
                        </div>

                        {/* Pagination / Next Steps Fake */}
                        <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Précédent</span>
                                <button className="text-slate-900 font-semibold hover:text-sky-500 transition-colors">
                                    Installation
                                </button>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Suivant</span>
                                <button className="text-slate-900 font-semibold hover:text-sky-500 transition-colors">
                                    Configurations Avancées
                                </button>
                            </div>
                        </div>

                    </main>

                    {/* Right Sidebar (Table of Contents) */}
                    <div className="hidden xl:text-sm xl:block flex-none w-64 pl-8 mr-8">
                        <div className="flex flex-col justify-between overflow-y-auto sticky top-[3.8125rem] -ml-0.5 h-[calc(100vh-3.8125rem)] pb-6 pt-10">
                            {tableOfContents.length > 0 && (
                                <div>
                                    <h5 className="text-slate-900 font-semibold mb-4 text-sm leading-6">Sur cette page</h5>
                                    <ul className="text-slate-700 text-sm leading-6 space-y-2">
                                        {tableOfContents.map(heading => (
                                            <li key={heading.id}>
                                                <a 
                                                    href={`#${heading.id}`} 
                                                    className="block py-1 hover:text-slate-900 transition-colors"
                                                >
                                                    {heading.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <a href="mailto:support.sgafo@ofppt.ma" className="flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors group">
                                    <svg className="w-4 h-4 mr-2 text-slate-400 group-hover:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    Signaler un problème
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            {/* Added basic styles for the prose class locally since @tailwindcss/typography might not be installed */}
            <style dangerouslySetInnerHTML={{__html: `
                .prose h2 { margin-top: 2.5em; margin-bottom: 1em; font-size: 1.5em; font-weight: 700; color: #0f172a; border-top: 1px solid #e2e8f0; padding-top: 2em; }
                .prose h2:first-of-type { margin-top: 0; border-top: none; padding-top: 0; }
                .prose p { margin-top: 1.25em; margin-bottom: 1.25em; line-height: 1.75; color: #334155; }
                .prose ul, .prose ol { margin-top: 1.25em; margin-bottom: 1.25em; padding-left: 1.625em; color: #334155; }
                .prose li { margin-top: 0.5em; margin-bottom: 0.5em; }
                .prose ul { list-style-type: disc; }
                .prose ol { list-style-type: decimal; }
                .prose pre { background-color: #1e293b; color: #f8fafc; border-radius: 0.75rem; padding: 1.25rem; overflow-x: auto; font-size: 0.875em; line-height: 1.7142857; margin-top: 1.7142857em; margin-bottom: 1.7142857em; }
                .prose strong { font-weight: 600; color: #0f172a; }
                .prose em { font-style: italic; }
            `}} />
        </div>
    );
}
