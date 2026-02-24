import { useState, useRef, useEffect } from 'react';
import { 
  ChevronRight, 
  FileText, 
  ExternalLink, 
  Monitor, 
  MousePointer2, 
  ShoppingCart,
  ShieldCheck,
  Globe,
  Lock,
  PlayCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { PiBookDuotone, PiBoxArrowUpDuotone, PiComputerTowerDuotone, PiEnvelopeDuotone, PiFacebookLogoDuotone, PiFanDuotone, PiGithubLogoDuotone, PiHardDriveDuotone, PiHeadsetDuotone, PiInstagramLogoDuotone, PiKeyboardDuotone, PiLinkedinLogoDuotone, PiMicrophoneDuotone, PiMonitorDuotone, PiMouseDuotone, PiPinterestLogoDuotone, PiSnapchatLogoDuotone, PiThreadsLogoDuotone, PiTiktokLogoDuotone, PiTwitterLogoDuotone, PiUserSoundDuotone, PiVideo, PiVideoCameraDuotone, PiYoutubeLogoDuotone } from 'react-icons/pi';
import { trackClick, trackGoal, trackPing, trackSession, trackView } from '../lib/api';
import monitorImg from '../assets/img/monitor-lg-ultra-gear.jpg';
import keyboardImg from '../assets/img/teclado-redragon-ucal-pro.jpg';
import mouseImg from '../assets/img/mouse-attack-shark-x11.jpg';
import suportHeadsetImg from '../assets/img/suporte-headset-gaming-xtrust.jpg';
import gabineteNebulaImg from '../assets/img/gabinete-superframe-nebula.jpg';
import fonteImg from '../assets/img/fonte-msi-mag.jpg';
import ssdKingstonImg from '../assets/img/ssd-kingston-sata-3.jpg';
import geForceRtx5060Img from '../assets/img/placa-video-asus-atlas-shark-rtx-5060.jpg';
import waterCoolerImg from '../assets/img/water-cooler-ninja-yuki.jpg';
import placaMaeImg from '../assets/img/placa-mae-asus.jpg';
import processadorImg from '../assets/img/processador-intel-core-i7.jpg';
import microfoneImg from '../assets/img/microfone-hyperx-quadcast.jpg';
import somImg from '../assets/img/caixa-som-rgb.jpg';

const IMAGES = {
    hero: 'https://picsum.photos/seed/programming/1920/1080?blur=2',
    profile: 'https://github.com/brunofhorn.png',
    keyboard: keyboardImg,
    monitor: monitorImg,
    mouse: mouseImg,
    headsetSupport: suportHeadsetImg,
    gabinete: gabineteNebulaImg,
    fonte: fonteImg,
    ssd: ssdKingstonImg,
    video: geForceRtx5060Img,
    cooler: waterCoolerImg,
    mae: placaMaeImg,
    processador: processadorImg,
    microfone: microfoneImg,
    som: somImg,
    rocketseat: 'https://github.com/Rocketseat.png'
};

const LINKS = [
    {
        title: 'Junte-se à Rocketseat',
        subtitle: 'Comece ou evolua sua carreira em programação com um desconto especial.',
        logo: IMAGES.rocketseat,
        color: 'bg-primary',
        textColor: 'text-white',
        shadow: '',
        link: 'https://www.rocketseat.com.br/oferta/influencer/v2/bruno'
    },
    {
        title: 'Leituras de 2026',
        subtitle: 'Lista com todos livros e HQs que li em 2026.',
        icon: PiBookDuotone,
        color: 'bg-slate-800',
        textColor: 'text-slate-100',
        shadow: '',
        link: 'https://amzn.to/4bDBTCV'
    },
    {
        title: 'GitHub - brunofhorn/brev.ly',
        subtitle: 'Dá uma olhada no projeto Brev.ly da pós.',
        icon: PiGithubLogoDuotone,
        color: 'bg-slate-800',
        textColor: 'text-slate-100',
        shadow: '',
        link: 'https://github.com/brunofhorn/brev.ly'
    },
    {
        title: 'Parcerias?',
        subtitle: 'parcerias@brunofhorn.com.br',
        icon: PiEnvelopeDuotone,
        color: 'bg-slate-800',
        textColor: 'text-slate-100',
        shadow: '',
        link: 'mailto:parcerias@brunofhorn.com.br'
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
  { icon: PiSnapchatLogoDuotone, label: 'Snapchat', url: 'https://snapchat.com/@brunofhorn' },
  { icon: PiVideoCameraDuotone, label: 'Kwai', url: 'https://kwai.com/@brunofhorn' }
];

const SETUP = [
    {
        name: 'Monitor LG Ultra Gear 24"',
        desc: 'IPS / 180Hz / HDR',
        img: IMAGES.monitor,
        icon: PiMonitorDuotone,
        link: 'https://amzn.to/3ZSQcMI',
    },
    {
        name: 'Teclado Redragon UCAL Pro',
        desc: 'Mecânico / Switch Brown / RGB',
        img: IMAGES.keyboard,
        icon: PiKeyboardDuotone,
        link: 'https://amzn.to/4azu3cz',
    },
    {
        name: 'Mouse Attack Shark X11',
        desc: 'Tri Mode / Base de Carregamento / RGB',
        img: IMAGES.mouse,
        icon: PiMouseDuotone,
        link: 'https://amzn.to/4kTIE66',
    },
    {
        name: 'Suporte Headset Gaming XTrust',
        desc: 'HUB USB / RGB',
        img: IMAGES.headsetSupport,
        icon: PiHeadsetDuotone,
        link: 'https://amzn.to/4cLL7gF',
    },
    {
        name: 'Microfone HyperX Quadcast',
        desc: 'RGB / Antivibração',
        img: IMAGES.microfone,
        icon: PiMicrophoneDuotone,
        link: 'https://amzn.to/4tU7bvE',
    },
    {
        name: 'Caixa de Som GT-X990 Rainbow',
        desc: 'RGB / Efeitos de LED',
        img: IMAGES.som,
        icon: PiUserSoundDuotone,
        link: 'https://s.shopee.com.br/8fN9oPzNRF',
    },
    {
        name: 'Gabinete Superframe Nebula',
        desc: 'Mid Tower / 3 fans RGB / Padrão aquário',
        img: IMAGES.gabinete,
        icon: PiComputerTowerDuotone,
        link: 'https://amzn.to/46qs089',
    },
    {
        name: 'Fonte MSI MAG 80 Plus Bronze',
        desc: '650W / PFC Ativo',
        img: IMAGES.fonte,
        icon: PiBoxArrowUpDuotone,
        link: 'https://amzn.to/4rz1XnJ',
    },
    {
        name: 'SSD Kingston 960GB',
        desc: '6A400 / Sata III / L 500MBs / G 450MBs',
        img: IMAGES.ssd,
        icon: PiHardDriveDuotone,
        link: 'https://amzn.to/3MLnKcw',
    },
    {
        name: 'Placa de Vídeo GeForce RTX 5060',
        desc: '8GB / GDDR7 / DLSS / Ray Tracing',
        img: IMAGES.video,
        icon: PiVideo,
        link: 'https://amzn.to/4b7lIgf',
    },
    {
        name: 'Water Cooler Gamer Ninja Yuki',
        desc: 'ARGB / 240mm / Controladora',
        img: IMAGES.cooler,
        icon: PiFanDuotone,
        link: 'https://amzn.to/4rzKzzj',
    },
    {
        name: 'Placa Mãe Asus B760M-AYW',
        desc: 'Chipset B760 / Intel LGA 1700 / DDR4',
        img: IMAGES.mae,
        icon: PiComputerTowerDuotone,
        link: 'https://amzn.to/4kPUJck',
    },
    {
        name: 'Processador Intel Core i7 14700K',
        desc: '3.4 GHz (5.6GHz OC) / 20 Cores',
        img: IMAGES.processador,
        icon: PiBoxArrowUpDuotone,
        link: 'https://amzn.to/4qU2500',
    },
]

export default function Home() {
    const [width, setWidth] = useState(0);
    const carousel = useRef<HTMLDivElement>(null);
    const visitorIdRef = useRef(
        localStorage.getItem('session:visitorId') ||
          (typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`)
    );

    function sendTracking(action: () => Promise<unknown>) {
        void action().catch(() => undefined);
    }

    
    async function handleLinkCardClick(title: string, url: string) {
        try {
            await trackClick({
                visitorId: visitorIdRef.current,
                page: 'home',
                kind: 'link-card',
                label: title,
                url,
            });

            await trackGoal({
                visitorId: visitorIdRef.current,
                page: 'home',
                goal: title,
                url,
            });
        } catch {
            // Ignore tracking errors and continue navigation.
        } finally {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }
    async function handleSetupBuyClick(itemName: string, url: string) {
        try {
            await trackClick({
                visitorId: visitorIdRef.current,
                page: 'home',
                kind: 'setup',
                label: itemName,
                url,
            });
            await trackGoal({
                visitorId: visitorIdRef.current,
                page: 'home',
                goal: `buy:${itemName}`,
                url,
            });
        } catch {
            // Ignore tracking errors and continue navigation.
        } finally {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }
    useEffect(() => {
        localStorage.setItem('session:visitorId', visitorIdRef.current);

        if (carousel.current) {
            setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
        }

        sendTracking(() =>
            trackSession({
                visitorId: visitorIdRef.current,
                page: 'home',
                userAgent: navigator.userAgent,
            })
        );

        sendTracking(() =>
            trackView({
                visitorId: visitorIdRef.current,
                page: 'home',
                title: document.title,
                path: window.location.pathname,
            })
        );

        const interval = window.setInterval(() => {
            sendTracking(() =>
                trackPing({
                    visitorId: visitorIdRef.current,
                    page: 'home',
                    ts: Date.now(),
                })
            );
        }, 30000);

        return () => window.clearInterval(interval);
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
                            Entusiasta de Tecnologia | Gamer | Leitor compartilhando o melhor do mundo digital.
                        </p>
                    </div>
                </section>

                <section className="px-6 py-8">
                    <div className="flex flex-wrap justify-center gap-3">
                        {SOCIAL_LINKS.map((social, idx) => (
                        <motion.a
                            key={idx}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                                sendTracking(() =>
                                    trackClick({
                                        visitorId: visitorIdRef.current,
                                        page: 'home',
                                        kind: 'social',
                                        label: social.label,
                                        url: social.url,
                                    })
                                )
                            }
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(32, 64, 149, 0.2)' }}
                            whileTap={{ scale: 0.95 }}
                            className="w-11 h-11 rounded-default bg-slate-800 flex items-center justify-center text-slate-300 transition-colors"
                            title={social.label}
                        >
                            <social.icon size={20} />
                        </motion.a>
                        ))}
                    </div>
                    <div className="flex justify-center mt-6">
                        <div className="px-4 py-2.5 rounded-lg justify-center items-center flex bg-slate-800/50 border border-slate-700/50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">+ 100K seguidores</span>
                        </div>
                    </div>
                </section>

                <section className="px-6 space-y-3 pb-8">
                    {LINKS.map((link, idx) => (
                        <motion.button
                            key={idx}
                            onClick={() => void handleLinkCardClick(link.title, link.link)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full p-2 cursor-pointer rounded-default ${link.color} ${link.textColor} font-bold text-left flex items-center justify-between shadow-lg ${link.shadow} group`}
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`w-10 h-10 rounded-lg ${link.color === 'bg-primary' ? 'bg-white/20' : 'bg-slate-700'} flex items-center justify-center overflow-hidden`}>
                                    {link.icon ? (
                                        <link.icon size={20} />
                                    ) : (
                                        <img src={link.logo} alt={link.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 min-w-0 justify-start items-start gap-0.5 text-left">
                                    <span className="text-sm text-left leading-tight">{link.title}</span>
                                    {link.subtitle && <span className="text-xs text-left leading-snug">{link.subtitle}</span>}
                                </div>
                            </div>
                            <ChevronRight className="ml-3 w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                    ))}
                </section>
                
                <section className="pb-12 overflow-hidden">
                    <div className="px-6 mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Monitor className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold">Meu Setup</h3>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Arraste para explorar</span>
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
                                    className="flex-none w-64 rounded-default bg-slate-800/50 border border-slate-700/50 overflow-hidden"
                                >
                                    <div className="h-40 overflow-hidden">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                            draggable={false}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-sm">{item.name}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                                        <button
                                            onPointerDown={(event) => event.stopPropagation()}
                                            onClick={() => void handleSetupBuyClick(item.name, item.link)}
                                            className="mt-4 w-full py-2.5 bg-primary rounded-lg cursor-pointer text-white text-[10px] font-bold flex items-center justify-center gap-2 pointer-events-auto"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            Clique aqui para Comprar
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
                            src="https://www.youtube.com/embed/c2BmYRoXPKc?si=oFj8x_N_8HAaSADJ"
                            title="Aprenda CSS Jogando"
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
                            <h3 className="text-lg font-bold">Mídia Kit 2026</h3>
                            <p className="text-slate-400 text-sm mt-2 max-w-[240px]">
                                Buscando uma collab? Veja minhas estatísticas, demográfico de audiência, e detalhes de parcerias com marcas.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-6 px-8 py-3 cursor-pointer bg-primary rounded-default text-sm font-bold text-white flex items-center gap-2 shadow-lg shadow-primary/30"
                            >
                                Ver Mídia Kit <ExternalLink className="w-4 h-4" />
                            </motion.button>
                        </div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-auto p-10 text-center border-t border-slate-800/50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Criado por Bruno Fernandes Horn</p>
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







