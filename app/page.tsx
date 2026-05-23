"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { id: "platform", label: "Platform" },
  { id: "livestock", label: "Livestock" },
  { id: "mapping", label: "Mapping" },
  { id: "weather", label: "Weather" },
  { id: "pricing", label: "Pricing" },
];

const languages = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
] as const;

type LanguageCode = (typeof languages)[number]["code"];

const copy = {
  en: {
    eyebrow: "AI-powered precision agriculture",
    heroTitle: "Livestock intelligence, field maps, and weather risk in one platform.",
    heroText:
      "AgroNexis helps modern farms monitor herd health, map grazing pressure, forecast weather risk, and coordinate multilingual field teams from one AI command center.",
    primaryCta: "View farm intelligence",
    secondaryCta: "Start field scan",
    platformEyebrow: "Platform",
    platformTitle: "A responsive operating system for livestock and field decisions.",
    platformText:
      "Replace scattered reports with one multilingual workspace for farm managers, veterinarians, agronomists, and operators.",
    livestockEyebrow: "Livestock monitoring",
    livestockTitle: "See animal health, movement, and heat stress before losses compound.",
    livestockText:
      "Track herd behavior, paddock pressure, feed efficiency, and welfare signals with AI summaries your team can act on quickly.",
    mapEyebrow: "Geospatial mapping",
    mapTitle: "Map every paddock, risk zone, and weather exposure layer.",
    mapText:
      "Combine GPS zones, livestock movement, pasture condition, and weather alerts into a spatial view that makes field action obvious.",
    scanEyebrow: "Live camera scan",
    scanTitle: "Turn the field in front of you into instant guidance.",
    scanText:
      "Scan livestock, pasture, or crop rows. The interface surfaces stress signals, water pressure, and priority actions.",
    dashboardEyebrow: "AI intelligence",
    dashboardTitle: "Real-time farm dashboard",
    recommendations: "AI recommendations",
    weatherEyebrow: "Weather and operations",
    weatherTitle: "Plan the next move with less guesswork.",
    pricingEyebrow: "Launch AgroNexis",
    pricingTitle: "Deploy your AI farm command center in days.",
    pricingText:
      "Connect livestock, geospatial, weather, and field data to give your team a premium workspace for daily decisions.",
    startPlanning: "Start planning",
    brandTag: "Livestock intelligence",
    heroMiniLabels: ["Heat", "Motion", "Grazing"],
    heroCvTracking: "CV tracking",
    heroCvCount: "47 animals",
    commandViewLabel: "Livestock command view",
    commandTitle: "Today's field pulse",
    commandBadge: "Synced",
    liveSyncLabel: "Live sync",
    liveSyncText: "Updated every 2 minutes",
    aiTrendSignal: "AI trend signal",
    aiImproving: "Improving",
    aiLayerActive: "AI layer active",
    thermalOverlay: "Thermal + movement overlay",
    aiWelfareSummary: "AI welfare summary",
    gpsOverlay: "GPS + weather overlay",
    scanButtonStart: "Start livestock check-up",
    scanButtonRunning: "Check-up running",
    scanButtonStop: "Stop scan",
    clinicalStatus: "Clinical status",
    scanReady: "Ready to scan",
    scanOpening: "Opening clinical scan",
    scanExamining: "Examining livestock",
    scanForecastReady: "Forecast ready",
    scanStageReady: "Exam room ready",
    scanStageOpening: "Camera triage",
    scanStageExamining: "Vitals analysis",
    scanStageForecast: "Condition forecast",
    scanReadyMessage:
      "Use your camera like a field check-up: frame one animal clearly and AgroNexis will forecast visible wellness signals.",
    scanOpeningMessage:
      "Frame one animal from the side or front. AgroNexis is preparing posture, coat, breathing, and heat-stress checks.",
    scanExaminingMessage:
      "AI check-up running: estimating posture stability, visible respiratory stress, hydration risk, and body condition.",
    scanForecastMessage:
      "Forecast: mild heat stress likely in the next 90 minutes. Move animal group toward shade and confirm water access.",
    scanDemoMessage:
      "Demo forecast: mild heat stress risk detected. Suggested action: shade rotation, water access check, and re-scan in 90 minutes.",
    doctorExamLabel: "Doctor-style exam",
    postureStable: "Posture stable",
    respirationWatch: "Respiration watch",
    conditionForecastLabel: "AI condition forecast",
    conditionForecastAdvice:
      "Mild heat-stress risk. Check water access, move to shade, and re-scan after recovery.",
  },
  fr: {
    eyebrow: "Agriculture de précision propulsée par l'IA",
    heroTitle: "Suivi du bétail, cartes terrain et météo dans une seule plateforme.",
    heroText:
      "AgroNexis aide les exploitations à surveiller la santé du troupeau, cartographier la pression de pâturage, prévoir les risques météo et coordonner les équipes multilingues.",
    primaryCta: "Voir l'intelligence ferme",
    secondaryCta: "Lancer le scan terrain",
    platformEyebrow: "Plateforme",
    platformTitle: "Un système responsive pour les décisions bétail et terrain.",
    platformText:
      "Remplacez les rapports dispersés par un espace multilingue pour gestionnaires, vétérinaires, agronomes et opérateurs.",
    livestockEyebrow: "Suivi du bétail",
    livestockTitle: "Repérez santé, mouvement et stress thermique avant les pertes.",
    livestockText:
      "Suivez comportement, pression de paddock, efficacité alimentaire et bien-être avec des résumés IA actionnables.",
    mapEyebrow: "Cartographie géospatiale",
    mapTitle: "Cartographiez paddocks, zones de risque et exposition météo.",
    mapText:
      "Combinez zones GPS, mouvement du bétail, état du pâturage et alertes météo dans une vue spatiale claire.",
    scanEyebrow: "Scan caméra en direct",
    scanTitle: "Transformez le terrain devant vous en recommandations instantanées.",
    scanText:
      "Scannez bétail, pâturage ou cultures. L'interface signale stress, eau et actions prioritaires.",
    dashboardEyebrow: "Intelligence IA",
    dashboardTitle: "Tableau de bord ferme en temps réel",
    recommendations: "Recommandations IA",
    weatherEyebrow: "Météo et opérations",
    weatherTitle: "Planifiez la prochaine action avec moins d'incertitude.",
    pricingEyebrow: "Lancer AgroNexis",
    pricingTitle: "Déployez votre centre de commande agricole IA en quelques jours.",
    pricingText:
      "Connectez bétail, cartes, météo et données terrain dans un espace de travail premium.",
    startPlanning: "Planifier",
    brandTag: "Intelligence du bétail",
    heroMiniLabels: ["Chaleur", "Mouvement", "Pâturage"],
    heroCvTracking: "Suivi CV",
    heroCvCount: "47 animaux",
    commandViewLabel: "Vue de commande bétail",
    commandTitle: "Le pouls du terrain d'aujourd'hui",
    commandBadge: "Synchronisé",
    liveSyncLabel: "Synchronisation live",
    liveSyncText: "Mis à jour toutes les 2 minutes",
    aiTrendSignal: "Signal IA",
    aiImproving: "En amélioration",
    aiLayerActive: "Couche IA active",
    thermalOverlay: "Superposition thermique + mouvement",
    aiWelfareSummary: "Résumé bien-être IA",
    gpsOverlay: "Superposition GPS + météo",
    scanButtonStart: "Démarrer le contrôle du bétail",
    scanButtonRunning: "Contrôle en cours",
    scanButtonStop: "Arrêter le scan",
    clinicalStatus: "État clinique",
    scanReady: "Prêt pour le scan",
    scanOpening: "Ouverture du scan clinique",
    scanExamining: "Examen du bétail",
    scanForecastReady: "Prévision prête",
    scanStageReady: "Salle d'examen prête",
    scanStageOpening: "Triage caméra",
    scanStageExamining: "Analyse vitaux",
    scanStageForecast: "Prévision condition",
    scanReadyMessage:
      "Utilisez votre caméra comme un contrôle terrain : cadrer un animal et AgroNexis prévoira les signaux visibles de bien-être.",
    scanOpeningMessage:
      "Cadrer un animal de face ou de côté. AgroNexis prépare les vérifications posture, pelage, respiration et stress thermique.",
    scanExaminingMessage:
      "Contrôle IA en cours : estimation posture, respiration, risque hydrique et condition corporelle.",
    scanForecastMessage:
      "Prévision : stress thermique léger probable dans 90 minutes. Déplacer le groupe à l'ombre et vérifier l'accès à l'eau.",
    scanDemoMessage:
      "Prévision démo : risque de stress thermique détecté. Action suggérée : rotation à l'ombre, vérification de l'eau, re-scan dans 90 minutes.",
    doctorExamLabel: "Examen style médecin",
    postureStable: "Posture stable",
    respirationWatch: "Surveillance respiration",
    conditionForecastLabel: "Prévision condition IA",
    conditionForecastAdvice:
      "Risque de stress thermique léger. Vérifiez l'accès à l'eau, déplacez le groupe à l'ombre et re-scannez après récupération.",
  },
  es: {
    eyebrow: "Agricultura de precisión con IA",
    heroTitle: "Monitoreo ganadero, mapas y clima en una sola plataforma.",
    heroText:
      "AgroNexis ayuda a las fincas a monitorear salud animal, mapear presión de pastoreo, prever clima y coordinar equipos multilingües.",
    primaryCta: "Ver inteligencia",
    secondaryCta: "Iniciar escaneo",
    platformEyebrow: "Plataforma",
    platformTitle: "Un sistema responsive para decisiones ganaderas y de campo.",
    platformText:
      "Reemplace reportes dispersos con un espacio multilingüe para gerentes, veterinarios, agrónomos y operadores.",
    livestockEyebrow: "Monitoreo ganadero",
    livestockTitle: "Detecte salud, movimiento y estrés térmico antes de perder rendimiento.",
    livestockText:
      "Siga comportamiento, presión de potrero, eficiencia alimentaria y bienestar con resúmenes accionables de IA.",
    mapEyebrow: "Mapeo geoespacial",
    mapTitle: "Mapee potreros, zonas de riesgo y exposición climática.",
    mapText:
      "Combine zonas GPS, movimiento animal, condición del pasto y alertas meteorológicas en una vista espacial clara.",
    scanEyebrow: "Escaneo en vivo",
    scanTitle: "Convierta el campo frente a usted en orientación instantánea.",
    scanText:
      "Escanee ganado, pasto o cultivos. La interfaz revela estrés, presión hídrica y acciones prioritarias.",
    dashboardEyebrow: "Inteligencia IA",
    dashboardTitle: "Panel agrícola en tiempo real",
    recommendations: "Recomendaciones IA",
    weatherEyebrow: "Clima y operaciones",
    weatherTitle: "Planifique el próximo movimiento con menos incertidumbre.",
    pricingEyebrow: "Lanzar AgroNexis",
    pricingTitle: "Despliegue su centro de comando agrícola IA en días.",
    pricingText:
      "Conecte ganado, mapas, clima y datos de campo en un espacio premium para decisiones diarias.",
    startPlanning: "Planificar",
    brandTag: "Inteligencia ganadera",
    heroMiniLabels: ["Calor", "Movimiento", "Pastoreo"],
    heroCvTracking: "Seguimiento CV",
    heroCvCount: "47 animales",
    commandViewLabel: "Vista de comando ganadero",
    commandTitle: "Pulso del campo hoy",
    commandBadge: "Sincronizado",
    liveSyncLabel: "Sincronización en vivo",
    liveSyncText: "Actualizado cada 2 minutos",
    aiTrendSignal: "Señal IA",
    aiImproving: "Mejorando",
    aiLayerActive: "Capa IA activa",
    thermalOverlay: "Superposición térmica + movimiento",
    aiWelfareSummary: "Resumen de bienestar IA",
    gpsOverlay: "Superposición GPS + clima",
    scanButtonStart: "Iniciar chequeo ganadero",
    scanButtonRunning: "Chequeo en curso",
    scanButtonStop: "Detener escaneo",
    clinicalStatus: "Estado clínico",
    scanReady: "Listo para escanear",
    scanOpening: "Abriendo chequeo clínico",
    scanExamining: "Examinando ganado",
    scanForecastReady: "Pronóstico listo",
    scanStageReady: "Sala de examen lista",
    scanStageOpening: "Triage de cámara",
    scanStageExamining: "Análisis de vitales",
    scanStageForecast: "Pronóstico de condición",
    scanReadyMessage:
      "Use su cámara como una revisión de campo: enfoque a un animal y AgroNexis pronosticará señales visibles de bienestar.",
    scanOpeningMessage:
      "Enfoque a un animal de lado o frente. AgroNexis está preparando verificación de postura, pelaje, respiración y estrés térmico.",
    scanExaminingMessage:
      "Chequeo IA en curso: estimando postura, estrés respiratorio, riesgo de hidratación y condición corporal.",
    scanForecastMessage:
      "Pronóstico: probable estrés térmico leve en los próximos 90 minutos. Lleve el grupo a la sombra y confirme el acceso al agua.",
    scanDemoMessage:
      "Pronóstico demo: riesgo de estrés térmico detectado. Acción sugerida: rotación a sombra, revisar agua, volver a escanear en 90 minutos.",
    doctorExamLabel: "Examen estilo médico",
    postureStable: "Postura estable",
    respirationWatch: "Vigilancia respiratoria",
    conditionForecastLabel: "Pronóstico de condición IA",
    conditionForecastAdvice:
      "Riesgo leve de estrés térmico. Revise el acceso al agua, lleve al grupo a la sombra y vuelva a escanear después de la recuperación.",
  },
} as const;

