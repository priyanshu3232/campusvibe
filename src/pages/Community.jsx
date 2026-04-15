import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, MessageSquare, BarChart3, Eye, ArrowLeft, Pin, Hash, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import CollegeLogo from '../components/ui/CollegeLogo';
import PageTransition from '../components/layout/PageTransition';

const sections = [
  { icon: MessageSquare, label: 'Discussions', desc: 'Open conversations with your batchmates', color: 'text-accent', bg: 'bg-accent/10', path: '/home', count: 42 },
  { icon: BarChart3, label: 'Polls', desc: 'Vote on campus decisions', color: 'text-accent-purple', bg: 'bg-accent-purple/10', path: '/home', count: 12 },
  { icon: Eye, label: 'Confessions', desc: 'Speak anonymously, no judgment', color: 'text-accent-warm', bg: 'bg-accent-warm/10', path: '/home', count: 87 },
  { icon: BookOpen, label: 'Study Groups', desc: 'Find study partners for your courses', color: 'text-success', bg: 'bg-success/10', path: '/explore', count: 8 },
];

const pinnedPosts = [
  { id: 1, title: 'Fest 2026 Volunteer Registration Open!', author: 'Cultural Committee', time: '2d ago' },
  { id: 2, title: 'New Library Hours Effective April 15', author: 'Admin', time: '3d ago' },
];

export default function Community() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <PageTransition>
      <div className="pt-2">
        {/* Header */}
        <div className="px-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-text-tertiary hover:text-text-secondary mb-4" aria-label="Go back">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Banner */}
        <div className="mx-4 mb-6 p-5 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent/10 border border-accent-purple/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <CollegeLogo domain={user?.collegeDomain} size="md" />
              <h2 className="font-display font-bold text-xl text-text-primary">{user?.college}</h2>
            </div>
            <p className="text-sm text-text-secondary mb-3">Your exclusive campus community</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  {['av1', 'av2', 'av3', 'av4'].map((id, i) => (
                    <div key={id} className="w-6 h-6 rounded-full bg-card border-2 border-primary flex items-center justify-center text-xs" style={{ zIndex: 4 - i }}>
                      {['👨‍🎓', '👩‍🎓', '🧑‍💻', '👩‍🎨'][i]}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-text-secondary font-medium">234 members</span>
              </div>
              <span className="text-xs text-success font-medium">42 online</span>
            </div>
          </div>
        </div>

        {/* Pinned Posts */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Pin className="w-4 h-4 text-accent-warm" />
            <h3 className="font-display font-bold text-text-primary text-sm">Pinned</h3>
          </div>
          <div className="space-y-2">
            {pinnedPosts.map(post => (
              <div key={post.id} className="p-3 rounded-xl bg-card border border-accent-warm/20 flex items-start gap-3">
                <Pin className="w-3.5 h-3.5 text-accent-warm shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{post.title}</p>
                  <p className="text-xs text-text-tertiary">{post.author} · {post.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="px-4 space-y-3 pb-4">
          {sections.map((section, i) => (
            <motion.button
              key={section.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(section.path)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/20 transition-all text-left"
            >
              <div className={`w-12 h-12 rounded-xl ${section.bg} flex items-center justify-center`}>
                <section.icon className={`w-6 h-6 ${section.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-text-primary">{section.label}</p>
                  <span className="px-2 py-0.5 rounded-full bg-card-alt text-xs text-text-tertiary">{section.count}</span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">{section.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
