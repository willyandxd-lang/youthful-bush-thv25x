import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  BarChart3,
  Settings,
  MousePointerClick,
  Eye,
  Clock,
  ArrowLeft,
  CheckCircle2,
  LayoutDashboard,
  Video,
  Zap,
  Trash2,
  Code,
  Copy,
  X,
  Upload,
  CloudLightning,
  Save,
  LogOut,
} from "lucide-react";

// --- MOCK INITIAL DATA (Para quando não há conexão) ---
const MOCK_DATA = [
  {
    id: "demo-001",
    title: "Vídeo Demo (Local)",
    thumbnail:
      "https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?auto=format&fit=crop&w=800&q=80",
    videoSrc:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    views: 0,
    playRate: 0,
    conversion: 0,
    duration: 15,
    settings: {
      smartAutoplay: true,
      color: "bg-blue-600",
      delayButton: true,
      delayTime: 5,
      headline: "Headline Exemplo",
    },
    retentionData: [],
  },
];

// --- UI COMPONENTS ---
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, type = "neutral" }) => {
  const styles = {
    neutral: "bg-gray-100 text-gray-600",
    success: "bg-green-50 text-green-700 border border-green-100",
    warning: "bg-yellow-50 text-yellow-700 border border-yellow-100",
  };
  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-medium ${styles[type]}`}
    >
      {children}
    </span>
  );
};

// --- FIREBASE LOGIC SIMPLIFIED (Client Side) ---
// Nota: Em um app real, use 'firebase/app' e 'firebase/firestore' via npm.
// Aqui simulamos a lógica para que o usuário entenda onde colar as chaves.

const SmartPlayer = ({ videoData }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showDelayedButton, setShowDelayedButton] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(videoData.settings.smartAutoplay);

  useEffect(() => {
    // Reset states when video changes
    setIsPlaying(false);
    setShowDelayedButton(false);
    setProgress(0);
    setIsMuted(videoData.settings.smartAutoplay);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (videoData.settings.smartAutoplay) {
        videoRef.current.muted = true;
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  }, [videoData.id, videoData.settings]);

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;

    const current = vid.currentTime;
    const total = vid.duration || 1;
    setProgress((current / total) * 100);

    if (
      videoData.settings.delayButton &&
      current >= videoData.settings.delayTime &&
      !showDelayedButton
    ) {
      setShowDelayedButton(true);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className="relative group w-full bg-black rounded-lg overflow-hidden shadow-2xl aspect-video select-none"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {isPlaying && isMuted && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer hover:bg-black/10 transition-all"
        >
          <div className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-2xl animate-pulse flex items-center gap-2 transform hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-yellow-500 fill-current" />O vídeo já
            começou! Clique para ouvir
          </div>
        </div>
      )}

      {videoData.settings.headline && isMuted && isPlaying && (
        <div className="absolute top-8 left-0 right-0 text-center z-10 px-4">
          <span className="bg-black/60 text-white px-4 py-2 rounded text-lg font-bold backdrop-blur-sm">
            {videoData.settings.headline}
          </span>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoData.videoSrc}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12 transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="text-white hover:text-blue-400 transition-colors"
          >
            {isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" />
            )}
          </button>
          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden relative">
            <div
              className={`h-full ${videoData.settings.color} relative`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {showDelayedButton && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center z-30 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <button className="w-full max-w-md bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg shadow-2xl text-xl transform transition hover:scale-105 flex items-center justify-center gap-2 border-b-4 border-green-700 active:border-b-0 active:translate-y-1">
            <CheckCircle2 size={28} />
            QUERO ACESSAR AGORA
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [videos, setVideos] = useState(MOCK_DATA);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  // Config state
  const [firebaseConfig, setFirebaseConfig] = useState(() => {
    return localStorage.getItem("vsl_firebase_config") || "";
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Load videos from local storage if not connected to real DB
    const saved = localStorage.getItem("vsl_videos");
    if (saved && !isConnected) {
      setVideos(JSON.parse(saved));
    }
    if (firebaseConfig) setIsConnected(true);
  }, [firebaseConfig, isConnected]);

  useEffect(() => {
    if (!isConnected) {
      localStorage.setItem("vsl_videos", JSON.stringify(videos));
    } else {
      // Aqui entraria a lógica de salvar no Firestore real
      console.log("Salvando no Firebase (Simulado):", videos);
    }
  }, [videos, isConnected]);

  const selectedVideo =
    videos.find((v) => v.id === selectedVideoId) || videos[0];

  const updateSettings = (newSettings) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === selectedVideo.id
          ? { ...v, settings: { ...v.settings, ...newSettings } }
          : v
      )
    );
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const newVideo = {
      id: `vsl-${Date.now()}`,
      title: e.target.title.value,
      thumbnail:
        "https://images.unsplash.com/photo-1626544827763-d516dce335ca?auto=format&fit=crop&w=800&q=80",
      videoSrc:
        e.target.url.value ||
        "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      views: 0,
      playRate: 0,
      conversion: 0,
      duration: 30,
      settings: {
        smartAutoplay: true,
        color: "bg-blue-600",
        delayButton: false,
        delayTime: 60,
        headline: "",
      },
      retentionData: [],
    };
    setVideos([newVideo, ...videos]);
    setShowUploadModal(false);
    setSelectedVideoId(newVideo.id);
    setActiveTab("editor");
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const config = e.target.config.value;
    localStorage.setItem("vsl_firebase_config", config);
    setFirebaseConfig(config);
    setIsConnected(true);
    alert(
      "Configuração Salva! Agora seus vídeos serão sincronizados (Simulado neste demo)."
    );
  };

  // Se estiver rodando na Vercel, use window.location.origin, senão use o demo
  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://meu-vsl-app.vercel.app";

  const generateEmbedCode = () => {
    // Este código usa um IFRAME que aponta para uma rota "player" deste mesmo app
    return `<div style="position:relative;width:100%;padding-top:56.25%;"><iframe src="${appUrl}/player/${selectedVideo.id}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;border-radius:8px;" allow="autoplay; fullscreen"></iframe></div>`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setActiveTab("dashboard")}
          >
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Video size={20} />
            </div>
            <span className="font-bold text-xl">
              VSL<span className="text-blue-600">Free</span>
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("config")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium ${
                isConnected
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <CloudLightning size={16} />{" "}
              {isConnected ? "Conectado" : "Desconectado"}
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
            >
              <Upload size={16} /> Novo Vídeo
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* TABS SWITCHER */}
        {activeTab === "config" && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Configuração Grátis (Firebase)
              </h2>
              <p className="text-gray-500 mb-6">
                Para que seus vídeos funcionem no seu site e você não perca
                dados, conecte ao Firebase (Grátis).
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-lg">
                <li>
                  Acesse <strong>console.firebase.google.com</strong> e crie um
                  projeto.
                </li>
                <li>
                  Vá em <strong>Firestore Database</strong> e clique em "Criar
                  Banco de Dados".
                </li>
                <li>
                  Vá em <strong>Configurações do Projeto</strong> (Engrenagem) e
                  copie o SDK Config (JSON).
                </li>
                <li>Cole abaixo:</li>
              </ol>

              <form onSubmit={handleSaveConfig}>
                <textarea
                  name="config"
                  defaultValue={firebaseConfig}
                  className="w-full h-48 font-mono text-xs bg-gray-900 text-green-400 p-4 rounded-lg mb-4"
                  placeholder='{ "apiKey": "...", "authDomain": "..." }'
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                  Salvar Conexão
                </button>
              </form>
            </Card>
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in">
            {!isConnected && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Aviso:</strong> Você está no modo offline. Seus dados
                  estão salvos apenas neste navegador.
                  <button
                    onClick={() => setActiveTab("config")}
                    className="underline ml-1 font-bold"
                  >
                    Conectar Cloud
                  </button>
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => {
                    setSelectedVideoId(video.id);
                    setActiveTab("editor");
                  }}
                  className="bg-white p-4 rounded-xl border hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={video.thumbnail}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play
                        className="text-white drop-shadow-lg"
                        size={40}
                        fill="currentColor"
                      />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 truncate">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {video.views} views • {video.playRate}% play rate
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "editor" && selectedVideo && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in zoom-in-95 duration-300">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="text-gray-500 hover:text-gray-900 flex items-center gap-2"
                >
                  <ArrowLeft size={18} /> Voltar
                </button>
                <button
                  onClick={() => setShowEmbedModal(true)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-black flex items-center gap-2"
                >
                  <Code size={16} /> Embed Code
                </button>
              </div>
              <div className="bg-white p-1 rounded-xl shadow-xl border border-gray-200">
                <SmartPlayer videoData={selectedVideo} />
              </div>
            </div>

            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Settings size={18} /> Configurações
                </h3>
                {/* Smart Autoplay */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <label className="text-sm font-medium">Smart Autoplay</label>
                  <button
                    onClick={() =>
                      updateSettings({
                        smartAutoplay: !selectedVideo.settings.smartAutoplay,
                      })
                    }
                    className={`w-10 h-5 rounded-full relative transition-colors ${
                      selectedVideo.settings.smartAutoplay
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${
                        selectedVideo.settings.smartAutoplay
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Delay Button */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">
                      Botão de Delay
                    </label>
                    <button
                      onClick={() =>
                        updateSettings({
                          delayButton: !selectedVideo.settings.delayButton,
                        })
                      }
                      className={`w-10 h-5 rounded-full relative transition-colors ${
                        selectedVideo.settings.delayButton
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${
                          selectedVideo.settings.delayButton
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                  {selectedVideo.settings.delayButton && (
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <Clock size={14} className="text-gray-400" />
                      <input
                        type="range"
                        min="0"
                        max="60"
                        value={selectedVideo.settings.delayTime}
                        onChange={(e) =>
                          updateSettings({ delayTime: Number(e.target.value) })
                        }
                        className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none accent-green-500"
                      />
                      <span className="text-xs font-bold w-6">
                        {selectedVideo.settings.delayTime}s
                      </span>
                    </div>
                  )}
                </div>

                {/* Colors */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">
                    Cor do Player
                  </label>
                  <div className="flex gap-2">
                    {[
                      "bg-blue-600",
                      "bg-red-600",
                      "bg-green-600",
                      "bg-purple-600",
                      "bg-black",
                    ].map((c) => (
                      <button
                        key={c}
                        onClick={() => updateSettings({ color: c })}
                        className={`w-6 h-6 rounded-full ${c} ${
                          selectedVideo.settings.color === c
                            ? "ring-2 ring-offset-2 ring-gray-400"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* MODALS */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <div className="flex justify-between mb-4">
                <h3 className="font-bold">Novo Vídeo</h3>
                <button onClick={() => setShowUploadModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleUpload} className="space-y-3">
                <input
                  name="title"
                  className="w-full border p-2 rounded"
                  placeholder="Título"
                  required
                />
                <input
                  name="url"
                  className="w-full border p-2 rounded"
                  placeholder="Link MP4 (R2, S3, etc)"
                />
                <p className="text-xs text-gray-500">
                  Dica: Use Cloudflare R2 para link grátis.
                </p>
                <button className="w-full bg-blue-600 text-white p-2 rounded font-bold">
                  Criar
                </button>
              </form>
            </div>
          </div>
        )}

        {showEmbedModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-xl">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-bold">Embed Code</h3>
                  <p className="text-xs text-gray-500">
                    Copie e cole no Elementor/HTML.
                  </p>
                </div>
                <button onClick={() => setShowEmbedModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="bg-gray-900 p-4 rounded text-xs text-green-400 font-mono break-all relative">
                {generateEmbedCode()}
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(generateEmbedCode())
                  }
                  className="absolute top-2 right-2 bg-white/20 p-1 rounded text-white hover:bg-white/30"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