const stats = [
  { value: "18K+", label: "livestock monitored" },
  { value: "1,240", label: "connected farms" },
  { value: "98%", label: "forecast confidence" },
];

const capabilities = [
  {
    title: "Crop intelligence",
    text: "Detect canopy stress, irrigation gaps, and growth changes before they become expensive field issues.",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Livestock monitoring",
    text: "Track herd movement, heat exposure, feed efficiency, and pasture pressure from one operational view.",
    image:
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Weather-led planning",
    text: "Prioritize spraying, grazing, irrigation, and harvest windows with live risk scoring.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85",
  },
];

const dashboardTiles = [
  { label: "Herd wellness", value: "91%", change: "+7%", note: "Movement and feeding patterns stable" },
  { label: "Feed efficiency", value: "92%", change: "+9%", note: "Improved this week" },
  { label: "Heat stress", value: "Medium", change: "+4%", note: "Shade rotation recommended" },
  { label: "Weather risk", value: "Low", change: "-12%", note: "Conditions stable" },
];

const recommendations = [
  "Start blueberry irrigation cycle before 14:00.",
  "Move south paddock cattle toward shaded grazing.",
  "Delay foliar spray until wind drops below 8 km/h.",
];

const zones = [
  { zone: "North paddock", status: "Healthy", score: "92%", note: "Stable canopy and water access" },
  { zone: "West gate", status: "Watch", score: "74%", note: "Moisture dipping along the fence line" },
  { zone: "River corner", status: "Alert", score: "61%", note: "Grazing pressure is above target" },
];

