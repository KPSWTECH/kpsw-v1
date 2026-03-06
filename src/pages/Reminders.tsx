import { useState, useEffect } from "react";
import { Calendar, Bell, User, Heart, Star } from "lucide-react";
import { motion } from "motion/react";

export const Reminders = ({ token }: { token: string }) => {
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/members", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(members => {
      const allReminders: any[] = [];
      const today = new Date();
      
      members.forEach((m: any) => {
        if (m.dob) {
          const dob = new Date(m.dob);
          const nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
          if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
          
          allReminders.push({
            date: nextBirthday,
            title: `${m.full_name}'s Birthday`,
            type: 'birthday',
            member: m,
            daysRemaining: Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          });
        }
        if (m.dod) {
          const dod = new Date(m.dod);
          const nextAnniversary = new Date(today.getFullYear(), dod.getMonth(), dod.getDate());
          if (nextAnniversary < today) nextAnniversary.setFullYear(today.getFullYear() + 1);
          
          allReminders.push({
            date: nextAnniversary,
            title: `${m.full_name}'s Death Anniversary`,
            type: 'death_anniversary',
            member: m,
            daysRemaining: Math.ceil((nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          });
        }
        if (m.marriage_anniversary) {
          const mad = new Date(m.marriage_anniversary);
          const nextMA = new Date(today.getFullYear(), mad.getMonth(), mad.getDate());
          if (nextMA < today) nextMA.setFullYear(today.getFullYear() + 1);
          
          allReminders.push({
            date: nextMA,
            title: `${m.full_name}'s Marriage Anniversary`,
            type: 'marriage_anniversary',
            member: m,
            daysRemaining: Math.ceil((nextMA.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          });
        }
      });
      allReminders.sort((a, b) => a.daysRemaining - b.daysRemaining);
      setReminders(allReminders);
    });
  }, [token]);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-bold text-heritage-900">Ritual & Anniversary Reminders</h2>
        <p className="text-heritage-500">Upcoming important family dates and rituals.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reminders.map((reminder, index) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            key={index}
            className={`bg-white p-6 rounded-2xl border-2 shadow-sm relative overflow-hidden ${
              reminder.daysRemaining <= 7 ? 'border-accent/40' : 'border-heritage-100'
            }`}
          >
            {reminder.daysRemaining <= 7 && (
              <div className="absolute top-0 right-0 bg-accent text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">
                Upcoming Soon
              </div>
            )}
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${
                reminder.type === 'birthday' ? 'bg-pink-50 text-pink-500' : 'bg-heritage-100 text-heritage-500'
              }`}>
                {reminder.type === 'birthday' ? <Heart size={24} /> : <Star size={24} />}
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-heritage-900">{reminder.title}</h3>
                <p className="text-sm text-heritage-500">
                  {reminder.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-heritage-100 flex items-center justify-center text-heritage-400 overflow-hidden">
                  {reminder.member.photo_url ? (
                    <img src={reminder.member.photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <span className="text-xs font-medium text-heritage-600">{reminder.member.full_name}</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-serif font-bold text-heritage-900">{reminder.daysRemaining}</p>
                <p className="text-[10px] font-bold text-heritage-400 uppercase tracking-widest">Days Left</p>
              </div>
            </div>
          </motion.div>
        ))}
        {reminders.length === 0 && (
          <div className="text-heritage-500 italic">No upcoming reminders found.</div>
        )}
      </div>
    </div>
  );
};
