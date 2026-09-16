import React, { useState, useEffect } from 'react';
import { MapPin, Check, Sparkles, Users, TrendingUp } from 'lucide-react';

interface CityVote {
  id: string;
  name: string;
  region: string;
  votes: number;
}

const INITIAL_CITIES: CityVote[] = [
  { id: 'ams', name: 'Amsterdam', region: 'Centrum / Oud-Zuid', votes: 312 },
  { id: 'utr', name: 'Utrecht', region: 'Binnenstad / Maliebaan', votes: 245 },
  { id: 'rot', name: 'Rotterdam', region: 'Kop van Zuid / Kralingen', votes: 184 },
  { id: 'dh', name: 'Den Haag', region: 'Archipel / Statenkwartier', votes: 148 },
  { id: 'gooi', name: "'t Gooi (Blaricum/Laren)", region: 'Noord-Holland', votes: 167 },
  { id: 'eind', name: 'Eindhoven', region: 'Strijp-S / Centrum', votes: 119 },
];

export const LocationPoll: React.FC = () => {
  const [cities, setCities] = useState<CityVote[]>(() => {
    const saved = localStorage.getItem('redzen_location_votes');
    return saved ? JSON.parse(saved) : INITIAL_CITIES;
  });

  const [hasVoted, setHasVoted] = useState<string | null>(() => {
    return localStorage.getItem('redzen_user_voted_city');
  });

  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const total = cities.reduce((acc, c) => acc + c.votes, 0);
    setTotalVotes(total);
  }, [cities]);

  const handleVote = (cityId: string) => {
    if (hasVoted) return;

    const updated = cities.map(c => c.id === cityId ? { ...c, votes: c.votes + 1 } : c);
    setCities(updated);
    setHasVoted(cityId);
    localStorage.setItem('redzen_location_votes', JSON.stringify(updated));
    localStorage.setItem('redzen_user_voted_city', cityId);
  };

  return (
    <div className="bg-[#15191A] rounded-3xl border border-[#A9875A]/30 p-6 sm:p-10 space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0D0E] border border-[#A9875A]/40 text-[#A9875A] text-xs font-mono uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" />
          <span>Vraagpeiling & Locatie Stemming</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif text-[#F7F5F1]">
          Waar wil jij de volgende RedZen Suite?
        </h3>
        <p className="text-xs sm:text-sm text-[#A9AAA7] font-light max-w-2xl">
          Breng jouw stem uit. De stad met de meeste stemmen krijgt voorrang bij onze vastgoedselectie en vergunningsprocedures.
        </p>
      </div>

      {/* Grid of Cities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map((city) => {
          const isVoted = hasVoted === city.id;
          const percentage = totalVotes > 0 ? Math.round((city.votes / totalVotes) * 100) : 0;

          return (
            <div
              key={city.id}
              onClick={() => handleVote(city.id)}
              className={`p-5 rounded-2xl transition-all border relative flex flex-col justify-between overflow-hidden cursor-pointer ${
                isVoted 
                  ? 'bg-[#0B0D0E] border-[#A9875A] ring-1 ring-[#A9875A]' 
                  : 'bg-[#0B0D0E]/60 border-white/5 hover:border-white/20'
              }`}
            >
              {/* Progress Background bar */}
              <div 
                className="absolute left-0 bottom-0 top-0 bg-[#A9875A]/10 transition-all duration-500 pointer-events-none"
                style={{ width: `${percentage}%` }}
              />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <h4 className="font-serif text-lg text-[#F7F5F1]">{city.name}</h4>
                  <span className="text-[11px] text-[#A9AAA7] font-mono">{city.region}</span>
                </div>
                {isVoted && (
                  <span className="p-1 rounded-full bg-[#A9875A] text-[#0B0D0E]">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>

              <div className="relative z-10 flex items-center justify-between pt-4 mt-2 border-t border-white/5 text-xs font-mono">
                <span className="text-[#A9875A] font-bold">{percentage}% van de stemmen</span>
                <span className="text-[#A9AAA7]">{city.votes} stemmen</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footnote */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A9AAA7] border-t border-white/5 pt-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#A9875A]" />
          <span>Totaal {totalVotes} geverifieerde stemmen van potentiële gasten</span>
        </div>
        {hasVoted ? (
          <span className="text-emerald-400 font-mono flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Jouw stem is geregistreerd.
          </span>
        ) : (
          <span className="text-[#A9875A] font-mono">
            Klik op jouw gewenste stad om direct te stemmen.
          </span>
        )}
      </div>

    </div>
  );
};
