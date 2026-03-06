import { useState, useEffect } from "react";
import { Clock, Calendar, User } from "lucide-react";
import { motion } from "motion/react";

export const Timeline = ({ token }: { token: string }) => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/members", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(members => {
      const allEvents: any[] = [];
      members.forEach((m: any) => {
        if (m.dob) {
          allEvents.push({
            date: new Date(m.dob),
            title: `Birth of ${m.full_name}`,
            type: 'birth',
            member: m
          });
        }
        if (m.dod) {
          allEvents.push({
            date: new Date(m.dod),
            title: `Passing of ${m.full_name}`,
            type: 'death',
            member: m
          });
        }
        if (m.marriage_anniversary) {
          allEvents.push({
            date: new Date(m.marriage_anniversary),
            title: `Marriage of ${m.full_name}`,
            type: 'marriage',
            member: m
          });
        }
      });
      allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
      setEvents(allEvents);
    });
  }, [token]);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-bold text-heritage-900">Family Timeline</h2>
        <p className="text-heritage-500">A chronological journey through your family's history.</p>
      </header>

      <div className="relative pl-8 border-l-2 border-heritage-200 space-y-12 ml-4">
        {events.map((event, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index} 
            className="relative"
          >
            <div className={`absolute -left-[41px] top-0 w-4 h-4 rounded-full border-4 border-heritage-50 ${
              event.type === 'birth' ? 'bg-green-500' : 'bg-heritage-400'
            }`} />
            
            <div className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm">
              <span className="text-xs font-bold text-accent uppercase tracking-widest">
                {event.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <h3 className="text-xl font-serif font-bold text-heritage-900 mt-1">{event.title}</h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-heritage-100 flex items-center justify-center text-heritage-400 overflow-hidden">
                  {event.member.photo_url ? (
                    <img src={event.member.photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-heritage-700">{event.member.full_name}</p>
                  <p className="text-xs text-heritage-500">{event.member.native_village}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {events.length === 0 && (
          <div className="text-heritage-500 italic">No historical events recorded yet.</div>
        )}
      </div>
    </div>
  );
};
