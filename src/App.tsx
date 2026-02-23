import { useState, useRef, useEffect } from 'react';
import { 
  Youtube,
  ChevronRight, 
  FileText, 
  ExternalLink, 
  Monitor, 
  Keyboard, 
  MousePointer2, 
  ShoppingCart,
  ShieldCheck,
  Globe,
  Lock,
  PlayCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { PiBookDuotone, PiEnvelopeDuotone, PiFacebookLogoDuotone, PiGithubLogoDuotone, PiInstagramLogoDuotone, PiLinkedinLogoDuotone, PiPinterestLogoDuotone, PiSnapchatLogoDuotone, PiThreadsLogoDuotone, PiTiktokLogoDuotone, PiTwitterLogoDuotone, PiVideoCameraDuotone, PiYoutubeLogoDuotone } from 'react-icons/pi';

const IMAGES = {
    hero: 'https://picsum.photos/seed/programming/1920/1080?blur=2',
    profile: 'https://github.com/brunofhorn.png',
    keyboard: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiS7RViIuScAxO1S5uztK_biFcdleZUv0aEdAMoDEU4UhfQbgeTaULzYMgmbLWqSYg-kbaSrUgSB2GJnCLEJJCDA4PtIZM9ZbAf30Q0FjXXsMdTMKyHfHvBCiPAl1IsLKrj4HhUOfmnW4FKslf3ZZHP_ls_JZRVwfF7KtBRv3J1AZ5Ew1wKkkMS0txa_jQ-6euufwldzylJgcq1dIXo1igsowl_FFQ9ApnW8RTcWseepKzYuhz8tjuBOgCAga5EXNlNkYWaDmJT0w',
    monitor: '/assets/img/monitor-lg-ultra-gear.jpg',
    mouse: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCK5FhkW1kS3tpNo1tawfeyQ7TRc7ARTNM2-Srwtp4wfHarD6bR1QuR4k6uaG_b_FibZWuHXbI_qlKaqJyyyUtABDQy2wB3AjBHaUB1sR46X49sZY8nskdkxs1GKwxu7-hfjPwOmNAAwjNV8_BoXmh_6-E_gmtuZ-pGm4C5rmQE2Dt0un2FOXc6uhGp7MIkkusu8OoJfiJ-v67ylFRjVpvw3ThEfLdepx0dxz7ZkNwmXuE-38ZD_bXxUqDrckH20OtstN0AD0JvY8',
    rocketseat: 'https://github.com/Rocketseat.png'
};

const LINKS = [
    {
        title: 'Junte-se à Rocketseat',
        subtitle: 'Comece ou evolua sua carreira em programação com um desconto especial.',
        logo: IMAGES.rocketseat,
        color: 'bg-slate-800',
        textColor: 'text-slate-100',
        shadow: ''
    },
    {
        title: 'Leituras de 2026',
        subtitle: 'Lista com todos livros e HQs que li em 2026.',
        icon: PiBookDuotone,
        color: 'bg-primary',
        textColor: 'text-white',
        shadow: 'shadow-primary/20'
    },
    {
        title: 'GitHub - brunofhorn/brev.ly',
        subtitle: 'Dá uma olhada no projeto Brev.ly da pós.',
        icon: PiGithubLogoDuotone,
        color: 'bg-slate-800',
        textColor: 'text-slate-100',
        shadow: ''
    },
    {
        title: 'Parcerias?',
        subtitle: 'parcerias@brunofhorn.com.br',
        icon: PiEnvelopeDuotone,
        color: 'bg-slate-800',
        textColor: 'text-slate-100',
        shadow: ''
    }
];

const SOCIAL_LINKS = [
  { icon: PiInstagramLogoDuotone, label: 'Instagram', url: 'https://instagram.com/brunofhorn' },
  { icon: PiTiktokLogoDuotone, label: 'TikTok', url: 'https://tiktok.com/@brunofhorn' },
  { icon: PiTiktokLogoDuotone, label: 'TikTok', url: 'https://tiktok.com/@umdiaeuleio' },
  { icon: PiYoutubeLogoDuotone, label: 'YouTube', url: 'https://youtube.com/@brunofhorn' },
  { icon: PiLinkedinLogoDuotone, label: 'LinkedIn', url: 'https://linkedin.com/in/brunofhorn' },
  { icon: PiFacebookLogoDuotone, label: 'Facebook', url: 'https://facebook.com/obrunofhorn' },
  { icon: PiThreadsLogoDuotone, label: 'Threads', url: 'https://threads.net/brunofhorn' },
  { icon: PiTwitterLogoDuotone, label: 'Twitter / X', url: 'https://twitter.com/@brunofhorn' },
  { icon: PiPinterestLogoDuotone, label: 'Pinterest', url: 'https://pinterest.com/brunofhorn' },
  { icon: PiSnapchatLogoDuotone, label: 'Snapchat', url: 'https://snapchat.com/brunofhorn' },
  { icon: PiVideoCameraDuotone, label: 'Kwai', url: 'https://kwai.com/@brunofhorn' }
];

const SETUP = [
    {
        name: 'Monitor LG Ultra Gear 24"',
        desc: 'IPS / 180Hz / HDR',
        img: IMAGES.keyboard,
        icon: Keyboard
    },
    {
        name: 'Curved Monitor',
        desc: '34" Ultra-Wide 144Hz',
        img: IMAGES.monitor,
        icon: Monitor
    },
    {
        name: 'Gaming Mouse',
        desc: 'Lightweight, Wireless Pro',
        img: IMAGES.mouse,
        icon: MousePointer2
    }
]

export default function App() {
    const [width, setWidth] = useState(0);
    const carousel = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (carousel.current) {
            setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#161022] text-slate-100 font-sans selection:bg-indigo-500/30">
            <div className="max-w-120 mx-auto bg-[#161022] min-h-screen shadow-2xl relative flex flex-col">

                <section className="relative h-48 overflow-hidden">
                <img 
                    src={IMAGES.hero} 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-40"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#161022]/20 to-[#161022]" />
                </section>

                <section className="flex flex-col items-center -mt-16 px-6 relative z-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-32 h-32 rounded-full border-4 border-[#161022] shadow-2xl overflow-hidden bg-slate-800"
                    >
                        <img
                            src={IMAGES.profile}
                            alt="Bruno Fernandes Horn"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </motion.div>

                    <div className="mt-4 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">Bruno Fernandes Horn</h1>
                        <p className="text-primary font-bold text-xs mt-1 uppercase tracking-[0.2em]">Criador de Conteúdo</p>
                        <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-75 mx-auto">
                            Tech Enthusiast | Gamer | Content Creator sharing the best of the digital world.
                        </p>
                    </div>
                </section>

                <section className="px-6 py-8">
                    <div className="grid grid-cols-8 gap-4">
                        {SOCIAL_LINKS.map((social, idx) => (
                        <motion.a
                            key={idx}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(32, 64, 149, 0.2)' }}
                            whileTap={{ scale: 0.95 }}
                            className="w-11 h-11 rounded-default bg-slate-800 flex items-center justify-center text-slate-300 transition-colors"
                            title={social.label}
                        >
                            <social.icon size={15} />
                        </motion.a>
                        ))}
                    </div>
                    <div className="flex justify-center mt-6">
                        <div className="px-4 py-1.5 rounded-default bg-slate-800/50 border border-slate-700/50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">1.2M Followers</span>
                        </div>
                    </div>
                </section>

                <section className="px-6 space-y-3 pb-8">
                    {LINKS.map((link, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full p-1 pr-5 rounded-default ${link.color} ${link.textColor} font-bold flex items-center justify-between shadow-lg ${link.shadow} group`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-default ${link.color === 'bg-primary' ? 'bg-white/20' : 'bg-slate-700'} flex items-center justify-center overflow-hidden`}>
                                    {link.icon ? (
                                        <link.icon size={20} />
                                    ) : (
                                        <img src={link.logo} alt={link.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 justify-start items-start gap-2">
                                    <span className="text-sm">{link.title}</span>
                                    {link.subtitle && <span className="text-xs">{link.subtitle}</span>}
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                    ))}
                </section>
                
                {/* My Setup */}
                <section className="pb-12 overflow-hidden">
                    <div className="px-6 mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Monitor className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold">My Setup</h3>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Drag to explore</span>
                    </div>

                    <motion.div
                        ref={carousel}
                        className="cursor-grab active:cursor-grabbing"
                        whileTap={{ cursor: 'grabbing' }}
                    >
                        <motion.div
                            drag="x"
                            dragConstraints={{ right: 0, left: -width }}
                            className="flex gap-4 px-6 pb-4"
                        >
                            {SETUP.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    className="flex-none w-64 rounded-default bg-slate-800/50 border border-slate-700/50 overflow-hidden pointer-events-none"
                                >
                                    <div className="h-40 overflow-hidden">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-sm">{item.name}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                                        <button className="mt-4 w-full py-2.5 bg-primary rounded-default text-white text-[10px] font-bold flex items-center justify-center gap-2 pointer-events-auto">
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            Buy on Amazon
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </section>

                <section className="px-6 pb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <PlayCircle className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold">Último Vídeo no Youtube</h3>
                    </div>
                    <div className="aspect-video rounded-default overflow-hidden border border-slate-800 shadow-2xl bg-black">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                </section>

                <section className="px-6 pb-8">
                    <div className="relative overflow-hidden rounded-default bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-8 text-center">
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-12 h-12 rounded-default bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40 mb-4">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold">Media Kit 2026</h3>
                            <p className="text-slate-400 text-sm mt-2 max-w-[240px]">
                                Looking to collaborate? Download my latest stats, audience demographics, and brand partnership details.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-6 px-8 py-3 bg-primary rounded-default text-sm font-bold text-white flex items-center gap-2 shadow-lg shadow-primary/30"
                            >
                                View Media Kit <ExternalLink className="w-4 h-4" />
                            </motion.button>
                        </div>
                        {/* Decorative Blobs */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-auto p-10 text-center border-t border-slate-800/50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Created with passion by Bruno Fernandes Horn</p>
                    <div className="mt-6 flex justify-center gap-6 text-slate-600">
                        <ShieldCheck className="w-5 h-5" />
                        <Globe className="w-5 h-5" />
                        <Lock className="w-5 h-5" />
                    </div>
                </footer>
            </div>

            <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}
