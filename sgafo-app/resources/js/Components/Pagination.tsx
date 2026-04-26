import { Link } from '@inertiajs/react';

interface Props {
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export default function Pagination({ links }: Props) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {links.map((link, key) => (
                link.url === null ? (
                    <div
                        key={key}
                        className="px-4 py-2 text-sm text-slate-400 bg-slate-50 border border-slate-100 rounded-xl cursor-not-allowed"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-4 py-2 text-sm font-black transition-all border-2 rounded-xl ${
                            link.active
                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20'
                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
}
