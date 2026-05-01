import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface FeedbackData {
    categorie: string;
    average: number;
}

interface Props {
    data: FeedbackData[];
}

const FeedbackRadarChart: React.FC<Props> = ({ data }) => {
    // Format data for Recharts
    const formattedData = data.map(item => ({
        subject: item.categorie,
        A: parseFloat(item.average.toString()),
        fullMark: 5,
    }));

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar
                        name="Satisfaction"
                        dataKey="A"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.6}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FeedbackRadarChart;