const livestockSignals = [
  { label: "Heat-stress index", value: "27.4", note: "Watch afternoon shade access" },
  { label: "Grazing movement", value: "8.2 km", note: "Normal for current paddock size" },
  { label: "Water-point visits", value: "312", note: "Up 11% after midday temperature rise" },
];

const clinicalVitals = [
  { label: "Posture", value: "Stable", detail: "Normal standing balance" },
  { label: "Respiration", value: "Elevated", detail: "Heat-linked breathing pattern" },
  { label: "Hydration", value: "Watch", detail: "Recommend water access check" },
  { label: "Body condition", value: "Good", detail: "No visible decline detected" },
];

const conditionForecast = [
  { label: "Current condition", value: "Mild heat stress" },
  { label: "Forecast window", value: "90 min" },
  { label: "Clinical confidence", value: "94%" },
];

const mapLayers = [
  { label: "Herd cluster", position: "left-[58%] top-[36%]", color: "bg-[#43A047]" },
  { label: "Heat risk", position: "left-[34%] top-[58%]", color: "bg-amber-400" },
  { label: "Water point", position: "left-[72%] top-[64%]", color: "bg-[#1565C0]" },
];

const aiSignals = [
  "Computer vision active",
  "GPS collar sync",
  "Weather model live",
  "Multilingual alerts",
];

