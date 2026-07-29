import { useState } from 'react';
import subscribersAPI from '../../services/subscribersAPI'; // Ajuste le chemin si besoin
import { 
  SiInstagram, 
  SiX, 
  SiTiktok, 
  SiFacebook, 
  SiYoutube, 
  SiSpotify, 
  SiApplemusic 
} from 'react-icons/si';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      await subscribersAPI.create({ 
        email: email,
        isActive: true 
      });
      setStatus('SUCCESSFULLY SUBSCRIBED!');
      setEmail('');
    } catch (error) {
      console.error("Subscription error details:", error.response?.data);

      const responseData = error.response?.data;
      const violations = responseData?.violations;
      const hydraDesc = responseData?.['hydra:description'] || '';

      const isAlreadyExists = 
        violations?.some(v => 
          v.message?.toLowerCase().includes('already') || 
          v.message?.toLowerCase().includes('exist') ||
          v.message?.toLowerCase().includes('unique')
        ) ||
        hydraDesc.toLowerCase().includes('already') ||
        hydraDesc.toLowerCase().includes('exist') ||
        hydraDesc.toLowerCase().includes('unique');

      if (isAlreadyExists) {
        setStatus('THIS EMAIL IS ALREADY SUBSCRIBED.');
      } else if (violations && violations.length > 0) {
        setStatus(violations[0].message.toUpperCase());
      } else if (hydraDesc) {
        setStatus(hydraDesc.toUpperCase());
      } else {
        setStatus('AN ERROR OCCURRED. PLEASE TRY AGAIN.');
      }
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: SiInstagram, href: "https://www.instagram.com/tatemcrae/", label: "Instagram" },
    { icon: SiX, href: "https://twitter.com/tatemcrae", label: "X" },
    { icon: SiTiktok, href: "https://www.tiktok.com/@tatemcrae", label: "TikTok" },
    { icon: SiFacebook, href: "https://www.facebook.com/TateMcRaeOfficial", label: "Facebook" },
    { icon: SiYoutube, href: "https://music.youtube.com/channel/UCz86IA7ooUetFnUGa_YlsVw", label: "YouTube" },
    { icon: SiSpotify, href: "https://open.spotify.com/intl-fr/artist/45dkTj5sMRSjrmBSBeiHym", label: "Spotify" },
    { icon: SiApplemusic, href: "https://music.apple.com/us/artist/tate-mcrae/1446365464", label: "Apple Music" }
  ];

  return (
    <footer className="w-full bg-secondary text-white font-['Unison_Pro',sans-serif] relative overflow-hidden bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:60px_60px]">
      
      {/* 1. BALAYAGE LUMINEUX EN PERMANENCE SUR LE FOOTER */}
      <div 
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_6s_infinite_linear]"
      />

      {/* 2. CERCLE BLUR ANIMÉ */}
      <div 
        className="pointer-events-none absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full bg-tertiary/25 blur-[100px] animate-blob-float"
      />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-t-2 border-b-2 border-white/40 relative z-10">
        
        {/* Left Column: Menu + Socials */}
        <div className="flex flex-col border-r-0 lg:border-r-2 border-white/40">
          
          {/* Top Block: Navigation */}
          <div className="p-8 border-b-2 border-white/40">
            <h3 className="text-sm font-black tracking-widest uppercase mb-4 text-gray-300">
              MENU
            </h3>
            <nav className="flex flex-wrap gap-6 md:gap-10 text-sm md:text-base font-bold tracking-wider">
              {[
                { name: 'HOME', path: '/' },
                { name: 'NEWS', path: '/news' },
                { name: 'GALLERY', path: '/gallery' },
                { name: 'MERCH', path: 'https://tatemcrae.store', external: true }
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.path}
                  target={link.external ? "_blank" : "_self"}
                  rel={link.external ? "noopener noreferrer" : ""}
                  className="relative text-gray-400 hover:text-white transition-all duration-300 ease-out transform hover:-translate-y-0.5 hover:scale-105 inline-block py-1 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Bottom Block: Follow Links */}
          <div className="p-8">
            <h3 className="text-sm font-black tracking-widest uppercase mb-4 text-gray-300">
              FOLLOW TATE
            </h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    style={{ animationDelay: `${idx * 0.2}s` }}
                    className="w-11 h-11 rounded-full border-2 border-white/20 flex items-center justify-center text-gray-400 hover:text-[#03152d] hover:bg-white hover:border-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-white/20 animate-[bounce-soft_3s_ease-in-out_infinite]"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Newsletter Signup */}
        <div className="p-8 md:p-12 flex flex-col justify-center items-center text-center relative z-10">
          <p className="text-sm md:text-base font-bold tracking-wider uppercase mb-1 text-gray-200">
            GET THE LATEST FROM TATE MCRAE.
          </p>
          <p className="text-sm md:text-base font-bold tracking-wider uppercase mb-8 text-gray-300">
            SIGN UP FOR EXCLUSIVE UPDATES.
          </p>

          <form onSubmit={handleSubscribe} className="w-full max-w-md">
            <div className="relative flex items-center w-full p-1 border-2 border-white/40 rounded-full focus-within:border-white transition-all backdrop-blur-sm bg-black/10">
              <input
                type="email"
                required
                disabled={loading}
                placeholder="E-MAIL ADRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent px-6 py-2 text-xs md:text-sm uppercase tracking-wider text-white placeholder-gray-400 focus:outline-none disabled:opacity-50"
              />
              
              {/* BOUTON SANS SCALE AVEC UN EFFET HOVER AVANCÉ */}
              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden bg-white text-[#03152d] text-xs font-extrabold uppercase px-8 py-3 rounded-full transition-all duration-300 shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-white/50 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              >
                {/* 1. Gradient de fond glissant au survol */}
                <span className="absolute inset-0 bg-gradient-to-r from-tertiary via-[#03152d] to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
                
                {/* 2. Reflet brillant (Flash Sweep) */}
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shine_0.8s_ease-in-out]" />

                {/* 3. Texte du bouton */}
                <span className="relative z-10 tracking-widest">
                  {loading ? 'SUBMITTING...' : 'SUBSCRIBE'}
                </span>
              </button>
            </div>
          </form>

          {/* Feedback Status Message */}
          {status && (
            <p className={`mt-4 text-xs font-bold uppercase tracking-wider ${
              status.includes('SUCCESSFULLY') ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {status}
            </p>
          )}
        </div>

      </div>

      {/* Titre Géant en respiration constante */}
      <div className="w-full flex justify-center items-center overflow-hidden pt-6 pb-2 relative z-10">
        <h1 className="text-[11.5vw] font-black uppercase tracking-tight text-transparent bg-tertiary bg-clip-text text-center select-none whitespace-nowrap leading-none animate-[pulse-glow_4s_ease-in-out_infinite]">
          TATE MCRAE
        </h1>
      </div>

    </footer>
  );
}