const progressBars = [
  { label: "Soil hydration", value: 82 },
  { label: "Disease prevention", value: 68 },
  { label: "Yield forecast confidence", value: 94 },
];

const trendPoints = [48, 56, 54, 72, 68, 84, 78];

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "Alert"
      ? "bg-red-50 text-red-700 ring-red-200"
      : status === "Watch"
        ? "bg-amber-50 text-amber-800 ring-amber-200"
        : "bg-[#F1F8E9] text-[#1B5E20] ring-[#43A047]/25";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles}`}>
      {status}
    </span>
  );
}

function BrandMark() {
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[linear-gradient(135deg,#43A047,#1B5E20_52%,#1565C0)] shadow-[0_0_28px_rgba(67,160,71,0.35)]">
      <span className="absolute inset-1 rounded-lg border border-white/18" />
      <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-white/90" />
      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#8FC7FF]" />
      <span className="absolute bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#A5D6A7]" />
      <span className="absolute left-[14px] top-[17px] h-px w-5 rotate-[-28deg] bg-white/45" />
      <span className="absolute right-[14px] top-[17px] h-px w-5 rotate-[28deg] bg-white/45" />
      <span className="relative text-sm font-black tracking-tight text-white">AN</span>
    </span>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>(copy.en.scanReady);
  const [scanMessage, setScanMessage] = useState<string>(copy.en.scanReadyMessage);
  const [scanStage, setScanStage] = useState<string>(copy.en.scanStageReady);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stopScan = () => {
    scanTimersRef.current.forEach((timer) => clearTimeout(timer));
    scanTimersRef.current = [];

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setScanStatus(copy[language].scanReady);
    setScanStage(copy[language].scanStageReady);
    setScanMessage(copy[language].scanReadyMessage);
  };

  const startScan = async () => {
    scanTimersRef.current.forEach((timer) => clearTimeout(timer));
    scanTimersRef.current = [];
    setCameraError("");
    setScanStatus(copy[language].scanOpening);
    setScanStage(copy[language].scanStageOpening);
    setScanMessage(copy[language].scanOpeningMessage);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsScanning(true);
      setScanStatus(copy[language].scanExamining);
      setScanStage(copy[language].scanStageExamining);
      setScanMessage(copy[language].scanExaminingMessage);
      scanTimersRef.current = [
        setTimeout(() => {
          setScanStage(copy[language].scanStageForecast);
          setScanStatus(copy[language].scanForecastReady);
          setScanMessage(copy[language].scanForecastMessage);
        }, 2600),
      ];
    } catch (error) {
      console.error(error);
      setCameraError("Camera access is blocked or unavailable, so the scan is running as a guided demo.");
      setScanStatus("Demo check-up");
      setScanStage(copy[language].scanStageForecast);
      setScanMessage(copy[language].scanDemoMessage);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      stopScan();
    };
  }, []);

  const t = copy[language];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#07140A_0%,#0E2712_26%,#F1F8E9_58%)] text-[#1C1C1C]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07140A]/86 text-white backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 lg:px-8 2xl:px-10">
          <a href="#home" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
            <BrandMark />
            <span>
              <span className="block bg-gradient-to-r from-[#8FC7FF] via-[#A5D6A7] to-[#43A047] bg-clip-text text-lg font-bold leading-none tracking-tight text-transparent">
                AgroNexis AI
              </span>
              <span className="mt-1 block text-xs uppercase tracking-[0.22em] text-white">
                {copy[language].brandTag}
              </span>
            </span>
          </a>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white sm:hidden"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>

          <div
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } absolute left-5 right-5 top-[72px] flex-col gap-1 rounded-lg border border-white/10 bg-[#07140A]/96 p-2 shadow-xl sm:static sm:flex sm:flex-row sm:items-center sm:gap-1 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none`}
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white/72 transition hover:bg-white/10 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-1 flex rounded-lg border border-white/10 bg-white/10 p-1 sm:ml-2 sm:mt-0">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLanguage(item.code)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                    language === item.code
                      ? "bg-[#43A047] text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-pressed={language === item.code}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <section id="home" className="relative min-h-[calc(100vh-72px)] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=90"
          alt="Aerial view of agricultural fields"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,18,8,0.95)_0%,rgba(27,94,32,0.78)_42%,rgba(21,101,192,0.34)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />

        <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-[1440px] items-center gap-8 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16 xl:gap-12 2xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="max-w-3xl text-white xl:max-w-4xl"
          >
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20 backdrop-blur-xl">
              {t.eyebrow}
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl xl:text-[84px] xl:leading-[0.95]">
              {t.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/88 sm:text-lg">
              {t.heroText}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#intelligence"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-[#F1F8E9]"
              >
                {t.primaryCta}
              </a>
              <a
                href="#scan"
                className="inline-flex items-center justify-center rounded-lg border border-white/35 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                {t.secondaryCta}
              </a>
            </div>

            <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3 xl:max-w-2xl">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/20 bg-white/12 p-4 backdrop-blur xl:p-5">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="mt-2 text-sm text-white/78">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {aiSignals.map((signal) => (
                <span key={signal} className="rounded-full border border-white/15 bg-black/24 px-3 py-1.5 text-xs font-semibold text-white/82 backdrop-blur">
                  {signal}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
            className="w-full self-center rounded-lg border border-white/15 bg-[#07140A]/82 p-3 text-white shadow-[0_25px_80px_rgba(4,18,8,0.45)] backdrop-blur-xl xl:p-4"
          >
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, -0.4, 0] }}
              transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
              className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr] xl:gap-4"
            >
              <div className="relative min-h-[300px] overflow-hidden rounded-lg xl:min-h-[460px]">
                <Image
                  src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1000&q=88"
                  alt="Cattle grazing in pasture monitored by an AI platform"
                  fill
                  sizes="(min-width: 1280px) 440px, (min-width: 1024px) 340px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(7,20,10,0.72))]" />
                <div className="absolute left-4 top-4 rounded-lg border border-white/15 bg-black/38 px-3 py-2 text-xs font-bold text-white backdrop-blur">
                  {t.heroCvTracking}: {t.heroCvCount}
                </div>
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                  {t.heroMiniLabels.map((item) => (
                    <motion.div
                      key={item}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur"
                    >
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/58">{item}</p>
                      <p className="mt-1 text-lg font-bold text-[#A5D6A7]">OK</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="p-2 xl:p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8FC7FF]">
                      {t.commandViewLabel}
                    </p>
                    <h2 className="mt-3 text-2xl font-bold text-white xl:text-3xl">{t.commandTitle}</h2>
                  </div>
                  <span className="rounded-full bg-[#43A047]/16 px-3 py-1 text-xs font-bold text-[#A5D6A7] ring-1 ring-[#43A047]/30">
                    {t.commandBadge}
                  </span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {dashboardTiles.slice(0, 4).map((tile, index) => (
                    <motion.div
                      key={tile.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="rounded-lg border border-white/10 bg-white/8 p-4 xl:p-5"
                    >
                      <p className="text-sm text-white/58">{tile.label}</p>
                      <p className="mt-2 text-2xl font-bold">{tile.value}</p>
                      <p className="mt-1 text-sm font-semibold text-[#43A047]">{tile.change}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-[1440px] px-5 py-14 text-white lg:px-8 xl:py-20 2xl:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#8FC7FF]">{t.platformEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.platformTitle}
            </h2>
          </div>
          <p className="max-w-3xl text-base leading-8 text-white/70">
            {t.platformText}
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3 xl:gap-6">
          {capabilities.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="group overflow-hidden rounded-lg border border-white/10 bg-white/8 shadow-2xl shadow-black/20 backdrop-blur"
            >
              <div className="relative h-56 xl:h-72">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(min-width: 1440px) 450px, (min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(7,20,10,0.84))]" />
                <div className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/34 px-3 py-1 text-xs font-bold text-[#A5D6A7] backdrop-blur">
                  {t.aiLayerActive}
                </div>
              </div>
              <div className="p-5 xl:p-6">
                <h3 className="text-xl font-bold">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/68">{card.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="livestock" className="mx-auto max-w-[1440px] px-5 pb-14 lg:px-8 xl:pb-20 2xl:px-10">
        <div className="grid gap-6 overflow-hidden rounded-lg border border-white/10 bg-[#07140A] p-5 text-white shadow-2xl shadow-black/25 lg:grid-cols-[0.95fr_1.05fr] lg:items-center xl:gap-8 xl:p-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#8FC7FF]">{t.livestockEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl xl:text-5xl">
              {t.livestockTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/70">
              {t.livestockText}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {livestockSignals.map((signal) => (
                <div key={signal.label} className="rounded-lg border border-white/10 bg-white/8 p-4 backdrop-blur">
                  <p className="text-sm text-white/58">{signal.label}</p>
                  <p className="mt-3 text-3xl font-bold text-[#A5D6A7]">{signal.value}</p>
                  <p className="mt-2 text-sm leading-6 text-white/66">{signal.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-lg lg:min-h-[460px] xl:min-h-[540px]">
            <Image
              src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=85"
              alt="Healthy cattle grazing in open pasture"
              fill
              sizes="(min-width: 1440px) 680px, (min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,10,0.08),rgba(7,20,10,0.68))]" />
            <motion.div
              animate={{ scale: [1, 1.03, 1], opacity: [0.72, 1, 0.72] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[18%] top-[32%] h-20 w-28 rounded-full border border-[#43A047] bg-[#43A047]/10 shadow-[0_0_34px_rgba(67,160,71,0.5)]"
            />
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.68, 1, 0.68] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
              className="absolute right-[24%] top-[40%] h-24 w-32 rounded-full border border-[#1565C0] bg-[#1565C0]/10 shadow-[0_0_34px_rgba(21,101,192,0.45)]"
            />
            <div className="absolute left-4 top-4 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-xs font-bold text-white backdrop-blur">
              {t.thermalOverlay}
            </div>
            <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/20 bg-[#07140A]/86 p-4 text-white backdrop-blur">
              <p className="text-sm font-bold text-[#A5D6A7]">{t.aiWelfareSummary}</p>
              <p className="mt-2 text-sm leading-6 text-white/88">
                Herd behavior is stable. Two animals are trending toward elevated heat exposure near the west fence line.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="scan" className="bg-[radial-gradient(circle_at_top_left,rgba(21,101,192,0.34),transparent_34%),linear-gradient(135deg,#07140A,#1B5E20)] py-14 text-white">
        <div className="mx-auto grid max-w-[1440px] gap-6 px-5 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:px-8 xl:gap-10 xl:py-6 2xl:px-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#A5D6A7]">{t.scanEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl xl:text-5xl">
              {t.scanTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/78">
              {t.scanText}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startScan}
                className="rounded-lg bg-[#43A047] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#388E3C]"
              >
                {isScanning ? t.scanButtonRunning : t.scanButtonStart}
              </button>
              <button
                type="button"
                onClick={stopScan}
                className="rounded-lg border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
              >
                {t.scanButtonStop}
              </button>
            </div>

            <div className="mt-6 max-w-2xl rounded-lg border border-white/10 bg-white/5 p-5 xl:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-white/58">{t.clinicalStatus}</p>
                  <p className="mt-1 text-xl font-bold">{scanStatus}</p>
                </div>
                <span className="rounded-full bg-[#1565C0]/25 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/20">
                  {scanStage}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/74">{scanMessage}</p>
              {cameraError ? (
                <p className="mt-4 rounded-lg border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-50">
                  {cameraError}
                </p>
              ) : null}

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {conditionForecast.map((item) => (
                  <div key={item.label} className="rounded-lg border border-white/10 bg-black/18 p-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/45">{item.label}</p>
                    <p className="mt-2 text-lg font-bold text-[#A5D6A7]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 p-2 shadow-2xl shadow-black/30">
            <div className="relative h-[420px] overflow-hidden rounded-lg bg-[#1C1C1C] lg:h-[520px] xl:h-[600px]">
              {isScanning ? (
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
              ) : (
                <Image
                  src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=85"
                  alt="Livestock health scan preview"
                  fill
                  sizes="(min-width: 1440px) 760px, (min-width: 1024px) 56vw, 100vw"
                  className="object-cover"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(67,160,71,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(21,101,192,0.16)_1px,transparent_1px)] bg-[size:48px_48px]" />
              <motion.div
                animate={{ scale: [1, 1.03, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[18%] top-[20%] h-24 w-36 rounded-full border border-[#43A047] bg-[#43A047]/10 shadow-[0_0_34px_rgba(67,160,71,0.45)]"
              >
                <span className="absolute -top-8 left-0 rounded bg-black/50 px-2 py-1 text-xs font-bold text-[#A5D6A7] backdrop-blur">{t.postureStable}</span>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.76, 1, 0.76] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
                className="absolute right-[18%] top-[34%] h-28 w-40 rounded-full border border-[#1565C0] bg-[#1565C0]/10 shadow-[0_0_34px_rgba(21,101,192,0.4)]"
              >
                <span className="absolute -top-8 right-0 rounded bg-black/50 px-2 py-1 text-xs font-bold text-[#8FC7FF] backdrop-blur">{t.respirationWatch}</span>
              </motion.div>
              <div className="absolute left-4 top-4 rounded-lg border border-white/15 bg-black/42 px-3 py-2 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FC7FF]">{t.doctorExamLabel}</p>
                <p className="mt-1 text-sm font-semibold text-white">{scanStage}</p>
              </div>

              <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/15 bg-[#07140A]/88 p-4 backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#A5D6A7]">{t.conditionForecastLabel}</p>
                    <p className="mt-2 text-sm leading-6 text-white/90">
                      {t.conditionForecastAdvice}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#43A047]/18 px-3 py-1 text-xs font-bold text-[#A5D6A7] ring-1 ring-[#43A047]/30">
                    94% confidence
                  </span>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-4">
                  {clinicalVitals.map((vital) => (
                    <div key={vital.label} className="rounded-lg border border-white/10 bg-white/8 p-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-white/45">{vital.label}</p>
                      <p className="mt-1 text-sm font-bold text-white">{vital.value}</p>
                      <p className="mt-1 text-xs leading-5 text-white/55">{vital.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mapping" className="mx-auto max-w-[1440px] px-5 py-14 lg:px-8 xl:py-20 2xl:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center xl:gap-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#1565C0]">{t.mapEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl xl:text-5xl">
              {t.mapTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#1C1C1C]/70">
              {t.mapText}
            </p>
            <div className="mt-6 space-y-3">
              {zones.map((zone) => (
                <div key={zone.zone} className="rounded-lg border border-[#1B5E20]/10 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold">{zone.zone}</p>
                    <StatusBadge status={zone.status} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#1C1C1C]/70">{zone.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-[#1B5E20]/10 bg-[#07140A] p-4 shadow-2xl shadow-black/20 lg:min-h-[540px]">
            <Image
              src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1400&q=88"
              alt="Aerial agricultural mapping view"
              fill
              sizes="(min-width: 1440px) 760px, (min-width: 1024px) 56vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,20,10,0.32),rgba(21,101,192,0.18)),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:auto,64px_64px,64px_64px]" />
            <div className="absolute left-[10%] top-[14%] h-[70%] w-[78%] rounded-[18px] border-2 border-[#43A047]/70 bg-[#43A047]/8 shadow-[0_0_40px_rgba(67,160,71,0.22)]" />
            <div className="absolute left-[22%] top-[25%] h-[26%] w-[24%] rounded-[16px] border border-[#43A047]/70 bg-[#43A047]/16" />
            <div className="absolute right-[18%] top-[28%] h-[26%] w-[27%] rounded-[16px] border border-[#1565C0]/70 bg-[#1565C0]/16" />
            <div className="absolute bottom-[18%] left-[35%] h-[22%] w-[38%] rounded-[16px] border border-amber-300/80 bg-amber-300/14" />

            {mapLayers.map((layer) => (
              <div key={layer.label} className={`absolute ${layer.position}`}>
                <div className={`h-4 w-4 rounded-full ${layer.color} ring-4 ring-white/80 shadow-lg`} />
                <div className="mt-2 whitespace-nowrap rounded-lg border border-white/15 bg-[#07140A]/86 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur">
                  {layer.label}
                </div>
              </div>
            ))}

            <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-white/15 bg-[#07140A]/86 p-4 text-white backdrop-blur">
              <p className="text-sm font-bold text-[#8FC7FF]">GPS + weather overlay</p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                North paddock is safe for grazing. River corner needs rotation before the afternoon heat window.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="intelligence" className="mx-auto max-w-[1440px] px-5 py-14 lg:px-8 xl:py-20 2xl:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] xl:gap-8">
          <div className="rounded-lg border border-[#1B5E20]/10 bg-white p-5 shadow-sm xl:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#1565C0]">{t.dashboardEyebrow}</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight xl:text-4xl">{t.dashboardTitle}</h2>
              </div>
              <div className="rounded-lg bg-[#F1F8E9] px-4 py-3 text-sm text-[#1B5E20] ring-1 ring-[#43A047]/25">
                <p className="font-bold">{t.liveSyncLabel}</p>
                <p className="mt-1">{t.liveSyncText}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:gap-4">
              {dashboardTiles.map((tile) => (
                <div key={tile.label} className="rounded-lg border border-[#1B5E20]/10 bg-[#F1F8E9] p-4 xl:p-5">
                  <p className="text-sm text-[#1C1C1C]/60">{tile.label}</p>
                  <p className="mt-3 text-3xl font-bold">{tile.value}</p>
                  <p className="mt-2 text-sm font-bold text-[#43A047]">{tile.change}</p>
                  <p className="mt-3 text-sm text-[#1C1C1C]/70">{tile.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-[#1565C0]/20 bg-[#1C1C1C] p-5 text-white xl:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/58">{t.aiTrendSignal}</p>
                  <p className="mt-2 text-3xl font-bold">+12%</p>
                </div>
                <span className="rounded-full bg-[#43A047]/16 px-3 py-1 text-sm font-bold text-[#A5D6A7]">
                  {t.aiImproving}
                </span>
              </div>
              <svg viewBox="0 0 320 110" className="mt-4 h-28 w-full overflow-visible" role="img" aria-label="AI performance line chart">
                <path
                  d="M 0 90 C 25 78, 45 60, 70 64 S 110 78, 130 56 S 175 34, 200 42 S 245 58, 270 40 S 300 26, 320 24"
                  fill="none"
                  stroke="#43A047"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {trendPoints.map((point, index) => {
                  const x = index * 50;
                  const y = 100 - point;

                  return <circle key={`${point}-${index}`} cx={x} cy={y} r="4" fill="#1C1C1C" stroke="#1565C0" strokeWidth="2" />;
                })}
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-[#1B5E20]/10 bg-white p-5 shadow-sm xl:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-[#1565C0]">{t.recommendations}</p>
                  <h3 className="mt-2 text-2xl font-bold">Today&apos;s priorities</h3>
                </div>
                <span className="rounded-full bg-[#1565C0]/10 px-3 py-1 text-sm font-bold text-[#1565C0] ring-1 ring-[#1565C0]/20">
                  3 actions
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {recommendations.map((item) => (
                  <div key={item} className="rounded-lg border border-[#1B5E20]/10 bg-[#F1F8E9] px-4 py-3 text-sm text-[#1C1C1C]/76 xl:px-5 xl:py-4">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#1B5E20]/10 bg-white p-5 shadow-sm xl:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#1565C0]">Geo-intelligence</p>
              <div className="mt-5 space-y-3">
                {zones.map((zone) => (
                  <div key={zone.zone} className="rounded-lg border border-[#1B5E20]/10 bg-[#F1F8E9] p-4 xl:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold">{zone.zone}</p>
                      <StatusBadge status={zone.status} />
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-4 text-sm text-[#1C1C1C]/70">
                      <span className="font-bold text-[#1C1C1C]">{zone.score}</span>
                      <span className="text-right">{zone.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="weather" className="bg-[#DDEED4] py-14">
        <div className="mx-auto grid max-w-[1440px] gap-6 px-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8 xl:gap-10 xl:py-6 2xl:px-10">
          <div className="relative min-h-[420px] overflow-hidden rounded-lg lg:min-h-[520px] xl:min-h-[620px]">
            <Image
              src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1200&q=85"
              alt="Farm team reviewing agricultural data on a tablet"
              fill
              sizes="(min-width: 1440px) 650px, (min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="grid gap-4 content-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#1565C0]">{t.weatherEyebrow}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl xl:text-5xl">
                {t.weatherTitle}
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:gap-6">
              <div className="rounded-lg border border-[#1B5E20]/12 bg-white/82 p-5 xl:p-6">
                <p className="text-sm text-[#1C1C1C]/60">Weather watch</p>
                <p className="mt-3 text-4xl font-bold">24 deg C</p>
                <p className="mt-2 text-sm text-[#1C1C1C]/70">Light breeze / low stress window</p>
                <div className="mt-5">
                  <div className="flex items-center justify-between text-sm text-[#1C1C1C]/72">
                    <span>Humidity</span>
                    <span>47%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#1B5E20]/12">
                    <div className="h-2 rounded-full bg-[#1565C0]" style={{ width: "47%" }} />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[#1B5E20]/12 bg-white/82 p-5 xl:p-6">
                <p className="text-sm text-[#1C1C1C]/60">Operational pulse</p>
                <div className="mt-5 space-y-4">
                  {progressBars.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-sm text-[#1C1C1C]/72">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-[#1B5E20]/12">
                        <div className="h-2 rounded-full bg-[#43A047]" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-[1440px] px-5 py-14 lg:px-8 xl:py-20 2xl:px-10">
        <div className="grid gap-6 rounded-lg bg-[#1B5E20] p-6 text-white shadow-xl lg:grid-cols-[1fr_auto] lg:items-center lg:p-8 xl:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#A5D6A7]">{t.pricingEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight xl:text-4xl">{t.pricingTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/76">
              {t.pricingText}
            </p>
          </div>
          <a
            href="#home"
            className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-[#F1F8E9]"
          >
            {t.startPlanning}
          </a>
        </div>
      </section>

      <footer className="border-t border-[#1B5E20]/10 px-5 py-6 text-sm text-[#1C1C1C]/58 lg:px-8 2xl:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2026 AgroNexis AI. Built for precision agriculture teams.</p>
          <p>Trusted by modern growers and livestock operators.</p>
        </div>
      </footer>
    </main>
  );
}
